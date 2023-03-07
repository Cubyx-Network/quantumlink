import { config, logger } from "../main";
import client from "./discord";
import ISlashCommand from "./ISlashCommand";

const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

export default async function updateSlashCommands() {
  const commands = [];

  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const { default: command } = require(`./commands/${file}`) as {
      default: ISlashCommand;
    };
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(config.discord_token);

  try {
    logger.debug(
      `[DISCORD] Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(Routes.applicationCommands(client.user?.id), {
      body: commands,
    });

    logger.debug(
      `[DISCORD] Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    logger.error(error);
  }
}
