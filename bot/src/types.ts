import type {
  SlashCommandOptionsOnlyBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export type Command = {
  definition:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute(interaction: CommandInteraction): Promise<unknown>;
};
