import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export const TURSO_DATABASE = "TURSO_DATABASE";

import * as schema from "./tables";

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

export const DrizzleProvider = {
  provide: TURSO_DATABASE,
  useFactory: () => {
    const client = createClient({
      url: (TURSO_DATABASE_URL as string) || "http://127.0.0.1:8080",
      ...(TURSO_AUTH_TOKEN ? { authToken: TURSO_AUTH_TOKEN } : {}),
    });

    const connection = drizzle(client, { schema });
    return connection;
  },
};

export type TursoDatabase = LibSQLDatabase<typeof schema>;
