import { GuildMember, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { getOsuApiClient } from "../services/user-service.js";
import { getRankRoles } from "../services/rank-role-service.js";
import { template } from "../utils/template.js";
import { prettyRole } from "../utils/message.js";

const success = template`Congratulations! I think you are deserving of the following roles:

${"rolelist"}

Enjoy!`;

export const role: Command = {
  definition: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Fetch your Osu! rank and get your role!"),
  async execute(interaction) {
    const bot = interaction.client;

    assertBot(bot);

    await interaction.deferReply({ ephemeral: true });

    const osuClient = await getOsuApiClient(
      undefined,
      interaction.user.id,
      bot.db,
    );

    if (!osuClient) {
      return interaction.followUp(
        "I do not know who you are yet. Please link your account first with `/link`!",
      );
    }

    const user = await osuClient?.users.getSelf();
    const rank = user?.rank_history.data.at(-1);

    if (!rank || !interaction.guildId) {
      return interaction.followUp("There was an error fetching your rank.");
    }

    const dbRoles = await getRankRoles(bot.db, interaction.guildId, rank);

    if (!dbRoles.length) {
      return interaction.followUp("I couldn't find the best role for you. 😢");
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
      await Promise.all(
        dbRoles.map((dbRole) => member.roles.add(dbRole.role_id)),
      );
    }

    return interaction.followUp(
      success({
        rolelist: dbRoles
          .map((dbRole) => `- ${prettyRole(dbRole.role_id)}`)
          .join("\n"),
      }),
    );
  },
};
