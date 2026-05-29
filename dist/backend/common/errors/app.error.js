"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceError = exports.ExternalServiceError = exports.NotFoundError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, code, statusCode, details) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(message, details) {
        super(message, 'NOT_FOUND', 404, details);
    }
}
exports.NotFoundError = NotFoundError;
class ExternalServiceError extends AppError {
    constructor(message, details) {
        super(message, 'EXTERNAL_SERVICE_ERROR', 502, details);
    }
}
exports.ExternalServiceError = ExternalServiceError;
class PersistenceError extends AppError {
    constructor(message, details) {
        super(message, 'PERSISTENCE_ERROR', 500, details);
    }
}
exports.PersistenceError = PersistenceError;
