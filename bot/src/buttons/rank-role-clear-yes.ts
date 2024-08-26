import { deleteAllRankRoles } from "../services/rank-role-service.js";
import type { Button } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { hide } from "../utils/message.js";
import { template } from "../utils/template.js";

const deleteSuccess = template`Successfully deleted \`${"count"}\` records, your role mappings are now cleared.`;

export const rankRoleClearYes: Button = {
  id: "rank-role-clear-yes",
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
      hide(deleteSuccess({ count: result.rowsAffected })),
    );
  },
};
