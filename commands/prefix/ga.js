// commands/prefix/ga.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'ga', description:'Top G+A',
  async execute(message,args,client) {
    let { data,error }= await client.supabase.from('virgo_stats').select('nombre,goles,asistencias');
    if(error) return message.reply('Error');
    const arr=data.map(p=>({nombre:p.nombre,ga:p.goles+p.asistencias})).sort((a,b)=>b.ga-a.ga);
    const embed=new EmbedBuilder().setTitle('🔗 Top G+A')
      .setDescription(arr.slice(0,10).map((p,i)=>`${i+1}. ${p.nombre}: ${p.ga}`).join('\n')).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};