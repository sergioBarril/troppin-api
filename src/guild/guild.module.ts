import { Module } from "@nestjs/common";
import { GuildService } from "./guild.service";
import { GuildController } from "./guild.controller";
import { GuildDatabase } from "./guild.database";

@Module({
  controllers: [GuildController],
  providers: [GuildService, GuildDatabase],
})
export class GuildModule {}
