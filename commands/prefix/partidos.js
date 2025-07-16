// commands/prefix/partidos.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'partidos', description:'Top partidos',
  async execute(message,args,client) {
    const { data,error }= await client.supabase.from('virgo_stats').select('nombre,partidos').order('partidos',{ascending:false}).limit(10);
    if(error) return message.reply('Error');
    const embed=new EmbedBuilder().setTitle('🎮 Top Partidos')
      .setDescription(data.map((p,i)=>`${i+1}. ${p.nombre}: ${p.partidos}`).join('\n')).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};