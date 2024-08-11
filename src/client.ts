import { env } from "./env.js";
import type { Command } from "./types.js";
import {
  Client,
  REST,
  Routes,
  Collection,
  type ClientOptions,
} from "discord.js";

export class Bot extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }

  readonly commands = new Collection<PropertyKey, Command>();
  readonly rest = new REST();

  /**
   * Registers a local slash command to later be published to Discord's API.
   */
  async registerSlashCommand(command: Command): Promise<void> {
    this.commands.set(command.definition.name, command);
  }

  /**
   * Publishes all local slash commands registered using registerSlashCommands to Discord's API.
   */
  async publishSlashCommands(): Promise<void> {
    console.info("Publishing slash commands...");

    const route = env.OPTIONAL_DISCORD_GUILD_ID
      ? Routes.applicationGuildCommands(
          env.DISCORD_CLIENT_ID,
          env.OPTIONAL_DISCORD_GUILD_ID,
        )
      : Routes.applicationCommands(env.DISCORD_CLIENT_ID);

    if (!env.OPTIONAL_DISCORD_GUILD_ID) {
      console.warn(
        "No GUILD_ID was provided, this means the commands will be global and may take up to an hour to propagate.",
      );
    }

    await this.rest.put(route, {
      body: this.commands.map((command) => command.definition.toJSON()),
    });

    console.log("Successfully published slash commands.");
  }
}
