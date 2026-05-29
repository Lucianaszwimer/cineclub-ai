"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    NEST_PORT: zod_1.z.coerce.number().int().positive().default(3001),
    NEST_BASE_URL: zod_1.z.string().url().optional(),
    DATABASE_URL: zod_1.z.string().min(1),
    OPENAI_API_KEY: zod_1.z.string().min(1),
    TMDB_API_KEY: zod_1.z.string().min(1),
    TMDB_BASE_URL: zod_1.z.string().url().default('https://api.themoviedb.org/3'),
    INTERNAL_API_KEY: zod_1.z.string().min(1).optional()
});
