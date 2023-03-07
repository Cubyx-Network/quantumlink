import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface ISlashCommand {
  data: SlashCommandBuilder;
  execute(interaction: CommandInteraction): Promise<void>;
}
