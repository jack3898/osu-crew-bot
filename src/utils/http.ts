import { z } from "zod";

export const osuCodeExchangeResultSchema = z.object({
  token_type: z.string(),
  expires_in: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
});

export async function exchangeOsuOAuth2Code(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<z.infer<typeof osuCodeExchangeResultSchema> | null> {
  const data = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
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
