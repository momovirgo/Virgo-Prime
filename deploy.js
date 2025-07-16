require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

// Carga comandos slash
const commands = [];
const slashPath = path.join(__dirname, 'commands', 'slash');
fs.readdirSync(slashPath).filter(f => f.endsWith('.js')).forEach(file => {
  const cmd = require(`./commands/slash/${file}`);
  commands.push(cmd.data.toJSON());
});

// REST client
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log('Registered guild commands');
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('Registered global commands');
    }
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();
