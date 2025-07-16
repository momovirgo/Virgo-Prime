// commands/slash/duelo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('duelo').setDescription('Simula un duelo freestyle.').addStringOption(o=>o.setName('jugador1').setDescription('Jugador1').setRequired(true)).addStringOption(o=>o.setName('jugador2').setDescription('Jugador2').setRequired(true)),
  async execute(interaction, client) {
    const j1 = interaction.options.getString('jugador1');
    const j2 = interaction.options.getString('jugador2');
    await interaction.deferReply();
    const prompt = `Duelo freestyle entre ${j1} y ${j2}. Devuelve JSON con objetos {description}.`;
    let events = [];
    try {
      const res = await client.openai.createChatCompletion({ model:client.model, messages:[{role:'system',content:'Genera duelos freestyle.'},{role:'user',content:prompt}] });
      events = JSON.parse(res.data.choices[0].message.content);
    } catch {
      return interaction.editReply('❌ Error IA');
    }
    const embed = new EmbedBuilder().setTitle(`🎤 Duelo: ${j1} vs ${j2}`).setTimestamp();
    await interaction.editReply({ embeds:[embed] });
    for(const ev of events) {
      await new Promise(r=>setTimeout(r,2000));
      embed.setDescription(ev.description);
      await interaction.editReply({ embeds:[embed] });
    }
  },
};