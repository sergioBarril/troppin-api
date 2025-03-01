import { BadRequestException, Logger } from "@nestjs/common";
import { createZodValidationPipe } from "nestjs-zod";
import { ZodError } from "zod";

const logger = new Logger("ZodValidationPipe");

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    const message = error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");

    logger.error({ error, message }, "Validation failed for request");
    throw new BadRequestException(`Validation failed -- ${message}`);
  },
});
