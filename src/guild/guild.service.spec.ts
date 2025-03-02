/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from "@nestjs/testing";
import { GuildService } from "./guild.service";
import { GuildDatabase } from "./guild.database";
import { NotFoundException } from "@nestjs/common";

describe("GuildService", () => {
  let service: GuildService;
  let guildDatabase: GuildDatabase;

  const mockGuildDatabase = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByDiscordId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildService,
        { provide: GuildDatabase, useValue: mockGuildDatabase }, // Mocking GuildDatabase
      ],
    }).compile();

    service = module.get<GuildService>(GuildService);
    guildDatabase = module.get<GuildDatabase>(GuildDatabase);

    // Mock logger methods
    service["logger"] = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as Logger;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should call guildDatabase.create when create is called", async () => {
    const dto = { name: "Test Guild", discordId: "123456789" };
    await service.create(dto);
    expect(guildDatabase.create).toHaveBeenCalledWith(dto);
  });

  it("should call guildDatabase.findAll when findAll is called", async () => {
    await service.findAll();
    expect(guildDatabase.findAll).toHaveBeenCalled();
  });

  it("should call guildDatabase.findById when findById is called with a UUID", async () => {
    const guildId = "550e8400-e29b-41d4-a716-446655440000"; // Example UUID
    await service.findById(guildId);
    expect(guildDatabase.findById).toHaveBeenCalledWith(guildId);
  });

  it("should call guildDatabase.findByDiscordId when findById is called with a Discord ID", async () => {
    const discordId = "123456789"; // Example Discord snowflake ID
    await service.findById(discordId);
    expect(guildDatabase.findByDiscordId).toHaveBeenCalledWith(discordId);
  });

  it("should return a guild when getById finds one", async () => {
    const guildId = "550e8400-e29b-41d4-a716-446655440000";
    const mockGuild = { id: guildId, name: "Test Guild" };
    guildDatabase.findById.mockResolvedValue(mockGuild);

    const result = await service.getById(guildId);
    expect(result).toEqual(mockGuild);
  });

  it("should throw NotFoundException when getById does not find a guild", async () => {
    const guildId = "550e8400-e29b-41d4-a716-446655440000";
    guildDatabase.findById.mockResolvedValue(null);

    await expect(service.getById(guildId)).rejects.toThrow(NotFoundException);
  });
});
