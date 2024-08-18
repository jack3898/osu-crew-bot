import type { GuildMember } from "discord.js";
import { readFile } from "fs/promises";

const message = await readFile("src/intro.md");

export function guildMemberAdd(member: GuildMember): void {
  member.send(message.toString("utf-8"));
}
