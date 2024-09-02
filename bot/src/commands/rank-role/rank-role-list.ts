import type { ChatInputCommandInteraction } from "discord.js";
import { assertBot } from "../../utils/assert.js";
import { prettyRole } from "../../utils/message.js";
import { listRankRole as listRankRoleDb } from "../../services/rank-role-service.js";
import { template } from "../../utils/template.js";

const listSuccess = template`There are ${"amount"} role mappings.
_Only a max of 20 are shown._

${"listItems"}`;

const listItem = template`- ${"role"}: rank \`${"min"}\` to \`${"max"}\`, id \`${"id"}\``;

export async function listRankRole(
  interaction: ChatInputCommandInteraction,
): Promise<unknown> {
  const bot = interaction.client;

  assertBot(bot);

  if (!interaction.guildId) {
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const rankRoles = await listRankRoleDb(bot.db, interaction.guildId);

  if (!rankRoles.length) {
    return interaction.followUp(
      "There are no role mappings! Use `/rank-role add` to create one.",
    );
  }

  return interaction.followUp(
    listSuccess({
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
  );
}
