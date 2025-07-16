// commands/slash/goles.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('goles').setDescription('Muestra el ranking de goles.'),
  async execute(interaction, client) {
    const { data, error } = await client.supabase.from('virgo_stats').select('nombre,goles').order('goles',{ascending:false}).limit(10);
    if (error) return interaction.reply({ content: 'Error al obtener datos.', ephemeral: true });
    const embed = new EmbedBuilder().setTitle('🏆 Top 10 Goleadores').setDescription(data.map((p,i)=>`${i+1}. ${p.nombre}: ${p.goles}`).join('\n')).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};