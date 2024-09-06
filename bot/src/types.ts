import type {
  SlashCommandOptionsOnlyBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ButtonInteraction,
  AnySelectMenuInteraction,
} from "discord.js";

export type Command = {
  definition:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute(interaction: CommandInteraction): Promise<unknown>;
};

export type InteractiveElementHandler =
  | {
      type: "button";
      id: ButtonId;
      execute(interaction: ButtonInteraction): Promise<unknown>;
    }
  | {
      type: "dropdown";
      id: DropdownId;
      execute(interaction: AnySelectMenuInteraction): Promise<unknown>;
    };

export const enum ButtonId {
  Disabled = "a",
  RankRoleClearConfirm = "b",
  UnlinkConfirm = "c",
}

export const enum DropdownId {
  BountyType = "d",
}
