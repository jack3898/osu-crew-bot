import type { CacheType, Interaction } from "discord.js";
import { assertBot } from "../utils/assert.js";
import { hide, safeReply } from "../utils/message.js";

export async function handleInteractionCreateDropdown(
  interaction: Interaction<CacheType>,
): Promise<void> {
  if (!interaction.isAnySelectMenu()) {
    return;
  }

  try {
    assertBot(interaction.client);

    const interactionHandler = interaction.client.interactionComponents.get(
      interaction.customId,
    );

    if (!interactionHandler || interactionHandler.type !== "dropdown") {
      await interaction.reply(
        hide(
          "I received an interaction I do not know how to handle. This is a bug! 😨",
        ),
      );

      return;
    }

    await interactionHandler.execute(interaction);
  } catch (error) {
    console.error(error);

    await safeReply(
      interaction,
      hide("There was an error while processing this interaction."),
    );
  }
}
