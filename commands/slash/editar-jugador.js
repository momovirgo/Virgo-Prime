// commands/slash/editar-jugador.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('editar-jugador').setDescription('Edita datos de un jugador.').addStringOption(o=>o.setName('console_tag').setDescription('Tag').setRequired(true)).addStringOption(o=>o.setName('nombre').setDescription('Nuevo nombre')).addIntegerOption(o=>o.setName('partidos').setDescription('Nuevos partidos')).addIntegerOption(o=>o.setName('goles').setDescription('Nuevos goles')).addIntegerOption(o=>o.setName('asistencias').setDescription('Nuevas asistencias')),
  async execute(interaction, client) {
    const tag = interaction.options.getString('console_tag');
    const updates = {};
    ['nombre','partidos','goles','asistencias'].forEach(f=>{
      const v = interaction.options.get(f);
      if(v!==null) updates[f]=v;
    });
    if(!Object.keys(updates).length) return interaction.reply({ content:'❗ Debes indicar un campo', ephemeral:true });
    const { data: player } = await client.supabase.from('virgo_stats').select('*').eq('console_tag',tag).single();
    if(!player) return interaction.reply({ content:'Jugador no encontrado', ephemeral:true });
    const { error } = await client.supabase.from('virgo_stats').update(updates).eq('console_tag',tag);
    if(error) return interaction.reply({ content:`❌ Error: ${error.message}`, ephemeral:true });
    const embed = new EmbedBuilder().setTitle('Jugador actualizado').addFields({name:'Antes',value:`P:${player.partidos} G:${player.goles} A:${player.asistencias}`,inline:true},{name:'Ahora',value:`P:${updates.partidos||player.partidos} G:${updates.goles||player.goles} A:${updates.asistencias||player.asistencias}`,inline:true}).setTimestamp();
    await interaction.reply({ embeds:[embed] });
  },
};