// commands/prefix/comparar.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'comparar', description:'Compara dos jugadores',
  async execute(message,args,client) {
    const [j1,j2]=args;
    if(!j1||!j2) return message.reply('Uso: .comparar <j1> <j2>');
    const { data:p1 }=await client.supabase.from('virgo_stats').select('partidos,goles,asistencias').eq('nombre',j1).single();
    const { data:p2 }=await client.supabase.from('virgo_stats').select('partidos,goles,asistencias').eq('nombre',j2).single();
    if(!p1||!p2) return message.reply('No encontrado');
    const embed=new EmbedBuilder().setTitle(`🔍 ${j1} vs ${j2}`)
      .addFields(
        {name:'P',value:`${p1.partidos} vs ${p2.partidos} (${p1.partidos-p2.partidos})`,inline:true},
        {name:'G',value:`${p1.goles} vs ${p2.goles} (${p1.goles-p2.goles})`,inline:true},
        {name:'A',value:`${p1.asistencias} vs ${p2.asistencias} (${p1.asistencias-p2.asistencias})`,inline:true}
      ).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};