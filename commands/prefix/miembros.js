// commands/prefix/miembros.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'miembros', description:'Miembros del club',
  async execute(message,args,client) {
    const { data }=await client.supabase.from('club_members').select('*');
    const embed=new EmbedBuilder().setTitle('👥 Miembros').setDescription(data.map(m=>`• ${m.name} (${m.role})`).join('\n')).setTimestamp();
    message.reply({ embeds: [embed] });
  }
};