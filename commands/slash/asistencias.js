// commands/slash/asistencias.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('asistencias').setDescription('Muestra el ranking de asistencias.'),
  async execute(interaction, client) {
    const { data, error } = await client.supabase.from('virgo_stats').select('nombre,asistencias').order('asistencias',{ascending:false}).limit(10);
    if (error) return interaction.reply({ content: 'Error al obtener datos.', ephemeral: true });
    const embed = new EmbedBuilder().setTitle('🤝 Top 10 Asistencias').setDescription(data.map((p,i)=>`${i+1}. ${p.nombre}: ${p.asistencias}`).join('\n')).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};