import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ChatModule } from './chat/chat.module';
import { AppConfigService } from './config/config.service';
import { RequestIdMiddleware } from './common/interceptors/request-id.middleware';

@Module({
  imports: [DatabaseModule, ChatModule],
  providers: [AppConfigService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
