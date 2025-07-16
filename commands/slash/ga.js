// commands/slash/ga.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ga').setDescription('Muestra el ranking de goles + asistencias.'),
  async execute(interaction, client) {
    let { data, error } = await client.supabase.from('virgo_stats').select('nombre,goles,asistencias');
    if (error) return interaction.reply({ content: 'Error al obtener datos.', ephemeral: true });
    const arr = data.map(p=>({ nombre:p.nombre, ga:p.goles+p.asistencias })).sort((a,b)=>b.ga-a.ga);
    const embed = new EmbedBuilder().setTitle('🔗 Top 10 Goles + Asistencias').setDescription(arr.slice(0,10).map((p,i)=>`${i+1}. ${p.nombre}: ${p.ga}`).join('\n')).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};