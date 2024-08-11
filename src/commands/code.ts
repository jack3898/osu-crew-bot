import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { env } from "../env.js";
import { Client as OsuClient } from "osu-web.js";
import { exchangeOsuOAuth2Code } from "../http.js";

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

    if (typeof code.value !== "string") {
      return;
    }

    const result = await exchangeOsuOAuth2Code(
      code.value,
      env.OSU_CLIENT_ID,
      env.OSU_CLIENT_SECRET,
      env.OSU_REDIRECT_URI,
    );

    if (!result) {
      await interaction.reply(
        "There was an error exchanging the code for an access token.",
      );

      return;
    }

    const osuClient = new OsuClient(result.access_token);
    const user = await osuClient.users.getSelf();
    const rank = user.rank_history.data.at(-1);

    await interaction.reply(`Your rank is ${rank}`);
  },
};
