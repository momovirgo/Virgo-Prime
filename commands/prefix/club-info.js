// commands/prefix/club-info.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'club-info', description:'Información del club',
  async execute(message) {
    const { data: club }=await client.supabase.from('club_stats').select('*').single();
    const embed=new EmbedBuilder().setTitle(`🏛️ ${club.name}`)
      .addFields(
        {name:'Registro',value:`${club.victorias}-${club.empates}-${club.derrotas}`},
        {name:'Jug',inline:true,value:`${club.partidos_jugados}`},
        {name:'Liga',inline:true,value:`${club.partidos_liga}`},
        {name:'Play',inline:true,value:`${club.partidos_playoff}`},
        {name:'Fv',inline:true,value:`${club.goles_marcados}`},
        {name:'Cn',inline:true,value:`${club.goles_encajados}`},
        {name:'Mejor',value:club.mejor_playoff}
      ).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};