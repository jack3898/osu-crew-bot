import { type CommandInteraction, type SlashCommandBuilder } from "discord.js";

export type Command = {
  definition: SlashCommandBuilder;
  execute(interaction: CommandInteraction): Promise<unknown>;
};
