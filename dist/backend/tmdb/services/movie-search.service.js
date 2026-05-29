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
exports.MovieSearchService = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const tmdb_movie_adapter_1 = require("../adapters/tmdb-movie.adapter");
const tmdb_api_repository_1 = require("../repositories/tmdb-api.repository");
const movieSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    genres: zod_1.z.array(zod_1.z.string()),
    year: zod_1.z.number().int().min(1888).optional(),
    rating: zod_1.z.number().min(0).max(10),
    original_language: zod_1.z.string().optional()
});
const movieArraySchema = zod_1.z.array(movieSchema);
let MovieSearchService = class MovieSearchService {
    constructor(tmdbRepository, tmdbMovieAdapter) {
        this.tmdbRepository = tmdbRepository;
        this.tmdbMovieAdapter = tmdbMovieAdapter;
        this.genreNameToIdMap = new Map();
        this.genreIdToNameMap = new Map();
        this.languageNameToIsoMap = new Map();
        this.isCacheLoaded = false;
        this.spanishToEnglishLanguageMap = {
            espanol: 'spanish',
            castellano: 'spanish',
            ingles: 'english',
            frances: 'french',
            italiano: 'italian',
            aleman: 'german',
            japones: 'japanese',
            coreano: 'korean',
            portugues: 'portuguese',
            chino: 'chinese',
            ruso: 'russian',
            hebreo: 'hebrew'
        };
    }
    cleanText(str) {
        return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    }
    async ensureCache() {
        if (this.isCacheLoaded)
            return;
        const [genres, languages] = await Promise.all([
            this.tmdbRepository.fetchGenres(),
            this.tmdbRepository.fetchLanguages()
        ]);
        genres.forEach((genre) => {
            const cleanName = this.cleanText(genre.name);
            this.genreNameToIdMap.set(cleanName, genre.id);
            this.genreIdToNameMap.set(genre.id, cleanName);
        });
        languages.forEach((language) => {
            this.languageNameToIsoMap.set(this.cleanText(language.english_name), language.iso_639_1);
        });
        this.isCacheLoaded = true;
    }
    resolveLanguageFilter(language) {
        if (!language)
            return undefined;
        const cleanInput = this.cleanText(language);
        if (cleanInput.length === 2)
            return cleanInput;
        const englishName = this.spanishToEnglishLanguageMap[cleanInput] || cleanInput;
        return this.languageNameToIsoMap.get(englishName);
    }
    async fetchMovies(filters) {
        var _a;
        await this.ensureCache();
        const queryParams = {};
        let endpoint = 'discover';
        if (filters.title) {
            endpoint = 'search';
            queryParams.query = filters.title;
        }
        if (filters.year)
            queryParams.primary_release_year = filters.year;
        if (filters.rating !== undefined)
            queryParams['vote_average.gte'] = filters.rating;
        if (filters.genres) {
            const genreIds = filters.genres
                .split(',')
                .map((genre) => this.genreNameToIdMap.get(this.cleanText(genre)))
                .filter((value) => !!value);
            if (genreIds.length > 0) {
                queryParams.with_genres = genreIds.join(',');
            }
        }
        const language = this.resolveLanguageFilter(filters.original_language);
        if (language)
            queryParams.with_original_language = language;
        const rawMovies = await this.tmdbRepository.searchOrDiscover(endpoint, queryParams);
        const requestedGenres = ((_a = filters.genres) === null || _a === void 0 ? void 0 : _a.split(',').map((genre) => genre.trim().toLowerCase())) || [];
        let movies = rawMovies.map((movie) => {
            const resolvedGenres = requestedGenres.length
                ? requestedGenres
                : (movie.genre_ids || [])
                    .map((id) => this.genreIdToNameMap.get(id))
                    .filter((value) => !!value);
            return this.tmdbMovieAdapter.toDomainMovie(movie, resolvedGenres);
        });
        if (filters.sort === 'best') {
            movies = [...movies].sort((a, b) => b.rating - a.rating);
        }
        if (filters.sort === 'worst') {
            movies = [...movies].sort((a, b) => a.rating - b.rating);
        }
        if (filters.limit && filters.limit > 0) {
            movies = movies.slice(0, filters.limit);
        }
        return movieArraySchema.parse(movies);
    }
};
exports.MovieSearchService = MovieSearchService;
exports.MovieSearchService = MovieSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tmdb_api_repository_1.TmdbApiRepository)),
    __param(1, (0, common_1.Inject)(tmdb_movie_adapter_1.TmdbMovieAdapter)),
    __metadata("design:paramtypes", [tmdb_api_repository_1.TmdbApiRepository,
        tmdb_movie_adapter_1.TmdbMovieAdapter])
], MovieSearchService);
