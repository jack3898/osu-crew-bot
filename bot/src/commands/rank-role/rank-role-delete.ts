import type { ChatInputCommandInteraction } from "discord.js";
import { template } from "../../utils/template.js";
import { assertBot } from "../../utils/assert.js";
import { hide, prettyRole } from "../../utils/message.js";
import { deleteRankRole as deleteRankRoleDb } from "../../services/rank-role-service.js";

const deleteSuccess = template`Successfully deleted ${"role"} given between rank ${"min"} to ${"max"}.`;

export async function deleteRankRole(
  interaction: ChatInputCommandInteraction,
): Promise<unknown> {
  const bot = interaction.client;

  assertBot(bot);

  if (!interaction.guildId) {
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
      deleteSuccess({
        role: prettyRole(result.role_id),
        min: result.min_requirement,
        max: result.max_requirement,
      }),
    ),
  );
}
