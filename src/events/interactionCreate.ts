import type { CacheType, Interaction } from "discord.js";
import { Bot } from "../client.js";

export async function handleInteractionCreate(
  interaction: Interaction<CacheType>,
): Promise<void> {
  if (!interaction.isCommand() || !(interaction.client instanceof Bot)) {
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
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
