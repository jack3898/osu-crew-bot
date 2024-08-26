import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { listRankRole as listRankRoleDb } from "../services/rank-role-service.js";
import { template } from "../utils/template.js";
import { hide, prettyRole } from "../utils/message.js";

const message = template`There are ${"amount"} role mappings.
_Only a max of 20 are shown._

${"listItems"}`;

const listItem = template`- ${"role"}: rank \`${"min"}\` to \`${"max"}\`, id \`${"id"}\``;

export const listRankRole: Command = {
  definition: new SlashCommandBuilder()
    .setName("list-rank-role")
    .setDescription("Show all the rank-to-role mappings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const bot = interaction.client;

    assertBot(bot);

    if (!interaction.isChatInputCommand() || !interaction.guildId) {
      return;
    }

    const rankRoles = await listRankRoleDb(bot.db, interaction.guildId);

    if (!rankRoles.length) {
      return interaction.reply(
        hide("There are no role mappings! Use `/add-rank-role` to create one."),
      );
    }

    return interaction.reply(
      hide(
        message({
          amount: rankRoles.length,
          listItems: rankRoles
            .map((rankRole) =>
              listItem({
                id: rankRole.id,
                min: rankRole.min_requirement,
                max: rankRole.max_requirement,
                role: prettyRole(rankRole.role_id),
              }),
            )
            .join("\n"),
        }),
      ),
    );
  },
};
