import type { CacheType, Interaction } from "discord.js";
import { assertBot } from "../utils/assert.js";

export async function handleInteractionCreate(
  interaction: Interaction<CacheType>,
): Promise<void> {
  if (!interaction.isCommand()) {
    return;
  }

  try {
    assertBot(interaction.client);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Command not found: ${interaction.commandName}`);

      return;
    }

    const bot = interaction.client;

    if (bot.recentEngagements.get(interaction.user.id)) {
      await interaction.reply("You're going too fast!");

      bot.recentEngagements.set(interaction.user.id, true);

      return;
    }

    bot.recentEngagements.set(interaction.user.id, true);

    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    const message = {
      content: "There was an error while completing this command.",
      ephemeral: true,
    };

    if (interaction.replied) {
      await interaction.followUp(message);
    } else {
      await interaction.reply(message);
    }
  }
}
