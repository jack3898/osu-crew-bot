import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";

export const listRankRole: Command = {
  definition: new SlashCommandBuilder()
    .setName("list-rank-role")
    .setDescription("Show all the rank-to-role mappings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  execute(interaction) {
    // TODO: Finish off
    return interaction.reply("Coming soon!");
  },
};
