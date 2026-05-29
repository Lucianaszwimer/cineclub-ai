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
exports.ChatRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const app_error_1 = require("../../common/errors/app.error");
const chat_schema_1 = require("../schemas/chat.schema");
let ChatRepository = class ChatRepository {
    constructor(chatSessionModel) {
        this.chatSessionModel = chatSessionModel;
    }
    async findSessionById(sessionId) {
        try {
            return await this.chatSessionModel.findOne({ sessionId: sessionId.trim() }).lean().exec();
        }
        catch (error) {
            throw new app_error_1.PersistenceError('Error al buscar sesión por ID.', error);
        }
    }
    async saveOrUpdateSession(sessionId, messages) {
        try {
            const messagesWithDates = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
                movies: msg.movies,
                createdAt: msg.createdAt || new Date()
            }));
            const updatedSession = await this.chatSessionModel
                .findOneAndUpdate({ sessionId: sessionId.trim() }, { $set: { messages: messagesWithDates } }, { returnDocument: 'after', upsert: true, runValidators: true })
                .lean()
                .exec();
            if (!updatedSession) {
                throw new app_error_1.PersistenceError('No se pudo guardar o actualizar la sesión.');
            }
            return updatedSession;
        }
        catch (error) {
            if (error instanceof app_error_1.PersistenceError)
                throw error;
            throw new app_error_1.PersistenceError('Error al persistir la sesión.', error);
        }
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.ChatSessionEntity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatRepository);
