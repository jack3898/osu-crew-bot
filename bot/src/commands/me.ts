import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { getOsuApiClient } from "../services/user-service.js";

export const me: Command = {
  definition: new SlashCommandBuilder().setName("me").setDescription("You!"),
  async execute(interaction) {
    const bot = interaction.client;

    assertBot(bot);

    const osuClient = await getOsuApiClient(
      undefined,
      interaction.user.id,
      bot.db,
    );

    const user = await osuClient?.users.getSelf();

    if (!user) {
      return interaction.reply("I do not know who you are. :(");
    }

    interaction.reply(
      `Hey, ${user.username}! I see you're rank ${user.rank_history.data.at(-1)}, not too shabby.`,
    );
  },
};
