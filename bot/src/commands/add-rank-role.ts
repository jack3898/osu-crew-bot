import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { addRankRole as addRankRoleDb } from "../services/rank-role-service.js";

export const addRankRole: Command = {
  definition: new SlashCommandBuilder()
    .setName("add-rank-role")
    .setDescription("Set what rank-based roles users get when using `/rank`.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role the user will receive.")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("min-rank")
        .setDescription(
          "The user's minimum rank to receive this role (greater than or equal).",
        )
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("max-rank")
        .setDescription(
          "The user's maximum rank to achieve this role (smaller than or equal).",
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

    const role = interaction.options.getRole("role", true);
    const minRank = interaction.options.getInteger("min-rank", true);
    const maxRank = interaction.options.getInteger("max-rank", true);

    if (minRank <= 0 || maxRank <= 0) {
      return interaction.reply("The rank requirements must be greater than 0.");
    }

    if (minRank >= maxRank) {
      return interaction.reply(
        "The maximum rank requirement must be greater than the minimum.",
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
      `I have saved the role mapping for <@&${role.id}> under id \`${result?.id}\`! 🙌`,
    );
  },
};
