// events/messageCreate.js
module.exports = {
  name: 'messageCreate',
  execute(message, client) {
    if (message.author.bot) return;
    const prefix = process.env.PREFIX || '.';
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();
    const cmd = client.prefixCommands.get(cmdName);
    if (!cmd) return;
    try {
      cmd.execute(message, args, client);
    } catch (e) {
      console.error(e);
      message.reply('❌ Error al ejecutar comando.');
    }
  },
};
