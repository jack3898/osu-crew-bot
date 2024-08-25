import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";

export const deleteRankRole: Command = {
  definition: new SlashCommandBuilder()
    .setName("delete-rank-role")
    .setDescription("Delete a rank-to-role mapping.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription(
          "The ID of the mapped role. Use `/list-rank-role` to see ranked roles and their IDs",
        )
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  execute(interaction) {
    // TODO: Finish off
    return interaction.reply("Coming soon!");
  },
};
