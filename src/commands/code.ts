import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { env } from "../env.js";
import { osuCodeResponseSchema } from "../schemas.js";
import { getOsuUser } from "../osu.js";

export const code: Command = {
  definition: new SlashCommandBuilder()
    .setName("code")
    .setDMPermission(true)
    .setDescription("Fetch your role by allowing this bot to read your rank.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code you received from the OAuth2 flow.")
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction): Promise<void> {
    const code = interaction.options.get("code", true);

    if (!code) {
      return;
    }

    const data = await fetch("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "Content-Type: application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.OSU_CLIENT_ID,
        client_secret: env.OSU_CLIENT_SECRET,
        code: code.value,
        grant_type: "authorization_code",
        redirect_uri: env.OSU_REDIRECT_URI.toString(),
      }),
    });

    const json = osuCodeResponseSchema.parse(await data.json());

    const user = await getOsuUser(json.access_token);
    const rank = user.rank_history.data.at(-1);

    await interaction.reply(`Your rank is ${rank}`);
  },
};
