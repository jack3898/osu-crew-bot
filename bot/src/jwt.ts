import { env } from "./env.js";
import { z } from "zod";
import { JWT } from "./utils/jwt.js";

export const jwt = new JWT(
  env.JWT_SECRET,
  z.object({
    discordUserId: z.string(),
  }),
);
