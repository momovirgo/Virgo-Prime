// commands/prefix/perfil.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'perfil', description:'Tu perfil',
  async execute(message,args,client) {
    const { data: player }=await client.supabase.from('virgo_stats').select('*').eq('discord_id', message.author.id).single();
    if(!player) return message.reply('No perfil');
    const embed=new EmbedBuilder().setTitle(`🔎 ${player.nombre}`)
      .addFields(
        {name:'P',value:`${player.partidos}`,inline:true},
        {name:'G',value:`${player.goles}`,inline:true},
        {name:'A',value:`${player.asistencias}`,inline:true},
        {name:'G+A',value:`${player.goles+player.asistencias}`,inline:true}
      ).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};