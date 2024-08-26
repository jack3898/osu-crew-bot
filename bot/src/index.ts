import { Events, GatewayIntentBits } from "discord.js";
import { Bot } from "./bot.js";
import { link } from "./commands/link.js";
import { code } from "./commands/code.js";
import { handleReady } from "./events/ready.js";
import { env } from "./env.js";
import { me } from "./commands/me.js";
import { role } from "./commands/role.js";
import { rankRole } from "./commands/rank-role/rank-role.js";
import { rankRoleClearYes } from "./buttons/rank-role-clear-yes.js";
import { rankRoleClearNo } from "./buttons/rank-role-clear-no.js";
import { handleInteractionCreateChatCommand } from "./events/interaction-create-chat-command.js";
import { handleInteractionCreateButton } from "./events/interaction-create-button.js";
import { handleGuildMemberAdd } from "./events/guild-member-add.js";

const bot = new Bot(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMembers,
    ],
  },
  { url: env.DATABASE_URL },
);

// Make the commands known to the bot
bot.registerSlashCommand(link);
bot.registerSlashCommand(code);
bot.registerSlashCommand(me);
bot.registerSlashCommand(role);
bot.registerSlashCommand(rankRole);

// Handle button clicks in chat messages
bot.registerButton(rankRoleClearYes);
bot.registerButton(rankRoleClearNo);

// Tell the bot what to do when certain events occur
// New event handlers should be registered here
bot.on(Events.ClientReady, handleReady);
bot.on(Events.InteractionCreate, handleInteractionCreateChatCommand);
bot.on(Events.InteractionCreate, handleInteractionCreateButton);
bot.on(Events.GuildMemberAdd, handleGuildMemberAdd);

// Strap things up!
await Promise.all([bot.login(), bot.publishSlashCommands()]);
