import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import ISlashCommand from "../ISlashCommand";
import { createLink } from "../../admin";

export default {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Erstellt einen neuen Cubyx QuantumLink.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription('Die ID des Links. (Format: "/dies/ist/ein/link")')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Die URL des Links.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Die Beschreibung des Links.")
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const options = interaction.options as CommandInteractionOptionResolver;

    const id = options.getString("id");
    const url = options.getString("url");
    const description = options.getString("description") || undefined;

    if (!id || !url) {
      await interaction.editReply("Es wurde keine ID oder URL angegeben.");
      return;
    }

    createLink(id, url, description)
      .then(async () => {
        const embed = new EmbedBuilder()
          .setTitle("Link erstellt")
          .setDescription(`Der Link mit der ID ${id} wurde erstellt.`)
          .setColor(0x00ff00)
          .setTimestamp(new Date())
          .setFields([
            {
              name: "ID",
              value: id,
            },
            {
              name: "URL",
              value: url,
            },
            {
              name: "Beschreibung",
              value: description || "Keine",
            },
          ]);

        await interaction.editReply({
          embeds: [embed],
        });
      })
      .catch(async (err) => {
        if (err === 409) {
          await interaction.editReply(
            "Ein Link mit dieser ID existiert bereits."
          );
          return;
        }
        await interaction.editReply("Ein Fehler ist aufgetreten.");
        return;
      });
  },
} as ISlashCommand;
