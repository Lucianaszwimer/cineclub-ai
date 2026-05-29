import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../../common/errors/app.error';
import { ChatRepository } from '../repositories/chat.repository';

@Injectable()
export class GetSessionUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(id: string) {
    const session = await this.chatRepository.findSessionById(id);
    if (!session) {
      throw new NotFoundError('El ID de sesión ingresado no es válido.');
    }

    return {
      sessionId: session.sessionId,
      messages: session.messages
    };
  }
}
