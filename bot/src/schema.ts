import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const userSchema = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
});
