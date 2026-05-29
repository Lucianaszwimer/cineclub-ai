import { Injectable } from '@nestjs/common';
import { envSchema, Env } from './env.schema';
import { ValidationError } from '../common/errors/app.error';

@Injectable()
export class AppConfigService {
  private readonly env: Env;

  constructor() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      throw new ValidationError('Variables de entorno inválidas.', parsed.error.flatten());
    }
    this.env = parsed.data;
  }

  get<K extends keyof Env>(key: K): Env[K] {
    return this.env[key];
  }
}
