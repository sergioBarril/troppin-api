import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get("/health")
  getHealth() {
    return `OK: ${this.configService.get<string>("MOCK_ENV_VAR")}`;
  }
}
