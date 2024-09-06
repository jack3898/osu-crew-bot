import { deleteAllRankRoles } from "../services/rank-role-service.js";
import { ButtonId, type InteractiveElementHandler } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { hide } from "../utils/message.js";

export const rankRoleClearConfirm: InteractiveElementHandler = {
  type: "button",
  id: ButtonId.RankRoleClearConfirm,
  async execute(interaction) {
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

    return interaction.reply(
      hide(
        `Successfully deleted \`${result.rowsAffected}\` records, your role mappings are now cleared.`,
      ),
    );
  },
};
