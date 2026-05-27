import OpenAI from 'openai';
import { intentAnalysisSchema } from '../schemas/intentSchema';
import { fetchMoviesFromTMDB } from '../services/tmdbService';
import { connectToDB } from '../db';
import { ChatSession } from '../schemas/chatModel';
import { Movie } from '../schemas/movieSchema';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handleChatLogic(messages: ChatMessage[], sessionId?: string) {

  const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/cineclub";
  await connectToDB(uri);
  
  let currentSession;

  // si no viene sessionId del frontend, creamos o buscamos la sesión en Mongo
  if (!sessionId) {
    currentSession = await ChatSession.create({ messages: [] });
  } else {
    try {
      currentSession = await ChatSession.findById(sessionId);
    } catch {
      currentSession = null;
    }
    if (!currentSession) {
      currentSession = await ChatSession.create({ messages: [] });
    }
  }

  //guarda el último mensaje
  const lastUserMessage = messages[messages.length - 1];
  currentSession.messages.push({
    role: lastUserMessage.role,
    content: lastUserMessage.content,
    createdAt: new Date()
  });
  await currentSession.save();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Sos un asistente de un cineclub. Analizá el último mensaje del usuario y devolvé UNICAMENTE un JSON válido que cumpla exactamente con este esquema:
        {
          "intent": "search_movies" o "general_chat",
          "confidence": un número entre 0 y 1,
          "extractedParameters": {
            "title": string opcional,
            "genres": array de strings opcional,
            "year": number opcional,
            "rating": number opcional,
            "original_language": string opcional
          },
          "explanation": string breve
        }
        No agregues markdown, ni texto antes o después del JSON.`
      },
      {
        role: 'user',
        content: lastUserMessage.content
      }
    ]
  });

  const apiResponseData = JSON.parse(response.choices[0].message.content || "{}");
  const validatedAnalysis = intentAnalysisSchema.parse(apiResponseData);

  let finalAssistantResponse = '';
  
  let movies: Movie[] = []; 

  if (validatedAnalysis.intent === 'search_movies' && validatedAnalysis.extractedParameters) {
    
    // 3. Pasamos los parámetros limpios. El pasamanos se encarga de acoplarlo.
    movies = await fetchMoviesFromTMDB({
      title: validatedAnalysis.extractedParameters.title,
      genres: validatedAnalysis.extractedParameters.genres?.join(','), 
      year: validatedAnalysis.extractedParameters.year,
      rating: validatedAnalysis.extractedParameters.rating,
      original_language: validatedAnalysis.extractedParameters.original_language
    });
    
    if (movies.length === 0) {
      finalAssistantResponse = 'Analicé tu propuesta para el ciclo, pero actualmente no encontré películas en nuestro catálogo que coincidan exactamente con esos filtros.';
    } else {
      finalAssistantResponse = `¡Lista de cine armado con éxito! Acá tenés las opciones ideales que encontré en el catálogo:\n` +
        movies.map(m => `🎬 ${m.title} - (${m.year}) - ⭐ Rating: ${m.rating} - 🌍 Idioma: ${m.original_language}`).join('\n');
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

  currentSession.messages.push({
    role: 'assistant',
    content: finalAssistantResponse,
    createdAt: new Date()
  });
  await currentSession.save();

  return {
    sessionId: currentSession._id.toString(),
    message: {
      role: 'assistant',
      content: finalAssistantResponse
    },
    debug: {
      intent: validatedAnalysis.intent,
      confidence: validatedAnalysis.confidence,
      payload: validatedAnalysis.extractedParameters,
      result: movies
    }
  };
}