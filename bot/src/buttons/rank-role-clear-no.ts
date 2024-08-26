import type { Button } from "../types.js";
import { hide } from "../utils/message.js";

export const rankRoleClearNo: Button = {
  id: "rank-role-clear-no",
  async execute(interaction) {
    return interaction.reply(hide("Ok, your data is safe!"));
  },
};
