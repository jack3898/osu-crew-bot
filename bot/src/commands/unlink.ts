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

const button = new ButtonBuilder()
  .setCustomId(ButtonId.UnlinkConfirm)
  .setLabel("I am sure")
  .setStyle(ButtonStyle.Danger);

const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

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
  },
};
