import { config, logger } from "./main";
import { ActivityType, Client, Events } from "discord.js";

const client = new Client({ intents: ["GuildMessages"] });

/**
 * Initialize the Discord client.
 * @returns {Promise<void>}
 */
export async function init() {
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
