import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { ValidationError } from '../../common/errors/app.error';
import { MovieSearchService } from '../../tmdb/services/movie-search.service';
import { IntentAnalysisService } from '../services/intent-analysis.service';
import { GeneralChatService } from '../services/general-chat.service';
import { ChatMessage } from '../interfaces/chat.types';
import { ChatRepository } from '../repositories/chat.repository';
import { chatMessageSchema } from '../dto/chat.dto';

const incomingMessagesSchema = z.array(chatMessageSchema).min(1);

export interface HandleChatResponse {
  sessionId: string;
  message: ChatMessage;
  debug?: {
    intent: 'search_movies' | 'general_chat';
    confidence: number;
    payload: unknown;
    result: unknown;
  };
}

@Injectable()
export class HandleChatUseCase {
  constructor(
    @Inject(ChatRepository) private readonly chatRepository: ChatRepository,
    @Inject(MovieSearchService) private readonly movieSearchService: MovieSearchService,
    @Inject(IntentAnalysisService) private readonly intentAnalysisService: IntentAnalysisService,
    @Inject(GeneralChatService) private readonly generalChatService: GeneralChatService
  ) {}

  async execute(messages: ChatMessage[], sessionId?: string): Promise<HandleChatResponse> {
    const parsedMessages = incomingMessagesSchema.safeParse(messages);
    if (!parsedMessages.success) {
      throw new ValidationError('El formato de mensajes no es válido.', parsedMessages.error.flatten());
    }

    const lastUserMessage = parsedMessages.data[parsedMessages.data.length - 1];
    if (lastUserMessage.role !== 'user') {
      throw new ValidationError('El último mensaje debe pertenecer al usuario.');
    }

    const analysis = await this.intentAnalysisService.analyze(lastUserMessage.content);
    const activeSessionId = sessionId?.trim() || randomUUID();

    let responseText: string;
    let movies: ChatMessage['movies'];

    if (analysis.intent === 'search_movies') {
      const results = await this.movieSearchService.fetchMovies({
        title: analysis.extractedParameters.title,
        genres: analysis.extractedParameters.genres?.join(','),
        year: analysis.extractedParameters.year,
        rating: analysis.extractedParameters.rating,
        original_language: analysis.extractedParameters.original_language,
        limit: analysis.extractedParameters.limit,
        sort: analysis.extractedParameters.sort
      });

      movies = results.length ? results : undefined;
      responseText = results.length
        ? '¡Lista de cine armado con éxito! Acá tenés las opciones ideales que encontré en el catálogo:'
        : 'Analicé tu propuesta para el ciclo, pero actualmente no encontré películas en nuestro catálogo que coincidan exactamente con esos filtros.';
    } else {
      responseText = await this.generalChatService.answer(parsedMessages.data);
      movies = undefined;
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: responseText,
      movies
    };

    await this.chatRepository.saveOrUpdateSession(activeSessionId, [...parsedMessages.data, assistantMessage]);

    const payload: HandleChatResponse = {
      sessionId: activeSessionId,
      message: assistantMessage
    };

    if (process.env.NODE_ENV !== 'production') {
      payload.debug = {
        intent: analysis.intent,
        confidence: analysis.confidence,
        payload: analysis.extractedParameters,
        result: movies || []
      };
    }

    return payload;
  }
}
