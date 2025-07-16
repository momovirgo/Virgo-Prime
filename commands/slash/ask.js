// commands/slash/ask.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
module.exports = {
  data: new SlashCommandBuilder().setName('ask').setDescription('Busca en la web usando Senpai API.').addStringOption(o=>o.setName('query').setDescription('Términos de búsqueda').setRequired(true)),
  async execute(interaction) {
    const q = interaction.options.getString('query');
    await interaction.deferReply();
    try {
      const res = await axios.get('https://api.senpai.example/search', { params:{q}, headers:{Authorization:`Bearer ${process.env.SENPAI_API_KEY}`}});
      const results = res.data.results.slice(0,5);
      if(!results.length) return interaction.editReply('No se encontraron resultados.');
      const embed = new EmbedBuilder().setTitle(`🔍 Resultados: "${q}"`).setTimestamp();
      results.forEach((r,i)=> embed.addFields({name:`${i+1}. ${r.title}`,value:`${r.snippet}
[Leer más](${r.link})`}));
      await interaction.editReply({embeds:[embed]});
    } catch {
      await interaction.editReply('❌ Error buscando en la web.');
    }
  },
};