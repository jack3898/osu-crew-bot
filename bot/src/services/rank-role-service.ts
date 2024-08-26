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

export function updateRankRole(
  db: LibSQLDatabase,
  id: number,
  serverId: string,
  data: {
    roleId?: string | null;
    minRequirement?: number | null;
    maxRequirement?: number | null;
    permanent?: boolean | null;
  },
) {
  return db
    .update(roleRankMapTable)
    .set({
      ...(data.minRequirement ? { min_requirement: data.minRequirement } : {}),
      ...(data.maxRequirement ? { max_requirement: data.maxRequirement } : {}),
      ...(data.permanent ? { permanent: data.permanent } : {}),
      ...(data.roleId ? { role_id: data.roleId } : {}),
    })
    .where(
      and(
        eq(roleRankMapTable.id, id),
        eq(roleRankMapTable.server_id, serverId),
      ),
    )
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
    );
}

export function deleteAllRankRoles(db: LibSQLDatabase, serverId: string) {
  return db
    .delete(roleRankMapTable)
    .where(eq(roleRankMapTable.server_id, serverId));
}

export function listRankRole(db: LibSQLDatabase, serverId: string, limit = 20) {
  return db
    .select()
    .from(roleRankMapTable)
    .where(eq(roleRankMapTable.server_id, serverId))
    .limit(limit);
}

export async function getRankRoles(
  db: LibSQLDatabase,
  serverId: string,
  osuRank: number,
) {
  const roleMappings = await listRankRole(db, serverId);

  const bestRole = roleMappings.filter((role) => {
    return osuRank >= role.min_requirement && osuRank <= role.max_requirement;
  });

  return bestRole;
}

// TODO: Auto-prune db records when users delete roles on their server/guild by listening for events
// TODO: Auto-prune db when role no longer exists on discord
