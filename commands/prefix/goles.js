// commands/prefix/goles.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'goles', description: 'Top goles',
  async execute(message, args, client) {
    const { data, error } = await client.supabase.from('virgo_stats').select('nombre,goles').order('goles',{ascending:false}).limit(10);
    if (error) return message.reply('Error');
    const embed = new EmbedBuilder().setTitle('🏆 Top Goleadores')
      .setDescription(data.map((p,i)=>`${i+1}. ${p.nombre}: ${p.goles}`).join('\n')).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};