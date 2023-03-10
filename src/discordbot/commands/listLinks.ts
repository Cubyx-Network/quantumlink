import {
  CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import ISlashCommand from "../ISlashCommand";
import { getLinks } from "../../admin";
import { table } from "table";

export default {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Gibt alle existierenden Cubyx QuantumLinks aus.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction: CommandInteraction) {
    const links = await getLinks();
    const tableInput = [
      ["ID", "URL", "Beschreibung"],
      ...links.map((link) => {
        return [link.id, link.url, link.description || ""];
      }),
    ];

    await interaction.reply(`\`\`\`${table(tableInput)}\`\`\``);
  },
} as ISlashCommand;
