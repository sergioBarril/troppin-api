import { Controller, Get, Post, Body, Param, Logger } from "@nestjs/common";
import { GuildService } from "./guild.service";
import { CreateGuildDto } from "./guild.schemas";

@Controller("guilds")
export class GuildController {
  private readonly logger = new Logger(GuildController.name);

  constructor(private readonly guildService: GuildService) {}

  @Post()
  async create(@Body() createGuildDto: CreateGuildDto) {
    const guild = await this.guildService.create(createGuildDto);
    this.logger.log({ guild }, "Guild created");

    return guild;
  }

  @Get()
  async findAll() {
    const guilds = await this.guildService.findAll();

    if (guilds.length > 0) {
      this.logger.log({ guilds }, "Found guilds");
    } else {
      this.logger.warn("No guilds found");
    }

    return guilds;
  }

  @Get(":guildId")
  async getById(@Param("guildId") guildId: string) {
    const guild = await this.guildService.getById(guildId);

    this.logger.log({ guild, guildId }, "Found guild");

    return guild;
  }
}
