"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleChatUseCase = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const zod_1 = require("zod");
const app_error_1 = require("../../common/errors/app.error");
const movie_search_service_1 = require("../../tmdb/services/movie-search.service");
const intent_analysis_service_1 = require("../services/intent-analysis.service");
const general_chat_service_1 = require("../services/general-chat.service");
const chat_repository_1 = require("../repositories/chat.repository");
const chat_dto_1 = require("../dto/chat.dto");
const incomingMessagesSchema = zod_1.z.array(chat_dto_1.chatMessageSchema).min(1);
let HandleChatUseCase = class HandleChatUseCase {
    constructor(chatRepository, movieSearchService, intentAnalysisService, generalChatService) {
        this.chatRepository = chatRepository;
        this.movieSearchService = movieSearchService;
        this.intentAnalysisService = intentAnalysisService;
        this.generalChatService = generalChatService;
    }
    async execute(messages, sessionId) {
        var _a;
        const parsedMessages = incomingMessagesSchema.safeParse(messages);
        if (!parsedMessages.success) {
            throw new app_error_1.ValidationError('El formato de mensajes no es válido.', parsedMessages.error.flatten());
        }
        const lastUserMessage = parsedMessages.data[parsedMessages.data.length - 1];
        if (lastUserMessage.role !== 'user') {
            throw new app_error_1.ValidationError('El último mensaje debe pertenecer al usuario.');
        }
        const analysis = await this.intentAnalysisService.analyze(lastUserMessage.content);
        const activeSessionId = (sessionId === null || sessionId === void 0 ? void 0 : sessionId.trim()) || (0, crypto_1.randomUUID)();
        let responseText;
        let movies;
        if (analysis.intent === 'search_movies') {
            const results = await this.movieSearchService.fetchMovies({
                title: analysis.extractedParameters.title,
                genres: (_a = analysis.extractedParameters.genres) === null || _a === void 0 ? void 0 : _a.join(','),
                year: analysis.extractedParameters.year,
                rating: analysis.extractedParameters.rating,
                original_language: analysis.extractedParameters.original_language,
                limit: analysis.extractedParameters.limit,
                sort: analysis.extractedParameters.sort
            });
            movies = results.length ? results : undefined;
            responseText = results.length
                ? '¡Lista de cine armado con éxito! Acá tenés las opciones ideales que encontré en el catálogo:'
                : 'Analicé tu propuesta para el ciclo, pero actualmente no encontré películas en nuestro catálogo que coincidan exactamente con esos filtros.';
        }
        else {
            responseText = await this.generalChatService.answer(parsedMessages.data);
            movies = undefined;
        }
        const assistantMessage = {
            role: 'assistant',
            content: responseText,
            movies
        };
        await this.chatRepository.saveOrUpdateSession(activeSessionId, [...parsedMessages.data, assistantMessage]);
        const payload = {
            sessionId: activeSessionId,
            message: assistantMessage
        };
        if (process.env.NODE_ENV !== 'production') {
            payload.debug = {
                intent: analysis.intent,
                confidence: analysis.confidence,
                payload: analysis.extractedParameters,
                result: movies || []
            };
        }
        return payload;
    }
};
exports.HandleChatUseCase = HandleChatUseCase;
exports.HandleChatUseCase = HandleChatUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(chat_repository_1.ChatRepository)),
    __param(1, (0, common_1.Inject)(movie_search_service_1.MovieSearchService)),
    __param(2, (0, common_1.Inject)(intent_analysis_service_1.IntentAnalysisService)),
    __param(3, (0, common_1.Inject)(general_chat_service_1.GeneralChatService)),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository,
        movie_search_service_1.MovieSearchService,
        intent_analysis_service_1.IntentAnalysisService,
        general_chat_service_1.GeneralChatService])
], HandleChatUseCase);
