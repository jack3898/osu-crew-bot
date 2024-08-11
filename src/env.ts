import { z } from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  OPTIONAL_DISCORD_GUILD_ID: z.string().optional(),
  DISCORD_CLIENT_ID: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
  OSU_CLIENT_ID: z.string(),
  OSU_CLIENT_SECRET: z.string(),
  OSU_REDIRECT_URI: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
