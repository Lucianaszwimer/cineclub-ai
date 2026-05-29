import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersistenceError } from '../../common/errors/app.error';
import { ChatMessage, ChatSession } from '../interfaces/chat.types';
import { ChatSessionEntity } from '../schemas/chat.schema';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(ChatSessionEntity.name)
    private readonly chatSessionModel: Model<ChatSessionEntity>
  ) {}

  async findSessionById(sessionId: string): Promise<ChatSession | null> {
    try {
      return await this.chatSessionModel.findOne({ sessionId: sessionId.trim() }).lean<ChatSession>().exec();
    } catch (error) {
      throw new PersistenceError('Error al buscar sesión por ID.', error);
    }
  }

  async saveOrUpdateSession(sessionId: string, messages: ChatMessage[]): Promise<ChatSession> {
    try {
      const messagesWithDates = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        movies: msg.movies,
        createdAt: msg.createdAt || new Date()
      }));

      const updatedSession = await this.chatSessionModel
        .findOneAndUpdate(
          { sessionId: sessionId.trim() },
          { $set: { messages: messagesWithDates } },
          { returnDocument: 'after', upsert: true, runValidators: true }
        )
        .lean<ChatSession>()
        .exec();

      if (!updatedSession) {
        throw new PersistenceError('No se pudo guardar o actualizar la sesión.');
      }

      return updatedSession;
    } catch (error) {
      if (error instanceof PersistenceError) throw error;
      throw new PersistenceError('Error al persistir la sesión.', error);
    }
  }
}
