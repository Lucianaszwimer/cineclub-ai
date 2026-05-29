"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionParamsSchema = exports.postChatSchema = exports.chatMessageSchema = void 0;
const zod_1 = require("zod");
const movieSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    genres: zod_1.z.array(zod_1.z.string()),
    year: zod_1.z.number().int().min(1888).optional(),
    rating: zod_1.z.number().min(0).max(10),
    original_language: zod_1.z.string().optional()
});
exports.chatMessageSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'assistant', 'system']),
    content: zod_1.z.string().min(1),
    movies: zod_1.z.array(movieSchema).optional(),
    createdAt: zod_1.z.coerce.date().optional()
});
exports.postChatSchema = zod_1.z.object({
    sessionId: zod_1.z.string().min(1).optional(),
    messages: zod_1.z.array(exports.chatMessageSchema).min(1)
});
exports.getSessionParamsSchema = zod_1.z.object({
    id: zod_1.z.string().min(1)
});
