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
exports.TmdbApiRepository = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const app_error_1 = require("../../common/errors/app.error");
const config_service_1 = require("../../config/config.service");
let TmdbApiRepository = class TmdbApiRepository {
    constructor(config) {
        this.config = config;
    }
    get apiKey() {
        return this.config.get('TMDB_API_KEY');
    }
    get baseUrl() {
        return this.config.get('TMDB_BASE_URL');
    }
    async fetchGenres() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/genre/movie/list`, {
                params: { api_key: this.apiKey, language: 'es-ES' }
            });
            return response.data.genres || [];
        }
        catch (error) {
            throw new app_error_1.ExternalServiceError('Error al obtener géneros desde TMDB.', error);
        }
    }
    async fetchLanguages() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/configuration/languages`, {
                params: { api_key: this.apiKey }
            });
            return response.data || [];
        }
        catch (error) {
            throw new app_error_1.ExternalServiceError('Error al obtener idiomas desde TMDB.', error);
        }
    }
    async searchOrDiscover(endpoint, queryParams) {
        const path = endpoint === 'search' ? '/search/movie' : '/discover/movie';
        try {
            const response = await axios_1.default.get(`${this.baseUrl}${path}`, {
                params: Object.assign({ api_key: this.apiKey, language: 'es-ES' }, queryParams)
            });
            return response.data.results || [];
        }
        catch (error) {
            throw new app_error_1.ExternalServiceError('Error consultando catálogo TMDB.', error);
        }
    }
};
exports.TmdbApiRepository = TmdbApiRepository;
exports.TmdbApiRepository = TmdbApiRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_service_1.AppConfigService)),
    __metadata("design:paramtypes", [config_service_1.AppConfigService])
], TmdbApiRepository);
