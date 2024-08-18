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

export const updateRole: Command = {
  definition: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Fetch your role by allowing this bot to read your rank."),
  async execute(interaction: CommandInteraction): Promise<void> {
    const bot = interaction.client;

    assertBot(bot);

    if (!bot.oauthState.valid(interaction.user.id)) {
      await interaction.reply("Please wait before trying again.");

      return;
    }

    const searchParams = new URLSearchParams({
      client_id: env.OSU_CLIENT_ID,
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

    const actionRow = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content:
        "Click the button authorize this bot to read your rank. The bot will not have access to your password.",
      // @ts-expect-error - This is a valid interaction reply, but discord.js types are complaining.
      components: [actionRow],
      ephemeral: true,
    });

    bot.oauthState.add(interaction.user.id);
  },
};
