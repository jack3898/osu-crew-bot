import { defineConfig } from "drizzle-kit";
import { dbUrlSchema } from "./run-migration";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db-schema.ts",
  out: "./migrations",
  dbCredentials: { url: dbUrlSchema.parse(process.env.DATABASE_URL) },
  verbose: true,
  strict: true,
});
