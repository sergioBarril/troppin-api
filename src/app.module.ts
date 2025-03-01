import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import getPinoConfig from "./config/loggers/pino.logger";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { LoggingInterceptor } from "./config/interceptors/logging.interceptor";
import { ZodValidationPipe } from "./config/pipes/zod-validation.pipe";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    LoggerModule.forRoot(getPinoConfig()),
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
})
export class AppModule {}
