import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import ISlashCommand from "../ISlashCommand";
import { updateLink } from "../../admin";

export default {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Bearbeitet einen Cubyx QuantumLink.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription('Die ID des Links. (Format: "/dies/ist/ein/link")')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Die neue URL des Links.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Die neue Beschreibung des Links.")
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

    updateLink(id, url, description)
      .then(async () => {
        const embed = new EmbedBuilder()
          .setTitle("Link erstellt")
          .setDescription(`Der Link mit der ID ${id} wurde bearbeitet.`)
          .setColor(0x0000ff)
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
