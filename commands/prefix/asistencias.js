// commands/prefix/asistencias.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'asistencias', description: 'Top asistencias',
  async execute(message,args,client) {
    const { data, error} = await client.supabase.from('virgo_stats').select('nombre,asistencias').order('asistencias',{ascending:false}).limit(10);
    if(error) return message.reply('Error');
    const embed=new EmbedBuilder().setTitle('🤝 Top Asistencias')
      .setDescription(data.map((p,i)=>`${i+1}. ${p.nombre}: ${p.asistencias}`).join('\n')).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};