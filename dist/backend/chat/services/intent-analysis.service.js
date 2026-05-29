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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
const intent_schema_1 = require("../schemas/intent.schema");
const intent_prompt_1 = require("../prompts/intent.prompt");
const app_error_1 = require("../../common/errors/app.error");
const config_service_1 = require("../../config/config.service");
let IntentAnalysisService = class IntentAnalysisService {
    constructor(config) {
        this.config = config;
        this.openai = new openai_1.default({ apiKey: this.config.get('OPENAI_API_KEY') });
    }
    async analyze(userMessage) {
        var _a, _b;
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: intent_prompt_1.INTENT_SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ]
        });
        const rawContent = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!rawContent) {
            throw new app_error_1.ExternalServiceError('OpenAI no devolvió contenido para análisis de intención.');
        }
        return intent_schema_1.intentAnalysisSchema.parse(JSON.parse(rawContent));
    }
};
exports.IntentAnalysisService = IntentAnalysisService;
exports.IntentAnalysisService = IntentAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_service_1.AppConfigService)),
    __metadata("design:paramtypes", [config_service_1.AppConfigService])
], IntentAnalysisService);
