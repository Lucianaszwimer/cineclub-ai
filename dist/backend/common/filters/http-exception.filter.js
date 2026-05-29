"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const app_error_1 = require("../errors/app.error");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.headers['x-request-id'];
        if (exception instanceof app_error_1.AppError) {
            const payload = {
                statusCode: exception.statusCode,
                code: exception.code,
                message: exception.message,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId
            };
            if (process.env.NODE_ENV !== 'production' && exception.details) {
                payload.details = exception.details;
            }
            response.status(exception.statusCode).json(payload);
            return;
        }
        if (exception instanceof zod_1.ZodError) {
            const payload = {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                code: 'VALIDATION_ERROR',
                message: 'El formato de entrada no es válido.',
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId
            };
            if (process.env.NODE_ENV !== 'production') {
                payload.details = exception.flatten();
            }
            response.status(common_1.HttpStatus.BAD_REQUEST).json(payload);
            return;
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            response.status(status).json({
                statusCode: status,
                message: exceptionResponse,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId
            });
            return;
        }
        this.logger.error('Unhandled exception', exception);
        response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error interno del servidor.',
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
