import {
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import ISlashCommand from "../ISlashCommand";
import { getLinks } from "../../admin";

export default {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Gibt alle existierenden Cubyx QuantumLinks aus.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction: CommandInteraction) {
    const links = await getLinks();
    // const tableInput = [
    //   ["ID", "URL", "Beschreibung"],
    //   ...links.map((link) => {
    //     return [link.id, link.url, link.description || ""];
    //   }),
    // ];

    const embeds = [];
    const fields = [];

    for (const link of links) {
      if (fields.length % 3 === 0) {
        fields.push({
          name: "\u200b",
          value: "\u200b",
          inline: true,
        });
      }

      fields.push({
        name: link.id,
        value: `[Link](${link.url})`,
        inline: true,
      });
    }

    const fieldChunks = chunkArray(fields, 24);

    for (const fieldChunk of fieldChunks) {
      const embed = new EmbedBuilder()
        .setTitle("Linkübersicht")
        .setDescription("Übersicht über alle QuantumLinks.")
        .setColor(0xffffff)
        .setFooter({
          text: "------------------------------------------------------------------------------------------------",
        })
        .setFields(fieldChunk);
      embeds.push(embed);
    }

    await interaction.reply({ embeds });
  },
} as ISlashCommand;

function chunkArray<T>(myArray: T[], chunk_size: number): T[][] {
  let results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}
