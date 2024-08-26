import type { GuildMember } from "discord.js";
import { template } from "../utils/template.js";

const message = template`# Welcome to our server, **${"username"}**!

I'll keep this message short. Thanks for joining the server, good to have you! 🎉

**Want to show off your rank?**
I can have a little peek at your Osu! account 🔍👀 and assign you one I find most appropriate, great for if you want to show off.
Just type \`/role\` in a text channel to get started!

See you around! 👋

_I will not send any further DM's unless it is required._
`;

export async function handleGuildMemberAdd(member: GuildMember): Promise<void> {
  try {
    await member.send(message({ username: member.user.username }));
  } catch (error) {
    console.error("Unable to send user an intro DM", error);
  }
}
