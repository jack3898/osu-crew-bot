/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { roleRankMapTable } from "../db-schema.js";
import { and, eq } from "drizzle-orm";

export function addRankRole(
  db: LibSQLDatabase,
  data: {
    serverId: string;
    roleId: string;
    minRequirement: number;
    maxRequirement: number;
    permanent: boolean;
  },
) {
  return db
    .insert(roleRankMapTable)
    .values({
      server_id: data.serverId,
      min_requirement: data.minRequirement,
      max_requirement: data.maxRequirement,
      permanent: true,
      role_id: data.roleId,
    })
    .returning();
}

export function deleteRankRole(
  db: LibSQLDatabase,
  id: number,
  serverId: string,
) {
  return db
    .delete(roleRankMapTable)
    .where(
      and(
        eq(roleRankMapTable.id, id),
        eq(roleRankMapTable.server_id, serverId),
      ),
    )
    .returning();
}

export function listRankRole(db: LibSQLDatabase, serverId: string, limit = 20) {
  return db
    .select()
    .from(roleRankMapTable)
    .where(eq(roleRankMapTable.server_id, serverId))
    .limit(limit);
}

// TODO: Get role by rank utility
