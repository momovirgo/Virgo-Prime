// commands/slash/perfil.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('perfil').setDescription('Muestra tu perfil de jugador.'),
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const { data: player } = await client.supabase.from('virgo_stats').select('*').eq('discord_id', userId).single();
    if (!player) return interaction.reply({ content: 'Perfil no encontrado.', ephemeral: true });
    const embed = new EmbedBuilder().setTitle(`🔎 Perfil: ${player.nombre}`).addFields({name:'Partidos',value:`${player.partidos}`,inline:true},{name:'Goles',value:`${player.goles}`,inline:true},{name:'Asistencias',value:`${player.asistencias}`,inline:true},{name:'G+A',value:`${player.goles+player.asistencias}`,inline:true}).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};