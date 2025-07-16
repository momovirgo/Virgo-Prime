// commands/slash/partidos.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('partidos').setDescription('Muestra el ranking de partidos jugados.'),
  async execute(interaction, client) {
    const { data, error } = await client.supabase.from('virgo_stats').select('nombre,partidos').order('partidos',{ascending:false}).limit(10);
    if (error) return interaction.reply({ content: 'Error al obtener datos.', ephemeral: true });
    const embed = new EmbedBuilder().setTitle('🎮 Top 10 Partidos Jugados').setDescription(data.map((p,i)=>`${i+1}. ${p.nombre}: ${p.partidos}`).join('\n')).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};