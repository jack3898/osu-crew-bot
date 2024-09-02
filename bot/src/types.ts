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

export type ButtonHandler = {
  id: ButtonId;
  execute(interaction: ButtonInteraction): Promise<unknown>;
};

export const enum ButtonId {
  Disabled = "a",
  RankRoleClearConfirm = "b",
  UnlinkConfirm = "c",
}
