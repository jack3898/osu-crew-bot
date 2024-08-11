import {
  type CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../types.js";
import { env } from "../env.js";
import { Client as OsuClient } from "osu-web.js";
import { exchangeOsuOAuth2Code } from "../utils/http.js";
import { getOsuRole } from "../utils/osu-role.js";
import roles from "../roles.js";

export const code: Command = {
  definition: new SlashCommandBuilder()
    .setName("code")
    .setDMPermission(true)
    .setDescription("Exchange a code")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code you received from the OAuth2 flow.")
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction): Promise<void> {
    const code = interaction.options.get("code", true);

    if (typeof code.value !== "string") {
      return;
    }

    const result = await exchangeOsuOAuth2Code(
      code.value,
      env.OSU_CLIENT_ID,
      env.OSU_CLIENT_SECRET,
      env.OSU_REDIRECT_URI,
    );

    if (!result) {
      await interaction.reply(
        "There was an error exchanging the code for an access token.",
      );

      return;
    }

    const osuClient = new OsuClient(result.access_token);
    const user = await osuClient.users.getSelf();
    const rank = user.rank_history.data.at(-1);

    if (!rank) {
      await interaction.reply("There was an error fetching your rank.");

      return;
    }

    const role = getOsuRole(rank, roles);

    if (!role) {
      await interaction.reply("There was an error calculating your next role.");

      return;
    }

    await interaction.reply(
      `Congratulations! I think you are deserving of <@&${role.id}>!`,
    );

    // Check the client can manage roles
    if (!interaction.guild) {
      return;
    }

    const member = interaction.member;

    if (
      interaction.guild.members.me?.permissions.has("ManageRoles") &&
      member instanceof GuildMember
    ) {
      await member.roles.add(role.id);
    }
  },
};
