import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserDatabase } from "./user.database";

@Module({
  controllers: [UserController],
  providers: [UserService, UserDatabase],
})
export class UserModule {}
