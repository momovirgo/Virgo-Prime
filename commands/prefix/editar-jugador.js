// commands/prefix/editar-jugador.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
  name:'editar-jugador', description:'Edita jugador',
  async execute(message,args,client) {
    const [tag,field,val] = args;
    const map = {nombre:'nombre',partidos:'partidos',goles:'goles',asistencias:'asistencias'};
    if(!tag||!field||!val||!map[field]) return message.reply('Uso: .editar-jugador <tag> <campo> <valor>');
    const { data: player }=await client.supabase.from('virgo_stats').select('*').eq('console_tag',tag).single();
    if(!player) return message.reply('No encontrado');
    const updates = {[map[field]]: field==='nombre'?val:parseInt(val)||0};
    const { error }=await client.supabase.from('virgo_stats').update(updates).eq('console_tag',tag);
    if(error) return message.reply(`Error: ${error.message}`);
    const embed=new EmbedBuilder().setTitle('Jugador actualizado')
      .addFields(
        {name:'Campo',value:field,inline:true},
        {name:'Antes',value:`${player[map[field]]}`,inline:true},
        {name:'Nuevo',value:`${updates[map[field]]}`,inline:true}
      );
    message.reply({ embeds: [embed] });
  }
};