import { GuildMember, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { getOsuApiClient } from "../services/user-service.js";
import { RoleCalculator } from "../utils/role-calculator.js";
import { env } from "../env.js";

const roleCalculator = new RoleCalculator(
  env.DISCORD_OSU_RANK_ROLE_MAPPINGS_URL,
);

export const role: Command = {
  definition: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Fetch your Osu! rank and get your role!"),
  async execute(interaction): Promise<void> {
    const bot = interaction.client;

    assertBot(bot);

    const osuClient = await getOsuApiClient(
      undefined,
      interaction.user.id,
      bot.db,
    );

    if (!osuClient) {
      await interaction.reply(
        "I do not know who you are yet. Please link your account first with `/link`!",
      );

      return;
    }

    const user = await osuClient?.users.getSelf();
    const rank = user?.rank_history.data.at(-1);

    if (!rank) {
      await interaction.reply("There was an error fetching your rank.");

      return;
    }

    const roleId = await roleCalculator.getDiscordRoleWithOsuRank(rank);

    if (!roleId) {
      await interaction.reply("There was an error calculating your next role.");

      return;
    }

    // Check the client can manage roles
    if (!interaction.guild) {
      return;
    }

    const member = interaction.member;

    if (
      interaction.guild.members.me?.permissions.has("ManageRoles") &&
      member instanceof GuildMember
    ) {
      await member.roles.add(roleId);
    }

    await interaction.reply(
      `Congratulations! I think you are deserving of <@&${roleId}>!`,
    );
  },
};
