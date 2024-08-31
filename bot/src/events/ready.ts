import { ActivityType, type Client } from "discord.js";

export function handleReady(bot: Client): void {
  console.log(`Logged in as ${bot.user?.username}!`);

  // It's the meta
  bot.user?.setActivity("osu!", { type: ActivityType.Playing });
}
