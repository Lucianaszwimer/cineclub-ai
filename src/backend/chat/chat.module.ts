import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './controllers/chat.controller';
import { ChatRepository } from './repositories/chat.repository';
import { ChatSessionEntity, ChatSessionSchema } from './schemas/chat.schema';
import { HandleChatUseCase } from './use-cases/handle-chat.usecase';
import { GetSessionUseCase } from './use-cases/get-session.usecase';
import { IntentAnalysisService } from './services/intent-analysis.service';
import { GeneralChatService } from './services/general-chat.service';
import { MovieSearchService } from '../tmdb/services/movie-search.service';
import { TmdbApiRepository } from '../tmdb/repositories/tmdb-api.repository';
import { TmdbMovieAdapter } from '../tmdb/adapters/tmdb-movie.adapter';
import { InternalApiKeyGuard } from '../common/interceptors/internal-api-key.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: ChatSessionEntity.name, schema: ChatSessionSchema }])],
  controllers: [ChatController],
  providers: [
    ChatRepository,
    HandleChatUseCase,
    GetSessionUseCase,
    IntentAnalysisService,
    GeneralChatService,
    MovieSearchService,
    TmdbApiRepository,
    TmdbMovieAdapter,
    InternalApiKeyGuard
  ]
})
export class ChatModule {}
