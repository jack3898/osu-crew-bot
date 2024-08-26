import type {
  SlashCommandOptionsOnlyBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ButtonInteraction,
} from "discord.js";

export type Command = {
  definition:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute(interaction: CommandInteraction): Promise<unknown>;
};

export type ButtonInteractionId = "rank-role-clear-yes" | "rank-role-clear-no";

export type Button = {
  id: ButtonInteractionId;
  execute(interaction: ButtonInteraction): Promise<unknown>;
};
