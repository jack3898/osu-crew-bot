import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { userSchema } from "../schema.js";

export const db: Command = {
  definition: new SlashCommandBuilder().setName("db").setDescription("Test"),
  async execute(interaction): Promise<void> {
    const bot = interaction.client;

    assertBot(bot);

    const data = await bot.db.select().from(userSchema);

    console.log(data);
  },
};
