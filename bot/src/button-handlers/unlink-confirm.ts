import { deleteUserById } from "../services/user-service.js";
import { ButtonId, type ButtonHandler } from "../types.js";
import { assertBot } from "../utils/assert.js";

export const unlinkConfirm: ButtonHandler = {
  id: ButtonId.UnlinkConfirm,
  async execute(interaction) {
    const bot = interaction.client;

    assertBot(bot);

    if (!interaction.guildId) {
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const result = await deleteUserById(bot.db, interaction.user.id);

    if (!result.rowsAffected) {
      return interaction.followUp(
        "You're not linked in the first place. Silly you!",
      );
    }

    return interaction.followUp(
      "You have been unlinked. 🥹 But you may at any time re-link again!",
    );
  },
};
