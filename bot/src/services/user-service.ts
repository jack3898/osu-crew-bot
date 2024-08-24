/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { userTable } from "../db-schema.js";
import { eq } from "drizzle-orm";
import { exchangeOsuOAuth2Code, refreshOsuOauth2Token } from "../utils/http.js";
import { addSecondsToDate } from "../utils/add-seconds-to-date.js";
import { Client as OsuClient } from "osu-web.js";

export function upsertUser(
  db: LibSQLDatabase,
  data: {
    id: string;
    osu_access_token?: string;
    osu_access_token_exp?: Date;
    osu_refresh_token?: string;
  },
) {
  return db
    .insert(userTable)
    .values(data)
    .onConflictDoUpdate({ target: userTable.id, set: data });
}

export function getUserById(db: LibSQLDatabase, id: string) {
  return db.select().from(userTable).where(eq(userTable.id, id)).limit(1);
}

export async function exchangeOsuOAuth2CodeAndSaveToDb(
  db: LibSQLDatabase,
  id: string,
  code: string,
) {
  const response = await exchangeOsuOAuth2Code(code);

  if (response) {
    await upsertUser(db, {
      id,
      osu_access_token: response.access_token,
      osu_access_token_exp: addSecondsToDate(
        new Date(),
        response.expires_in - 300, // Adds some leeway so this bot asks for a new one a bit sooner to prevent any edge cases
      ),
      osu_refresh_token: response.refresh_token,
    });

    return response;
  }

  return null;
}

export async function refreshTokenAndSaveToDb(
  db: LibSQLDatabase,
  id: string,
  refresh: string,
) {
  const response = await refreshOsuOauth2Token(refresh);

  if (response) {
    await upsertUser(db, {
      id,
      osu_access_token: response.access_token,
      osu_access_token_exp: addSecondsToDate(
        new Date(),
        response.expires_in - 300, // Adds some leeway so this bot asks for a new one a bit sooner to prevent any edge cases
      ),
      osu_refresh_token: response.refresh_token,
    });

    return response;
  }

  return null;
}

/**
 * Gets an access token. Checks the db for one and its expiry, if expired, refreshed it, updates the db and returns a new access token.
 */
export async function getAccessToken(
  db: LibSQLDatabase,
  id: string,
): Promise<string | null> {
  const [user] = await getUserById(db, id);

  if (!user || !user.osu_access_token_exp || !user.osu_refresh_token) {
    return null;
  }

  const tokenHasExpired = user.osu_access_token_exp.getTime() < Date.now();

  if (tokenHasExpired) {
    console.info("Refreshing token for user", id);

    const result = await refreshTokenAndSaveToDb(
      db,
      user.id,
      user.osu_refresh_token,
    );

    return result?.access_token ?? null;
  }

  return user.osu_access_token;
}

export async function getOsuApiClient(
  accessToken: string,
  id?: undefined,
  db?: undefined,
): Promise<OsuClient>;
export async function getOsuApiClient(
  accessToken: undefined,
  id: string,
  db: LibSQLDatabase,
): Promise<OsuClient | null>;
export async function getOsuApiClient(
  accessToken: string | undefined,
  id?: string,
  db?: LibSQLDatabase,
): Promise<OsuClient | null> {
  if (accessToken) {
    return new OsuClient(accessToken);
  }

  if (!db || !id) {
    return null;
  }

  const dbAccessToken = await getAccessToken(db, id);

  if (!dbAccessToken) {
    return null;
  }

  return new OsuClient(dbAccessToken);
}
