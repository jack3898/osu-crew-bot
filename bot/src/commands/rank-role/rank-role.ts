import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../types.js";
import { addRankRole } from "./rank-role-add.js";
import { listRankRole } from "./rank-role-list.js";
import { deleteRankRole } from "./rank-role-delete.js";
import { updateRankRole } from "./rank-role-update.js";
import { hide } from "../../utils/message.js";
import { clearRankRole } from "./rank-role-clear.js";

export const rankRole: Command = {
  definition: new SlashCommandBuilder()
    .setName("rank-role")
    .setDescription("Create, list, update or delete rank based roles.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a new rank to role mapping.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role the user will receive.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("min-rank")
            .setDescription(
              "The user's minimum rank to receive this role (greater than or equal).",
            )
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("max-rank")
            .setDescription(
              "The user's maximum rank to achieve this role (smaller than or equal).",
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Show all the rank-to-role mappings."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Update a rank role.")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription(
              "The ID of the mapped role. Use `/list-rank-role` to see ranked roles and their IDs.",
            )
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role you prefer for the given ID."),
        )
        .addIntegerOption((option) =>
          option
            .setName("min-rank")
            .setDescription(
              "The user's minimum rank to receive this role (greater than or equal).",
            ),
        )
        .addIntegerOption((option) =>
          option
            .setName("max-rank")
            .setDescription(
              "The user's maximum rank to achieve this role (smaller than or equal).",
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a rank-to-role mapping.")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription(
              "The ID of the mapped role. Use `/list-rank-role` to see ranked roles and their IDs.",
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription(
          "Delete all rank role mappings! WARNING: DESTRUCTIVE 🚨",
        ),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) {
      console.error(
        "Somehow received a non chat input command interaction type.",
      );

      return interaction.reply(
        hide("There was a problem processing this command."),
      );
    }

    switch (interaction.options.getSubcommand()) {
      case "add":
        return addRankRole(interaction);
      case "list":
        return listRankRole(interaction);
      case "update":
        return updateRankRole(interaction);
      case "delete":
        return deleteRankRole(interaction);
      case "clear":
        return clearRankRole(interaction);
      default:
        return interaction.reply(
          hide("Unknown subcommand received. This is a bug! 😨"),
        );
    }
  },
};
