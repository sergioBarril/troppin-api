import { defineConfig } from "drizzle-kit";

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

export default defineConfig({
  schema: "./src/config/database/tables/index.ts",
  out: "./src/config/database/migrations",
  dialect: "turso",
  dbCredentials: {
    url: TURSO_DATABASE_URL!,
    ...(TURSO_AUTH_TOKEN ? { token: TURSO_AUTH_TOKEN } : {}),
  },
});
