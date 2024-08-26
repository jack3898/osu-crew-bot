import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord.js";
import { assertBot } from "../../utils/assert.js";
import { hide } from "../../utils/message.js";
import type { ButtonInteractionId } from "../../types.js";
import { setTimeout as sleep } from "timers/promises";

const yesButton = new ButtonBuilder()
  .setCustomId("rank-role-clear-yes" satisfies ButtonInteractionId)
  .setLabel("Yes")
  .setStyle(ButtonStyle.Success);

const noButton = new ButtonBuilder()
  .setCustomId("rank-role-clear-no" satisfies ButtonInteractionId)
  .setLabel("No")
  .setStyle(ButtonStyle.Danger);

const yesButtonDisabled = new ButtonBuilder()
  .setCustomId("rank-role-clear-yes" satisfies ButtonInteractionId)
  .setLabel("Yes")
  .setStyle(ButtonStyle.Success)
  .setDisabled(true);

const noButtonDisabled = new ButtonBuilder()
  .setCustomId("rank-role-clear-no" satisfies ButtonInteractionId)
  .setLabel("No")
  .setStyle(ButtonStyle.Danger)
  .setDisabled(true);

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  yesButton,
  noButton,
);

const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  yesButtonDisabled,
  noButtonDisabled,
);

export async function clearRankRole(
  interaction: ChatInputCommandInteraction,
): Promise<unknown> {
  const bot = interaction.client;

  assertBot(bot);

  if (!interaction.guildId) {
    return;
  }

  await interaction.reply({
    ...hide(
      "Are you sure you want to clear ALL rank to role mappings? This is a destructive operation, and there's no going back!",
    ),
    components: [row],
  });

  await sleep(60_000);

  // Disable the button, discord button events expire after 15 mins, but 60 seconds is enough time
  return interaction.editReply({ components: [disabledRow] });
}
