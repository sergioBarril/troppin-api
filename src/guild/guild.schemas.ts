import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const GuildSchema = z.object({
  id: z.string().trim().min(1, "Required"),
  name: z.string().trim().min(1, "Required"),
  discordId: z.string().trim().min(1, "Required"),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z
    .string()
    .transform((val) => new Date(val))
    .nullable()
    .default(null),
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
  updatedAt: true,
});

export const UpdateGuildSchema = GuildSchema.omit({
  id: true,
  createdAt: true,
  discordId: true,
  updatedAt: true,
}).partial();

export class CreateGuildDto extends createZodDto(CreateGuildSchema) {}
export class UpdateGuildDto extends createZodDto(UpdateGuildSchema) {}
