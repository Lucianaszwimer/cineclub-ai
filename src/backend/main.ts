import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: true,
    credentials: true
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT || config.get('NEST_PORT') || 3000;
  await app.listen(port);
  logger.log(`Backend Nest escuchando en puerto ${port}`);
}

bootstrap();
