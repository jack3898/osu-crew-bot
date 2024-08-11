import {
  type CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import type { Command } from "../types.js";
import { env } from "../env.js";

export const updateRole: Command = {
  definition: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Fetch your role by allowing this bot to read your rank."),
  async execute(interaction: CommandInteraction): Promise<void> {
    const searchParams = new URLSearchParams({
      client_id: env.OSU_CLIENT_ID,
      redirect_uri: env.OSU_REDIRECT_URI.toString(),
      response_type: "code",
      scope: "public",
    });

    const osuOAuthUrl = new URL(
      `https://osu.ppy.sh/oauth/authorize?${searchParams}`,
    );

    const button = new ButtonBuilder()
      .setLabel("Link account")
      .setStyle(ButtonStyle.Link)
      .setURL(osuOAuthUrl.toString());

    const actionRow = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content:
        "Click the button to link your Osu! account. The bot will not have access to your password.",
      // @ts-expect-error - This is a valid interaction reply, but discord.js types are complaining.
      components: [actionRow],
      ephemeral: true,
    });
  },
};
