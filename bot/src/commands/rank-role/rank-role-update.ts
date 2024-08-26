import type { ChatInputCommandInteraction } from "discord.js";
import { assertBot } from "../../utils/assert.js";
import { hide, prettyRole } from "../../utils/message.js";
import { updateRankRole as updateRankRoleDb } from "../../services/rank-role-service.js";
import { template } from "../../utils/template.js";

const updateSuccess = template`Successfully updated ID \`${"id"}\`. It now uses ${"role"} using a rank range of \`${"min"}\` to \`${"max"}\`.`;

export async function updateRankRole(
  interaction: ChatInputCommandInteraction,
): Promise<unknown> {
  const bot = interaction.client;

  assertBot(bot);

  if (!interaction.guildId) {
    return;
  }

  const id = interaction.options.getInteger("id", true);

  // TODO: it's possible to bypass the checks performed in the add rank role command
  // I should create a utility that is reused here and in the add rank role to verify
  // That the updated values are still valid (i.e. max not being smaller than min etc.)

  const [rankRole] = await updateRankRoleDb(bot.db, id, interaction.guildId, {
    minRequirement: interaction.options.getInteger("min-rank"),
    maxRequirement: interaction.options.getInteger("max-rank"),
    roleId: interaction.options.getRole("role")?.id ?? null,
  });

  if (!rankRole) {
    return interaction.reply(
      hide(
        "I didn't manage to update any rank role. This is probably a bug! 😨",
      ),
    );
  }

  return interaction.reply(
    hide(
      updateSuccess({
        id: rankRole.id,
        min: rankRole.min_requirement,
        max: rankRole.max_requirement,
        role: prettyRole(rankRole.role_id),
      }),
    ),
  );
}
