import {
  type CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import type { Command } from "../types.js";
import { env } from "../env.js";
import { assertBot } from "../utils/assert.js";
import { jwt } from "../jwt.js";
import { hide } from "../utils/message.js";

export const link: Command = {
  definition: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Authorize this bot to see your Osu! account!"),
  async execute(interaction: CommandInteraction) {
    const bot = interaction.client;

    assertBot(bot);

    if (!bot.oauthState.valid(interaction.user.id)) {
      return interaction.reply(hide("Please wait before trying again."));
    }

    const searchParams = new URLSearchParams({
      client_id: env.OSU_CLIENT_ID.toString(),
      redirect_uri: env.OSU_REDIRECT_URI,
      response_type: "code",
      scope: "public",
      state: await jwt.sign(
        { discordUserId: interaction.user.id },
        { expiresIn: "5m" },
      ),
    });

    const osuAuthUrl = `https://osu.ppy.sh/oauth/authorize?${searchParams}`;

    const button = new ButtonBuilder()
      .setLabel("Link account")
      .setStyle(ButtonStyle.Link)
      .setURL(osuAuthUrl);

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      button,
    );

    await interaction.reply({
      ...hide(
        "Thank you for giving me the opportunity to learn about your Osu profile! 👀",
      ),
      components: [actionRow],
    });

    bot.oauthState.add(interaction.user.id);
  },
};
