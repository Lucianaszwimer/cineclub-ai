"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const chat_controller_1 = require("./controllers/chat.controller");
const chat_repository_1 = require("./repositories/chat.repository");
const chat_schema_1 = require("./schemas/chat.schema");
const handle_chat_usecase_1 = require("./use-cases/handle-chat.usecase");
const get_session_usecase_1 = require("./use-cases/get-session.usecase");
const intent_analysis_service_1 = require("./services/intent-analysis.service");
const general_chat_service_1 = require("./services/general-chat.service");
const movie_search_service_1 = require("../tmdb/services/movie-search.service");
const tmdb_api_repository_1 = require("../tmdb/repositories/tmdb-api.repository");
const tmdb_movie_adapter_1 = require("../tmdb/adapters/tmdb-movie.adapter");
const internal_api_key_guard_1 = require("../common/interceptors/internal-api-key.guard");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: chat_schema_1.ChatSessionEntity.name, schema: chat_schema_1.ChatSessionSchema }])],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chat_repository_1.ChatRepository,
            handle_chat_usecase_1.HandleChatUseCase,
            get_session_usecase_1.GetSessionUseCase,
            intent_analysis_service_1.IntentAnalysisService,
            general_chat_service_1.GeneralChatService,
            movie_search_service_1.MovieSearchService,
            tmdb_api_repository_1.TmdbApiRepository,
            tmdb_movie_adapter_1.TmdbMovieAdapter,
            internal_api_key_guard_1.InternalApiKeyGuard
        ]
    })
], ChatModule);
