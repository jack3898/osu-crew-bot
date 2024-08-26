import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { assertBot } from "../utils/assert.js";
import { jwt } from "../jwt.js";
import { decodeCode } from "../utils/code.js";
import {
  exchangeOsuOAuth2CodeAndSaveToDb,
  getOsuApiClient,
} from "../services/user-service.js";
import { hide } from "../utils/message.js";

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
  async execute(interaction) {
    const user = interaction.member?.user;

    if (!user) {
      return;
    }

    const bot = interaction.client;

    assertBot(bot);

    // This helps prevent the code from being exchanged by users who haven't started the OAuth2 flow
    if (!bot.oauthState.exists(interaction.user.id)) {
      return interaction.reply(hide("Please use the `/link` command first!"));
    }

    if (!bot.oauthState.valid(interaction.user.id)) {
      return interaction.reply(hide("Please wait before trying again."));
    }

    bot.oauthState.use(interaction.user.id);

    const userProvidedCode = interaction.options.get("code", true);

    if (typeof userProvidedCode.value !== "string") {
      return;
    }

    const { code, state } = decodeCode(userProvidedCode.value);

    if (!code || !state) {
      return interaction.reply(hide("The provided code is invalid."));
    }

    // This JWT cannot be tampered with, as it is signed with a secret only the bot knows
    // It also contains the user's Discord ID, so we can verify the user exchanging the code to prevent forgery
    const verifiedState = await jwt.verify(state);

    if (verifiedState.discordUserId !== interaction.user.id) {
      return interaction.reply(
        hide(
          "This code is not for you. Please use the `/link` command for your own account.",
        ),
      );
    }

    const result = await exchangeOsuOAuth2CodeAndSaveToDb(
      bot.db,
      user.id,
      code,
    );

    if (!result) {
      return interaction.reply(
        hide("There was an error exchanging the code for an access token."),
      );
    }

    const osuClient = await getOsuApiClient(result.access_token);
    const osuUser = await osuClient.users.getSelf();
    const username = osuUser.username;

    if (!username) {
      return interaction.reply(hide("There was an error fetching your rank."));
    }

    await interaction.reply(hide(`Hey, ${username}! 🥳 All done!`));
  },
};
