/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { UserDatabase } from "./user.database";
import { NotFoundException } from "@nestjs/common";

describe("UserService", () => {
  let service: UserService;
  let userDatabase: UserDatabase;

  const mockUserDatabase = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByDiscordId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserDatabase, useValue: mockUserDatabase },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userDatabase = module.get<UserDatabase>(UserDatabase);

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

  it("should call userDatabase.create when create is called", async () => {
    const dto = { username: "TestUser", discordId: "123456789" };
    await service.create(dto);
    expect(userDatabase.create).toHaveBeenCalledWith(dto);
  });

  it("should call userDatabase.findAll when findAll is called", async () => {
    await service.findAll();
    expect(userDatabase.findAll).toHaveBeenCalled();
  });

  it("should call userDatabase.findById when findById is called with a UUID", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    await service.findById(userId);
    expect(userDatabase.findById).toHaveBeenCalledWith(userId);
  });

  it("should call userDatabase.findByDiscordId when findById is called with a Discord ID", async () => {
    const discordId = "123456789";
    await service.findById(discordId);
    expect(userDatabase.findByDiscordId).toHaveBeenCalledWith(discordId);
  });

  it("should return a user when getById finds one", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    const mockUser = { id: userId, username: "TestUser" };
    userDatabase.findById.mockResolvedValue(mockUser);

    const result = await service.getById(userId);
    expect(result).toEqual(mockUser);
  });

  it("should throw NotFoundException when getById does not find a user", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    userDatabase.findById.mockResolvedValue(null);

    await expect(service.getById(userId)).rejects.toThrow(NotFoundException);
  });

  it("should call userDatabase.update when update is called", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    const updateDto = { username: "UpdatedUser" };
    const mockUser = { id: userId, username: "TestUser" };
    userDatabase.findById.mockResolvedValue(mockUser);

    await service.update(userId, updateDto);
    expect(userDatabase.update).toHaveBeenCalledWith(userId, {
      ...updateDto,
      updatedAt: expect.any(String),
    });
  });

  it("should call userDatabase.delete when delete is called", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    const mockUser = { id: userId, username: "TestUser" };
    userDatabase.findById.mockResolvedValue(mockUser);

    await service.delete(userId);
    expect(userDatabase.delete).toHaveBeenCalledWith(userId);
  });
});
