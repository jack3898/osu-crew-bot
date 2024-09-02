import type { CacheType, Interaction } from "discord.js";
import { assertBot } from "../utils/assert.js";
import { hide } from "../utils/message.js";

export async function handleInteractionCreateButton(
  interaction: Interaction<CacheType>,
): Promise<void> {
  if (!interaction.isButton()) {
    return;
  }

  try {
    assertBot(interaction.client);

    if (!interaction.client.buttons.has(interaction.customId)) {
      await interaction.reply(
        hide(
          "I received a button interaction I do not know how to handle. This is a bug! 😨",
        ),
      );

      return;
    }

    await interaction.client.buttons
      .get(interaction.customId)!
      .execute(interaction);
  } catch (error) {
    console.error(error);

    const message = hide(
      "There was an error while processing the button interaction.",
    );

    if (interaction.replied) {
      await interaction.followUp(message);
    } else {
      await interaction.reply(message);
    }
  }
}
