import { randomUUID } from "crypto";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(randomUUID),
  discordId: text("discord_id").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at"),
});
