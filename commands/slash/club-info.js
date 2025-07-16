// commands/slash/club-info.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('club-info').setDescription('Muestra información del club.'),
  async execute(interaction, client) {
    const { data: club } = await client.supabase.from('club_stats').select('*').single();
    const embed = new EmbedBuilder().setTitle(`🏛️ ${club.name}`).addFields({name:'Registro',value:`${club.victorias}-${club.empates}-${club.derrotas}`},{name:'Jugados',value:`${club.partidos_jugados}`,inline:true},{name:'Liga',value:`${club.partidos_liga}`,inline:true},{name:'Playoff',value:`${club.partidos_playoff}`,inline:true},{name:'Favor',value:`${club.goles_marcados}`,inline:true},{name:'Contra',value:`${club.goles_encajados}`,inline:true},{name:'Mejor Playoff',value:club.mejor_playoff}).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};