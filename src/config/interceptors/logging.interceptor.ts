/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const calledUrl = request.url;
    this.logger.log({ body: request.body }, "Request received: %s", calledUrl);
    return next.handle().pipe(
      tap((data) => {
        this.logger.log({ response: data }, "Response sent");
      }),
    );
  }
}
