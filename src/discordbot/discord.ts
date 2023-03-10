import { config, logger } from "../main";
import { ActivityType, Client, Collection, Events } from "discord.js";
import * as path from "path";
import * as fs from "fs";
import updateSlashCommands from "./slashCommands";
import ISlashCommand from "./ISlashCommand";

type DiscordClient = Client & {
  commands: Collection<string, any>;
};

const client = new Client({ intents: ["GuildMessages"] }) as DiscordClient;
client.commands = new Collection();

/**
 * Initialize the Discord client.
 * @returns {Promise<void>}
 */
export async function init() {
  initCommands();

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      logger.error(
        `[DISCORD] No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });

  client.once(Events.ClientReady, (c) => {
    logger.debug(`Logged in as ${c.user.tag}!`);
    c.user.setPresence({
      activities: [
        {
          name: "Cubyx Network",
          type: ActivityType.Playing,
        },
      ],
      status: "online",
    });
    updateSlashCommands();
  });
}

/**
 * Start the Discord client.
 * @returns {Promise<string>} The client's token.
 */
export async function start(): Promise<string> {
  return client.login(config.discord_token);
}

/**
 * Stop the Discord client.
 * @returns {Promise<void>}
 */
export async function stop(): Promise<void> {
  return client.destroy();
}

function initCommands(): void {
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = require(filePath) as {
      default: ISlashCommand;
    };

    if (command.data === undefined || command.execute === undefined) {
      logger.warn(
        `[DISCORD] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
      continue;
    }

    client.commands.set(command.data.name, command);
  }
}

export default client;
