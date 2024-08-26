import type { ChatInputCommandInteraction } from "discord.js";
import { assertBot } from "../../utils/assert.js";
import { deleteAllRankRoles } from "../../services/rank-role-service.js";
import { template } from "../../utils/template.js";
import { hide } from "../../utils/message.js";

const deleteSuccess = template`Successfully deleted \`${"count"}\` records, your role mappings are now cleared.`;

export async function clearRankRole(
  interaction: ChatInputCommandInteraction,
): Promise<unknown> {
  const bot = interaction.client;

  assertBot(bot);

  if (!interaction.guildId) {
    return;
  }

  const result = await deleteAllRankRoles(bot.db, interaction.guildId);

  if (!result.rowsAffected) {
    return interaction.reply(
      hide("No role mappings were deleted. Do you have any?"),
    );
  }

  return interaction.reply(hide(deleteSuccess({ count: result.rowsAffected })));
}
