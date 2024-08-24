import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  osu_access_token: text("osu_access_token"),
  osu_access_token_exp: integer("osu_access_token_exp", {
    mode: "timestamp_ms",
  }),
  osu_refresh_token: text("osu_refresh_token"),
  created_at: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(current_timestamp)`)
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(current_timestamp)`)
    .notNull(),
});
