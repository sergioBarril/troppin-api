import { Inject, Injectable } from "@nestjs/common";
import {
  TURSO_DATABASE,
  TursoDatabase,
} from "../config/database/drizzle.provider";

import { sql } from "drizzle-orm";
import { guildTable } from "../config/database/tables";
import { CreateGuildDto } from "./guild.schemas";

@Injectable()
export class GuildDatabase {
  constructor(@Inject(TURSO_DATABASE) private readonly db: TursoDatabase) {}

  /**
   * Find all guilds
   *
   * @returns An array of guilds
   */
  async findAll() {
    return this.db.select().from(guildTable);
  }

  /**
   * Find a guild by ID
   *
   * @param id - The guild ID
   * @returns The guild, or null if not found
   */
  async findById(id: string) {
    const rows = await this.db
      .select()
      .from(guildTable)
      .where(sql`${guildTable.id} = ${id}`)
      .execute();

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  /**
   * Find a guild by Discord ID
   *
   * @param discordId - The player's Discord ID
   * @returns The guild, or null if not found
   */
  async findByDiscordId(discordId: string) {
    const rows = await this.db
      .select()
      .from(guildTable)
      .where(sql`${guildTable.discordId} = ${discordId}`);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  /**
   * Create a new guild
   */
  async create(newGuild: CreateGuildDto) {
    const rows = await this.db.insert(guildTable).values(newGuild).returning();

    return rows[0];
  }
}
