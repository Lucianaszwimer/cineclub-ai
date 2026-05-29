import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

type RequestWithId = {
  headers: Record<string, string | string[] | undefined>;
  requestId?: string;
};

type ResponseLike = {
  setHeader(name: string, value: string): void;
};

type NextFunction = () => void;

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: ResponseLike, next: NextFunction): void {
    const requestId = req.headers['x-request-id']?.toString() || randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  }
}
