import type { ChatInputCommandInteraction } from "discord.js";
import { assertBot } from "../../utils/assert.js";
import { hide } from "../../utils/message.js";
import { addRankRole as addRankRoleDb } from "../../services/rank-role-service.js";

export async function addRankRole(
  interaction: ChatInputCommandInteraction,
): Promise<unknown> {
  const bot = interaction.client;

  assertBot(bot);

  if (!interaction.guildId) {
    return;
  }

  const role = interaction.options.getRole("role", true);
  const minRank = interaction.options.getInteger("min-rank", true);
  const maxRank = interaction.options.getInteger("max-rank", true);

  if (minRank <= 0 || maxRank <= 0) {
    return interaction.reply(
      hide("The rank requirements must be greater than 0."),
    );
  }

  if (minRank >= maxRank) {
    return interaction.reply(
      hide("The maximum rank requirement must be greater than the minimum."),
    );
  }

  const [result] = await addRankRoleDb(bot.db, {
    roleId: role.id,
    minRequirement: minRank,
    maxRequirement: maxRank,
    permanent: true,
    serverId: interaction.guildId,
  });

  return interaction.reply(
    hide(
      `I have saved the role mapping for ${role} under id \`${result?.id}\`! 🙌`,
    ),
  );
}
