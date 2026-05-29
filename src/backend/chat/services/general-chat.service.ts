import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatMessage } from '../interfaces/chat.types';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class GeneralChatService {
  private readonly openai: OpenAI;

  constructor(@Inject(AppConfigService) private readonly config: AppConfigService) {
    this.openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
  }

  async answer(messages: ChatMessage[]): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sos un asistente experto en cine amigable. Responde de forma cálida y concisa.' },
        ...messages
      ]
    });

    return response.choices[0]?.message?.content || '¿En qué te puedo ayudar hoy con tu cineclub?';
  }
}
