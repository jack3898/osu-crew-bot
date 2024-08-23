import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema.ts",
  out: "./migrations",
  dbCredentials: { url: "file:.data/database.db" },
  verbose: true,
  strict: true,
});
