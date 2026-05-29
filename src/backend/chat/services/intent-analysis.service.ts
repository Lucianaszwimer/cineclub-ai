import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { intentAnalysisSchema } from '../schemas/intent.schema';
import { INTENT_SYSTEM_PROMPT } from '../prompts/intent.prompt';
import { ExternalServiceError } from '../../common/errors/app.error';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class IntentAnalysisService {
  private readonly openai: OpenAI;

  constructor(private readonly config: AppConfigService) {
    this.openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
  }

  async analyze(userMessage: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: INTENT_SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ]
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) {
      throw new ExternalServiceError('OpenAI no devolvió contenido para análisis de intención.');
    }

    return intentAnalysisSchema.parse(JSON.parse(rawContent));
  }
}
