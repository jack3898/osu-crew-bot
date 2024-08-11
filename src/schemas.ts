import { z } from "zod";

export const osuCodeResponseSchema = z.object({
  token_type: z.string(),
  expires_in: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
});

export type OsuCodeResponse = z.infer<typeof osuCodeResponseSchema>;
