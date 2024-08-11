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

    await interaction.reply({
      content: "There was an error while executing this command.",
      ephemeral: true,
    });
  }
}
