import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  Patch,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./user.schemas";

@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    this.logger.log({ user }, "User created");

    return user;
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    if (users.length > 0) {
      this.logger.log({ users }, "Found users");
    } else {
      this.logger.warn("No users found");
    }

    return users;
  }

  @Get(":userId")
  async getById(@Param("userId") userId: string) {
    const user = await this.userService.getById(userId);

    this.logger.log({ user, userId }, "Found user");

    return user;
  }

  @Patch(":userId")
  async update(
    @Param("userId") userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(userId, updateUserDto);

    this.logger.log({ user, userId }, "User updated");

    return user;
  }

  @Delete(":userId")
  async delete(@Param("userId") userId: string) {
    const user = await this.userService.delete(userId);

    this.logger.log({ user, userId }, "User deleted");

    return user;
  }
}
