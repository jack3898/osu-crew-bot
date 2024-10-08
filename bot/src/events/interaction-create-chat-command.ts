import type { CacheType, Interaction } from "discord.js";
import { assertBot } from "../utils/assert.js";
import { env } from "../env.js";
import { hide, safeReply } from "../utils/message.js";

export async function handleInteractionCreateChatCommand(
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

    if (
      bot.recentEngagements.get(interaction.user.id) &&
      env.NODE_ENV !== "development"
    ) {
      await interaction.reply(hide("You're going too fast!"));

      bot.recentEngagements.set(interaction.user.id, true);

      return;
    }

    bot.recentEngagements.set(interaction.user.id, true);

    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    await safeReply(
      interaction,
      hide("There was an error while completing this command."),
    );
  }
}
