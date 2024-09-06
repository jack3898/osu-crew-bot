import { DropdownId, type InteractiveElementHandler } from "../types.js";

export const bountySelectDropdown: InteractiveElementHandler = {
  type: "dropdown",
  id: DropdownId.BountyType,
  async execute(interaction) {
    return interaction.reply(
      `Acknowledged! ${interaction.customId} was selected with value ${interaction.values.at(0)}!`,
    );
  },
};
