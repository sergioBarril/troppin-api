import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./user.schemas";
import { UserDatabase } from "./user.database";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userDatabase: UserDatabase) {}

  async create(createUserDto: CreateUserDto) {
    return this.userDatabase.create(createUserDto);
  }

  async findAll() {
    return this.userDatabase.findAll();
  }

  async findById(userId: string) {
    // The IDs are UUID, discordId is a snowflake
    const isDiscord = !userId.includes("-");

    if (isDiscord) return this.userDatabase.findByDiscordId(userId);

    return this.userDatabase.findById(userId);
  }

  async getById(userId: string) {
    const user = await this.findById(userId);

    if (!user) {
      this.logger.error({ userId }, `User not found`);
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.getById(userId);

    const userUpdates = {
      ...updateUserDto,
      updatedAt: new Date().toISOString(),
    };

    return this.userDatabase.update(user.id, userUpdates);
  }

  async delete(userId: string) {
    const user = await this.getById(userId);
    return this.userDatabase.delete(user.id);
  }
}
