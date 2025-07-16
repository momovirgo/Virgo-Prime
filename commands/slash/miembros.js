// commands/slash/miembros.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('miembros').setDescription('Muestra la lista de miembros del club.'),
  async execute(interaction, client) {
    const { data: members } = await client.supabase.from('club_members').select('*');
    const embed = new EmbedBuilder().setTitle('👥 Miembros del Club').setDescription(members.map(m=>`• ${m.name} (${m.role})`).join('\n')).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};