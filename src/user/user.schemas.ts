import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().trim().min(1, "Required"),
  discordId: z.string().trim().min(1, "Required"),
  name: z.string().trim().min(1, "Required"),
  avatar: z.string().nullable().optional().default(null),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z
    .string()
    .transform((val) => new Date(val))
    .nullable()
    .default(null),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  discordId: true,
  updatedAt: true,
}).partial();

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
