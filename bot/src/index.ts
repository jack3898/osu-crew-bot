import { Events, GatewayIntentBits } from "discord.js";
import { Bot } from "./bot.js";
import { link } from "./commands/link.js";
import { code } from "./commands/code.js";
import { handleReady } from "./events/ready.js";
import { handleInteractionCreate } from "./events/interaction-create.js";
import { guildMemberAdd } from "./events/guild-member-add.js";
import { env } from "./env.js";
import { me } from "./commands/me.js";
import { role } from "./commands/role.js";

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
// New commands should be registered here
bot.registerSlashCommand(link);
bot.registerSlashCommand(code);
bot.registerSlashCommand(me);
bot.registerSlashCommand(role);

// Tell the bot what to do when certain events occur
// New event handlers should be registered here
bot.on(Events.ClientReady, handleReady);
bot.on(Events.InteractionCreate, handleInteractionCreate);
bot.on(Events.GuildMemberAdd, guildMemberAdd);

// Strap things up!
await Promise.all([bot.login(), bot.publishSlashCommands()]);
