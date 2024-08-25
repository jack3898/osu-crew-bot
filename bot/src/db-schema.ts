import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const created_at = integer("created_at", { mode: "timestamp_ms" })
  .default(sql`(CURRENT_TIMESTAMP)`)
  .notNull();

const updated_at = integer("updated_at", { mode: "timestamp_ms" })
  .default(sql`(CURRENT_TIMESTAMP)`)
  .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`);

const id = integer("id").primaryKey({ autoIncrement: true }).notNull();

export const userTable = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  osu_access_token: text("osu_access_token"),
  osu_access_token_exp: integer("osu_access_token_exp", {
    mode: "timestamp_ms",
  }),
  osu_refresh_token: text("osu_refresh_token"),
  created_at,
  updated_at,
});

export const roleRankMapTable = sqliteTable("role_rank_maps", {
  id,
  server_id: text("server_id").notNull(),
  role_id: text("role_id").notNull(),
  min_requirement: integer("min_requirement").notNull(),
  max_requirement: integer("max_requirement").notNull(),
  permanent: integer("permanent", { mode: "boolean" }).notNull(),
  created_at,
  updated_at,
});
