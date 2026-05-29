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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionSchema = exports.ChatSessionEntity = exports.ChatMessageSchema = exports.ChatMessageEntity = exports.MovieSchema = exports.MovieEntity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let MovieEntity = class MovieEntity {
};
exports.MovieEntity = MovieEntity;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MovieEntity.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], MovieEntity.prototype, "genres", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0, max: 10 }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], MovieEntity.prototype, "original_language", void 0);
exports.MovieEntity = MovieEntity = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], MovieEntity);
exports.MovieSchema = mongoose_1.SchemaFactory.createForClass(MovieEntity);
let ChatMessageEntity = class ChatMessageEntity {
};
exports.ChatMessageEntity = ChatMessageEntity;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: ['user', 'assistant', 'system'] }),
    __metadata("design:type", String)
], ChatMessageEntity.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ChatMessageEntity.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.MovieSchema], default: undefined }),
    __metadata("design:type", Array)
], ChatMessageEntity.prototype, "movies", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ChatMessageEntity.prototype, "createdAt", void 0);
exports.ChatMessageEntity = ChatMessageEntity = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ChatMessageEntity);
exports.ChatMessageSchema = mongoose_1.SchemaFactory.createForClass(ChatMessageEntity);
let ChatSessionEntity = class ChatSessionEntity {
};
exports.ChatSessionEntity = ChatSessionEntity;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], ChatSessionEntity.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ChatMessageSchema], default: [] }),
    __metadata("design:type", Array)
], ChatSessionEntity.prototype, "messages", void 0);
exports.ChatSessionEntity = ChatSessionEntity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ChatSessionEntity);
exports.ChatSessionSchema = mongoose_1.SchemaFactory.createForClass(ChatSessionEntity);
