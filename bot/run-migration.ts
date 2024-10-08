import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@libsql/client";
import { z } from "zod";

const self = dirname(fileURLToPath(import.meta.url));
export const MIGRATIONS_DIR = resolve(self, "migrations");

export const dbUrlSchema = z.string().default("file:.data/database.db");
export const dbAuthTokenSchema = z.string().optional();

export async function runMigration(): Promise<void> {
  const client = createClient({
    url: dbUrlSchema.parse(process.env.DATABASE_URL),
  });

  const migrationClient = drizzle(client);

  await migrate(migrationClient, { migrationsFolder: MIGRATIONS_DIR });

  client.close();
}
