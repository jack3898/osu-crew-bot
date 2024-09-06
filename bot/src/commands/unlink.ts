import {
  type CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { ButtonId, type Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { hide } from "../utils/message.js";
import { setTimeout as sleep } from "timers/promises";

const button = new ButtonBuilder()
  .setCustomId(ButtonId.UnlinkConfirm)
  .setLabel("I am sure")
  .setStyle(ButtonStyle.Danger);

const disabledButton = new ButtonBuilder()
  .setCustomId(ButtonId.Disabled)
  .setLabel("Expired")
  .setStyle(ButtonStyle.Danger)
  .setDisabled(true);

const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  disabledButton,
);

export const unlink: Command = {
  definition: new SlashCommandBuilder()
    .setName("unlink")
    .setDescription("Delete your linked Osu! account."),
  async execute(interaction: CommandInteraction) {
    const bot = interaction.client;

    assertBot(bot);

    await interaction.reply({
      ...hide(
        "Are you sure you want to **unlink** your account? This will delete all your associated Osu! data.",
      ),
      components: [actionRow],
    });

    await sleep(60_000);

    await interaction.editReply({ components: [disabledRow] });
  },
};
