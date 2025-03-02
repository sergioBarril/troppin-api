import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateGuildDto, UpdateGuildDto } from "./guild.schemas";
import { GuildDatabase } from "./guild.database";

@Injectable()
export class GuildService {
  private readonly logger = new Logger(GuildService.name);

  constructor(private readonly guildDatabase: GuildDatabase) {}

  async create(createGuildDto: CreateGuildDto) {
    return this.guildDatabase.create(createGuildDto);
  }

  async findAll() {
    return this.guildDatabase.findAll();
  }

  async findById(guildId: string) {
    // The IDs are UUID, discordId is a snowflake
    const isDiscord = !guildId.includes("-");

    if (isDiscord) return this.guildDatabase.findByDiscordId(guildId);

    return this.guildDatabase.findById(guildId);
  }

  async getById(guildId: string) {
    const guild = await this.findById(guildId);

    if (!guild) {
      this.logger.error({ guildId }, `Guild not found`);
      throw new NotFoundException("Guild not found");
    }

    return guild;
  }

  async update(guildId: string, updateGuildDto: UpdateGuildDto) {
    const guild = await this.getById(guildId);

    const guildUpdates = {
      ...updateGuildDto,
      updatedAt: new Date().toISOString(),
    };

    return this.guildDatabase.update(guild.id, guildUpdates);
  }

  async delete(guildId: string) {
    const guild = await this.getById(guildId);
    return this.guildDatabase.delete(guild.id);
  }
}
