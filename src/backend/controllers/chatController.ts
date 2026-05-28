import OpenAI from 'openai';
import { intentAnalysisSchema } from '../schemas/intentSchema';
import { connectToDB } from '../db';
import { Movie } from '../schemas/movieSchema';
import { MongoChatRepository} from '../repositories/mongoChatRepository';
import { TmdbApiRepository } from '../repositories/tmdbApiRepository'; 
import { IChatMessage } from '../interfaces/chatRepositoryInterface';
import { INTENT_SYSTEM_PROMPT } from '../prompts/intentPrompt';

const chatRepository = new MongoChatRepository();
const movieService = new TmdbApiRepository();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handleChatLogic(messages: IChatMessage[], sessionId?: string) {

  const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/cineclub";
  await connectToDB(uri);
 
  const lastUserMessage = messages[messages.length - 1];
  const activeSessionId = sessionId || new Date().getTime().toString(); // Generamos ID si es nuevo

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: INTENT_SYSTEM_PROMPT },
      { role: 'user', content: lastUserMessage.content }
    ]
  });

  const apiResponseData = JSON.parse(response.choices[0].message.content || "{}");
  const validatedAnalysis = intentAnalysisSchema.parse(apiResponseData);

  let finalAssistantResponse = '';
  let movies: Movie[] = []; 

  if (validatedAnalysis.intent === 'search_movies' && validatedAnalysis.extractedParameters) {
    movies = await movieService.fetchMovies({
      title: validatedAnalysis.extractedParameters.title,
      genres: validatedAnalysis.extractedParameters.genres?.join(','), 
      year: validatedAnalysis.extractedParameters.year,
      rating: validatedAnalysis.extractedParameters.rating,
      original_language: validatedAnalysis.extractedParameters.original_language,
      limit: validatedAnalysis.extractedParameters.limit,
      sort: validatedAnalysis.extractedParameters.sort
    });
    
    if (movies.length === 0) {
      finalAssistantResponse = 'Analicé tu propuesta para el ciclo, pero actualmente no encontré películas en nuestro catálogo que coincidan exactamente con esos filtros.';
    } else {
      finalAssistantResponse = `¡Lista de cine armado con éxito! Acá tenés las opciones ideales que encontré en el catálogo:\n`;
    }
  } else {
    const generalResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sos un asistente experto en cine amigable. Responde de forma cálida y concisa.' },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ]
    });
    finalAssistantResponse = generalResponse.choices[0].message.content || '¿En qué te puedo ayudar hoy con tu cineclub?';
  }

  const assistantMessage = {
    role: 'assistant' as const,
    content: finalAssistantResponse,
    movies: movies.length > 0 ? movies : undefined
  };

  // unimos todo el historial que venía del frontend con la nueva respuesta
  const fullChatHistory = [...messages, assistantMessage];

  await chatRepository.saveOrUpdateSession(activeSessionId, fullChatHistory);

  return {
    sessionId: activeSessionId,
    message: assistantMessage, // Devolvemos el objeto limpio con las cards
    debug: {
      intent: validatedAnalysis.intent,
      confidence: validatedAnalysis.confidence,
      payload: validatedAnalysis.extractedParameters,
      result: movies
    }
  };
}