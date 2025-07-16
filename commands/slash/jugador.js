// commands/slash/jugador.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('jugador').setDescription('Muestra estadisticas de un jugador.').addStringOption(o=>o.setName('nombre').setDescription('Nombre o tag').setRequired(true)),
  async execute(interaction, client) {
    const q = interaction.options.getString('nombre');
    const { data: player } = await client.supabase.from('virgo_stats').select('*').or(`nombre.eq.${q},console_tag.eq.${q}`).single();
    if (!player) return interaction.reply({ content: 'Jugador no encontrado.', ephemeral: true });
    const totalGA = player.goles + player.asistencias;
    const embed = new EmbedBuilder().setTitle(`🔎 Jugador: ${player.nombre}`).addFields({name:'Tag consola',value:player.console_tag,inline:true},{name:'P',value:`${player.partidos}`,inline:true},{name:'G',value:`${player.goles}`,inline:true},{name:'A',value:`${player.asistencias}`,inline:true},{name:'G+A',value:`${totalGA}`,inline:true}).setTimestamp();
    interaction.reply({ embeds: [embed] });
  },
};