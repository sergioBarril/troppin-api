import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/config/database/tables/index.ts",
  out: "./src/config/database/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    // authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
