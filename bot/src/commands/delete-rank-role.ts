import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { deleteRankRole as deleteRankRoleDb } from "../services/rank-role-service.js";
import { template } from "../utils/template.js";
import { hide } from "../utils/message.js";

const success = template`Successfully deleted <@&${"roleid"}> given between rank ${"min"} to ${"max"}.`;

export const deleteRankRole: Command = {
  definition: new SlashCommandBuilder()
    .setName("delete-rank-role")
    .setDescription("Delete a rank-to-role mapping.")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription(
          "The ID of the mapped role. Use `/list-rank-role` to see ranked roles and their IDs",
        )
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const bot = interaction.client;

    assertBot(bot);

    if (!interaction.isChatInputCommand() || !interaction.guildId) {
      return;
    }

    const id = interaction.options.getInteger("id", true);

    const [result] = await deleteRankRoleDb(bot.db, id, interaction.guildId);

    if (!result) {
      return interaction.reply(
        hide(
          "I could not find that role mapping to delete. Does it belong in this server?",
        ),
      );
    }

    return interaction.reply(
      hide(
        success({
          roleid: result.role_id,
          min: result.min_requirement,
          max: result.max_requirement,
        }),
      ),
    );
  },
};
