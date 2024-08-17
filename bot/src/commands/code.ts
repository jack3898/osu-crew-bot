import {
  type CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../types.js";
import { env } from "../env.js";
import { Client as OsuClient } from "osu-web.js";
import { exchangeOsuOAuth2Code } from "../utils/http.js";
import { assertBot } from "../utils/assert.js";
import { jwt } from "../jwt.js";
import { decodeCode } from "../utils/code.js";
import { RoleCalculator } from "../utils/role-calculator.js";

const roleCalculator = new RoleCalculator(
  env.DISCORD_OSU_RANK_ROLE_MAPPINGS_URL,
);

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
    const bot = interaction.client;

    assertBot(bot);

    // This helps prevent the code from being exchanged by users who haven't started the OAuth2 flow
    if (!bot.oauthState.exists(interaction.user.id)) {
      await interaction.reply("Please use the `/role` command first!");

      return;
    }

    if (!bot.oauthState.valid(interaction.user.id)) {
      await interaction.reply("Please wait before trying again.");

      return;
    }

    bot.oauthState.use(interaction.user.id);

    const userProvidedCode = interaction.options.get("code", true);

    if (typeof userProvidedCode.value !== "string") {
      return;
    }

    const { code, state } = decodeCode(userProvidedCode.value);

    if (!code || !state) {
      await interaction.reply("The provided code is invalid.");

      return;
    }

    // This JWT cannot be tampered with, as it is signed with a secret only the bot knows
    // It also contains the user's Discord ID, so we can verify the user exchanging the code to prevent forgery
    const verifiedState = await jwt.verify(state);

    if (verifiedState.discordUserId !== interaction.user.id) {
      await interaction.reply(
        "This code is not for you. Please use the `/role` command for your own account.",
      );

      return;
    }

    const result = await exchangeOsuOAuth2Code(
      code,
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

    const roleId = await roleCalculator.getDiscordRoleWithOsuRank(rank);

    if (!roleId) {
      await interaction.reply("There was an error calculating your next role.");

      return;
    }

    await interaction.reply(
      `Congratulations! I think you are deserving of <@&${roleId}>!`,
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
      await member.roles.add(roleId);
    }
  },
};
