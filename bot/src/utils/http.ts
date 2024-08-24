import { z } from "zod";
import { env } from "../env.js";

export const osuCodeExchangeResultSchema = z.object({
  token_type: z.string(),
  expires_in: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
});

export async function exchangeOsuOAuth2Code(
  code: string,
): Promise<z.infer<typeof osuCodeExchangeResultSchema> | null> {
  const data = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.OSU_CLIENT_ID,
      client_secret: env.OSU_CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: env.OSU_REDIRECT_URI,
    }),
  });

  const result = osuCodeExchangeResultSchema.safeParse(await data.json());

  if (!result.success) {
    console.error(
      "There was an error exchanging the code for an access token",
      result.error,
    );

    return null;
  }

  return result.data;
}

export async function refreshOsuOauth2Token(
  refreshToken: string,
): Promise<z.infer<typeof osuCodeExchangeResultSchema> | null> {
  const data = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.OSU_CLIENT_ID,
      client_secret: env.OSU_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const result = osuCodeExchangeResultSchema.safeParse(await data.json());

  if (!result.success) {
    console.error(
      "There was an error refreshing the access token",
      result.error,
    );

    return null;
  }

  return result.data;
}
