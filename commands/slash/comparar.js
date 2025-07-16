// commands/slash/comparar.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('comparar').setDescription('Compara las estadísticas de dos jugadores.').addStringOption(o=>o.setName('jugador1').setDescription('Jugador1').setRequired(true)).addStringOption(o=>o.setName('jugador2').setDescription('Jugador2').setRequired(true)),
  async execute(interaction, client) {
    const j1 = interaction.options.getString('jugador1');
    const j2 = interaction.options.getString('jugador2');
    const { data: p1 } = await client.supabase.from('virgo_stats').select('partidos,goles,asistencias').eq('nombre',j1).single();
    const { data: p2 } = await client.supabase.from('virgo_stats').select('partidos,goles,asistencias').eq('nombre',j2).single();
    if (!p1||!p2) return interaction.reply({ content: 'Jugador no encontrado.', ephemeral: true });
    const embed = new EmbedBuilder().setTitle(`📊 Comparativa: ${j1} vs ${j2}`).addFields({name:'Partidos',value:`${p1.partidos} vs ${p2.partidos} (${p1.partidos-p2.partidos})`,inline:true},{name:'Goles',value:`${p1.goles} vs ${p2.goles} (${p1.goles-p2.goles})`,inline:true},{name:'Asistencias',value:`${p1.asistencias} vs ${p2.asistencias} (${p1.asistencias-p2.asistencias})`,inline:true}).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};