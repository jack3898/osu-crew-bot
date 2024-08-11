import type {
  SlashCommandOptionsOnlyBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export type Command = {
  definition: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute(interaction: CommandInteraction): Promise<unknown>;
};
