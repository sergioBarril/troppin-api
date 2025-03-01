import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export const TURSO_DATABASE = "TURSO_DATABASE";

import * as schema from "./tables";

export const DrizzleProvider = {
  provide: TURSO_DATABASE,
  useFactory: () => {
    const client = createClient({
      url:
        (process.env.TURSO_DATABASE_URL as string) || "http://127.0.0.1:8080",
    });

    const connection = drizzle(client, { schema });
    return connection;
  },
};

export type TursoDatabase = LibSQLDatabase<typeof schema>;
