"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intentAnalysisSchema = void 0;
const zod_1 = require("zod");
exports.intentAnalysisSchema = zod_1.z.object({
    intent: zod_1.z.enum(['search_movies', 'general_chat']),
    confidence: zod_1.z.number().min(0).max(1),
    extractedParameters: zod_1.z.object({
        title: zod_1.z.string().optional(),
        genres: zod_1.z.array(zod_1.z.string()).optional(),
        year: zod_1.z.number().optional(),
        rating: zod_1.z.number().optional(),
        original_language: zod_1.z.string().optional(),
        limit: zod_1.z.number().int().positive().optional(),
        sort: zod_1.z.enum(['worst', 'best']).optional()
    }),
    explanation: zod_1.z.string()
});
