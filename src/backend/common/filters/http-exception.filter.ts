import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = request.headers['x-request-id'];

    if (exception instanceof AppError) {
      const payload: Record<string, unknown> = {
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

    if (exception instanceof ZodError) {
      const payload: Record<string, unknown> = {
        statusCode: HttpStatus.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        message: 'El formato de entrada no es válido.',
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId
      };
      if (process.env.NODE_ENV !== 'production') {
        payload.details = exception.flatten();
      }
      response.status(HttpStatus.BAD_REQUEST).json(payload);
      return;
    }

    if (exception instanceof HttpException) {
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

    this.logger.error('Unhandled exception', exception as Error);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor.',
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
