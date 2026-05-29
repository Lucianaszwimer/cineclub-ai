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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_dto_1 = require("../dto/chat.dto");
const zod_validation_pipe_1 = require("../../common/pipes/zod-validation.pipe");
const handle_chat_usecase_1 = require("../use-cases/handle-chat.usecase");
const get_session_usecase_1 = require("../use-cases/get-session.usecase");
const internal_api_key_guard_1 = require("../../common/interceptors/internal-api-key.guard");
let ChatController = class ChatController {
    constructor(handleChatUseCase, getSessionUseCase) {
        this.handleChatUseCase = handleChatUseCase;
        this.getSessionUseCase = getSessionUseCase;
    }
    async postChat(body) {
        const { messages, sessionId } = body;
        return this.handleChatUseCase.execute(messages, sessionId);
    }
    async getChatById(params) {
        return this.getSessionUseCase.execute(params.id);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(chat_dto_1.postChatSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "postChat", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(chat_dto_1.getSessionParamsSchema)),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatById", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(internal_api_key_guard_1.InternalApiKeyGuard),
    __param(0, (0, common_1.Inject)(handle_chat_usecase_1.HandleChatUseCase)),
    __param(1, (0, common_1.Inject)(get_session_usecase_1.GetSessionUseCase)),
    __metadata("design:paramtypes", [handle_chat_usecase_1.HandleChatUseCase,
        get_session_usecase_1.GetSessionUseCase])
], ChatController);
