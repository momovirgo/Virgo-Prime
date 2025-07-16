// events/interactionCreate.js
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction, client);
    } catch (e) {
      console.error(e);
      // Notify user
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Error al cargar el comando, notificado al owner.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Error al cargar el comando, notificado al owner.', ephemeral: true });
      }
      // Analyze with AI and DM owner
      try {
        const ai = await client.openai.createChatCompletion({
          model: client.model,
          messages: [
            { role: 'system', content: 'Eres un asistente que depura errores de código y sugiere soluciones.' },
            { role: 'user', content: `Error en ${interaction.commandName}:\n${e.stack}` }
          ]
        });
        const suggestion = ai.data.choices[0].message.content;
        const owner = await client.users.fetch(process.env.OWNER_ID);
        await owner.send(
          `🔴 Error en \`${interaction.commandName}\`:\n` +
          `\`\`\`${e.stack}\`\`\`\n` +
          `💡 Sugerencia IA:\n${suggestion}`
        );
      } catch (dmErr) {
        console.error('No se pudo DM al owner:', dmErr);
      }
    }
  },
};
