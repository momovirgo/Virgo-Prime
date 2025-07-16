// commands/slash/actualizar.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const FormData = require('form-data');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('actualizar')
    .setDescription('Actualiza estadísticas desde una imagen de plantilla de Clubes Pro FC25.')
    .addAttachmentOption(opt => opt.setName('imagen').setDescription('Sube la captura de la plantilla').setRequired(true)),
  async execute(interaction, client) {
    if (interaction.user.id !== process.env.OWNER_ID) return interaction.reply({ content: '❌ No tienes permiso.', ephemeral: true });
    await interaction.deferReply();
    const file = interaction.options.getAttachment('imagen');
    const form = new FormData();
    form.append('apikey', process.env.OCR_SPACE_KEY);
    form.append('isTable', 'true');
    form.append('file', await (await axios.get(file.url, { responseType: 'arraybuffer' })).data, 'plantilla.jpg');
    let ocrText;
    try {
      const res = await axios.post('https://api.ocr.space/parse/image', form, { headers: form.getHeaders(), timeout: 60000 });
      ocrText = res.data.ParsedResults.map(r => r.ParsedText).join('\n');
    } catch {
      return interaction.editReply('❌ Error al procesar OCR.');
    }
    const lines = ocrText.split(/\r?\n/).filter(l => l.trim());
    const updated = [], issues = [];
    for (const line of lines) {
      const parts = line.split(/\s+/);
      const tag = parts[0];
      const { data: player } = await client.supabase.from('virgo_stats').select('nombre').eq('console_tag', tag).single();
      if (!player) { issues.push(`${line} (no encontrado)`); continue; }
      const stats = { partidos: parseInt(parts[1])||0, goles: parseInt(parts[2])||0, asistencias: parseInt(parts[3])||0 };
      const { error } = await client.supabase.from('virgo_stats').update(stats).eq('console_tag', tag);
      if (error) issues.push(`${line} (error ${error.message})`); else updated.push(player.nombre);
    }
    const uniques = [...new Set(updated)];
    await interaction.editReply(`✅ Jugadores actualizados:\n${uniques.join('\n')}`);
    try {
      const owner = await client.users.fetch(process.env.OWNER_ID);
      await owner.send(`Texto OCR crudo:\n${ocrText}\nProblemas:\n${issues.join('\n')}`);
    } catch {}
  },
};