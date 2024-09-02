import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { getOsuApiClient } from "../services/user-service.js";
import { createUserEmbed } from "../utils/message.js";

export const me: Command = {
  definition: new SlashCommandBuilder().setName("me").setDescription("You!"),
  async execute(interaction) {
    const bot = interaction.client;

    assertBot(bot);

    await interaction.deferReply();

    const osuClient = await getOsuApiClient(
      undefined,
      interaction.user.id,
      bot.db,
    );

    const user = await osuClient?.users.getSelf();

    if (!user) {
      return interaction.followUp(
        "I do not know who you are yet. 🥲 Use `/link` to link your Osu! account!",
      );
    }

    const userEmbed = createUserEmbed(user);

    await interaction.followUp({ embeds: [userEmbed] });
  },
};
