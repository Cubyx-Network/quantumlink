import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import ISlashCommand from "../ISlashCommand";
import { getLinks } from "../../admin";

export default {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription(
      "Gibt alle oder einen existierenden Cubyx QuantumLinks aus."
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription('Die ID des Links. (Format: "/dies/ist/ein/link")')
    ),
  async execute(interaction: CommandInteraction) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const search = options.getString("id");

    const links = await getLinks();

    if (search) {
      const link = links.find((link) => link.id === search);
      if (!link) {
        await interaction.reply("Ein Link mit dieser ID existiert nicht.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("Linkübersicht")
        .setDescription(`Übersicht über den Link mit der ID ${link.id}.`)
        .setColor(0xffffff)
        .setFields([
          {
            name: "ID",
            value: link.id,
            inline: true,
          },
          {
            name: "URL",
            value: link.url,
            inline: true,
          },
          {
            name: "Beschreibung",
            value: link.description || "Keine Beschreibung vorhanden.",
          },
        ])
        .setFooter({
          text: "------------------------------------------------------------------------------------------------",
        });
      await interaction.reply({ embeds: [embed] });
      return;
    }

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
        value: `[Link](${link.url})\n${link.description || ""}`,
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
