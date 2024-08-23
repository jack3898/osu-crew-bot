import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const userSchema = sqliteTable("users", {
  id: integer("id").primaryKey(),
  osu_access_token: text("osu_access_token"),
});
