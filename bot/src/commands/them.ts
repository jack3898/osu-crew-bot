import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { getOsuApiClient } from "../services/user-service.js";
import { createUserEmbed, hide } from "../utils/message.js";

export const them: Command = {
  definition: new SlashCommandBuilder()
    .setName("them")
    .setDescription("Not you! Fetch someone else's Osu! profile.")
    .addStringOption((option) =>
      option
        .setName("osu-username")
        .setDescription("The Osu! username to fetch."),
    )
    .addUserOption((option) =>
      option
        .setName("discord-user")
        .setDescription("The Discord user's associated Osu! profile to fetch."),
    ),
  async execute(interaction) {
    const bot = interaction.client;

    assertBot(bot);

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const user =
      interaction.options.getString("osu-username") ??
      interaction.options.getUser("discord-user");

    if (typeof user === "string") {
      await interaction.deferReply();

      const osuClient = await getOsuApiClient(
        undefined,
        interaction.user.id,
        bot.db,
      );

      if (!osuClient) {
        return interaction.followUp(
          "You need to link your Osu! account first. Use `/link` to link it!",
        );
      }

      const clientUser = await osuClient.users.getUser(user);
      const userEmbed = createUserEmbed(clientUser);

      return interaction.followUp({ embeds: [userEmbed] });
    } else if (user && typeof user === "object") {
      await interaction.deferReply();

      const osuClient = await getOsuApiClient(undefined, user.id, bot.db);

      if (!osuClient) {
        return interaction.followUp(
          "This user hasn't linked their Osu! account or could not be found.",
        );
      }

      const clientUser = await osuClient.users.getSelf();

      const userEmbed = createUserEmbed(clientUser);

      return interaction.followUp({ embeds: [userEmbed] });
    }

    return interaction.reply(
      hide(
        "You need to provide a username or a Discord user to fetch their Osu! profile.",
      ),
    );
  },
};
