import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import ISlashCommand from "../ISlashCommand";
import { deleteLink } from "../../admin";

export default {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Löscht einen Cubyx QuantumLink.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription('Die ID des Links. (Format: "/dies/ist/ein/link")')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const options = interaction.options as CommandInteractionOptionResolver;

    const id = options.getString("id");

    if (!id) {
      await interaction.editReply("Es wurde keine ID angegeben.");
      return;
    }

    deleteLink(id)
      .then(async () => {
        const embed = new EmbedBuilder()
          .setTitle("Link gelöscht")
          .setDescription(`Der Link mit der ID ${id} wurde gelöscht.`)
          .setColor(0xff0000)
          .setTimestamp(new Date());

        await interaction.editReply({
          embeds: [embed],
        });
      })
      .catch(async (err) => {
        if (err === 404) {
          await interaction.editReply(
            "Ein Link mit dieser ID existiert nicht."
          );
          return;
        }
        await interaction.editReply("Ein Fehler ist aufgetreten.");
        return;
      });
  },
} as ISlashCommand;
