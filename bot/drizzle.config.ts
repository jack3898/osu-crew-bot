import { defineConfig } from "drizzle-kit";
import { dbAuthTokenSchema, dbUrlSchema } from "./run-migration";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db-schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: dbUrlSchema.parse(process.env.DATABASE_URL),
    authToken: dbAuthTokenSchema.parse(process.env.DATABASE_AUTH_TOKEN),
  },
  verbose: true,
  strict: true,
});
