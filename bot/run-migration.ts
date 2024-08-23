import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@libsql/client";

const self = dirname(fileURLToPath(import.meta.url));
export const MIGRATIONS_DIR = resolve(self, "migrations");

export async function runMigration(): Promise<void> {
  const client = createClient({ url: "file:.data/database.db" });
  const migrationClient = drizzle(client);

  await migrate(migrationClient, { migrationsFolder: MIGRATIONS_DIR });

  client.close();
}
