import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ChatModule } from './chat/chat.module';
import { RequestIdMiddleware } from './common/interceptors/request-id.middleware';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, ChatModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
