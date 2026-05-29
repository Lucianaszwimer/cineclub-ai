import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { ValidationError } from '../errors/app.error';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(private readonly config: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedKey = this.config.get('INTERNAL_API_KEY');
    if (!expectedKey) return true;

    const request = context.switchToHttp().getRequest<Request & { headers: Record<string, string | undefined> }>();
    const incomingKey = request.headers['x-internal-api-key'];

    if (incomingKey !== expectedKey) {
      throw new ValidationError('API key interna inválida.');
    }

    return true;
  }
}
