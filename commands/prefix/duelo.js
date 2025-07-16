// commands/prefix/duelo.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'duelo', description:'Simula duelo',
  async execute(message,args,client) {
    const [j1,j2] = args;
    if(!j1||!j2) return message.reply('Uso: .duelo <j1> <j2>');
    const reply = await message.reply('🎤 Generando duelo...');
    let events = [];
    try {
      const res = await client.openai.createChatCompletion({model:client.model,messages:[
        {role:'system',content:'Genera duelos freestyle.'},
        {role:'user',content:`Duelo entre ${j1} y ${j2}. JSON con descripciones.`}
      ]});
      events = JSON.parse(res.data.choices[0].message.content);
    } catch {return reply.edit('Error IA');}
    const embed=new EmbedBuilder().setTitle(`🎤 Duelo: ${j1} vs ${j2}`).setTimestamp();
    await reply.edit({ embeds:[embed] });
    for(const ev of events){
      await new Promise(r=>setTimeout(r,3000));
      embed.setDescription(ev.description);
      await reply.edit({ embeds:[embed] });
    }
  }
};