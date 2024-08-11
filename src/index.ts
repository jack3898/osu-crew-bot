import { Events, GatewayIntentBits } from "discord.js";
import { Client } from "./client.js";
import { env } from "./env.js";
import { updateRole } from "./commands/update-role.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

await client.login(env.DISCORD_TOKEN);

client.registerSlashCommand(updateRole);

await client.publishSlashCommands();

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  if (!(interaction.client instanceof Client)) {
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command.",
      ephemeral: true,
    });
  }
});
