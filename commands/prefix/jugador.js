// commands/prefix/jugador.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'jugador', description:'Estadísticas de un jugador',
  async execute(message,args,client) {
    const q = args.join(' ');
    if(!q) return message.reply('Uso: .jugador <nombre/tag>');
    const { data: player }=await client.supabase.from('virgo_stats').select('*').or(`nombre.eq.${q},console_tag.eq.${q}`).single();
    if(!player) return message.reply('No encontrado');
    const embed=new EmbedBuilder().setTitle(`🔎 ${player.nombre}`)
      .addFields(
        {name:'Tag',value:player.console_tag,inline:true},
        {name:'P',value:`${player.partidos}`,inline:true},
        {name:'G',value:`${player.goles}`,inline:true},
        {name:'A',value:`${player.asistencias}`,inline:true},
        {name:'G+A',value:`${player.goles+player.asistencias}`,inline:true}
      ).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};