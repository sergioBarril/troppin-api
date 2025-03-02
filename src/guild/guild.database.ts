/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
import {
  TURSO_DATABASE,
  TursoDatabase,
} from "../config/database/drizzle.provider";

import { sql } from "drizzle-orm";
import { guildTable } from "../config/database/tables";
import { CreateGuildDto, UpdateGuildDto } from "./guild.schemas";

@Injectable()
export class GuildDatabase {
  private readonly logger = new Logger(GuildDatabase.name);

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
    try {
      const rows = await this.db
        .insert(guildTable)
        .values(newGuild)
        .returning();

      return rows[0];
    } catch (error) {
      if (error?.message?.includes("UNIQUE constraint failed")) {
        this.logger.error(
          { error, errorMessage: error.message },
          "Unique constraint violation",
        );
        throw new ConflictException("This guild already exists.", {
          description: error.message,
        });
      }
      throw error;
    }
  }

  async update(
    guildId: string,
    updateGuildDto: UpdateGuildDto & { updatedAt: string },
  ) {
    const rows = await this.db
      .update(guildTable)
      .set(updateGuildDto)
      .where(sql`${guildTable.id} = ${guildId}`)
      .returning();

    return rows[0];
  }

  /**
   * Delete a guild by ID
   *
   * @param id - The guild ID
   */
  async delete(id: string) {
    const rows = await this.db
      .delete(guildTable)
      .where(sql`${guildTable.id} = ${id}`)
      .returning();

    return rows[0];
  }
}
