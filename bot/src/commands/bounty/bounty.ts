import {
  ActionRowBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { DropdownId, type Command } from "../../types.js";

const dropdown = new StringSelectMenuBuilder()
  .setCustomId(DropdownId.BountyType)
  .addOptions(
    new StringSelectMenuOptionBuilder()
      .setLabel("Top 10 (osu!standard)")
      .setDescription("First player to get a new play in their top 10 wins!")
      .setValue(BountyValue.Top10),
  );

const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
  dropdown,
);

const enum BountyValue {
  Top10 = "top10",
}

export const bounty: Command = {
  definition: new SlashCommandBuilder()
    .setName("bounty")
    .setDescription("Create, list, update or delete bounties."),
  async execute(interaction) {
    return interaction.reply({
      content:
        "What challenge do you want to set? Only one challenge can be set at a time!",
      components: [actionRow],
    });
  },
};
