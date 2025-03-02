import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const GuildSchema = z.object({
  id: z.string().trim().min(1, "Required"),
  name: z.string().trim().min(1, "Required"),
  discordId: z.string().trim().min(1, "Required"),
  createdAt: z.string().transform((val) => new Date(val)),
  channelId: z.string().trim().nullable().optional().default(null),
  downvoteThreshold: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .default(3),
});

export const CreateGuildSchema = GuildSchema.omit({
  id: true,
  createdAt: true,
});

export class CreateGuildDto extends createZodDto(CreateGuildSchema) {}
