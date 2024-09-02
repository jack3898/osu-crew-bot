import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { getOsuApiClient } from "../services/user-service.js";
import { createUserEmbed } from "../utils/message.js";

export const them: Command = {
  definition: new SlashCommandBuilder()
    .setName("them")
    .setDescription("Not you! Fetch someone else's Osu! profile.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The Osu! username to fetch.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const bot = interaction.client;

    assertBot(bot);

    if (!interaction.isChatInputCommand()) {
      return;
    }

    await interaction.deferReply();

    const osuClient = await getOsuApiClient(
      undefined,
      interaction.user.id,
      bot.db,
    );

    if (!osuClient) {
      return interaction.followUp(
        "You need to link your Osu! account first. 🥲 Use `/link` to link it!",
      );
    }

    const username = interaction.options.getString("username", true);
    const user = await osuClient?.users.getUser(username);
    const userEmbed = createUserEmbed(user);

    await interaction.followUp({ embeds: [userEmbed] });
  },
};
