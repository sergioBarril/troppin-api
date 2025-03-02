/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
import {
  TURSO_DATABASE,
  TursoDatabase,
} from "../config/database/drizzle.provider";

import { sql } from "drizzle-orm";
import { userTable } from "../config/database/tables";
import { CreateUserDto, UpdateUserDto } from "./user.schemas";

@Injectable()
export class UserDatabase {
  private readonly logger = new Logger(UserDatabase.name);

  constructor(@Inject(TURSO_DATABASE) private readonly db: TursoDatabase) {}

  /**
   * Find all users
   *
   * @returns An array of users
   */
  async findAll() {
    return this.db.select().from(userTable);
  }

  /**
   * Find a user by ID
   *
   * @param id - The user ID
   * @returns The user, or null if not found
   */
  async findById(id: string) {
    const rows = await this.db
      .select()
      .from(userTable)
      .where(sql`${userTable.id} = ${id}`)
      .execute();

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  /**
   * Find a user by Discord ID
   *
   * @param discordId - The user's Discord ID
   * @returns The user, or null if not found
   */
  async findByDiscordId(discordId: string) {
    const rows = await this.db
      .select()
      .from(userTable)
      .where(sql`${userTable.discordId} = ${discordId}`);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  /**
   * Create a new user
   */
  async create(newUser: CreateUserDto) {
    try {
      const rows = await this.db.insert(userTable).values(newUser).returning();

      return rows[0];
    } catch (error) {
      if (error?.message?.includes("UNIQUE constraint failed")) {
        this.logger.error(
          { error, errorMessage: error.message },
          "Unique constraint violation",
        );
        throw new ConflictException("This user already exists.", {
          description: error.message,
        });
      }
      throw error;
    }
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto & { updatedAt: string },
  ) {
    const rows = await this.db
      .update(userTable)
      .set(updateUserDto)
      .where(sql`${userTable.id} = ${userId}`)
      .returning();

    return rows[0];
  }

  /**
   * Delete a user by ID
   *
   * @param id - The user ID
   */
  async delete(id: string) {
    const rows = await this.db
      .delete(userTable)
      .where(sql`${userTable.id} = ${id}`)
      .returning();

    return rows[0];
  }
}
