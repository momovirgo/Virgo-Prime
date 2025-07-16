require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const { Configuration, OpenAIApi } = require('openai');
const express = require('express');

// Inicializar cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// Conexión a Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Configuración de OpenAI
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

// Colecciones
client.commands = new Collection();
client.prefixCommands = new Collection();
client.cooldowns = new Collection();
client.supabase = supabase;
client.openai = openai;
client.model = OPENAI_MODEL;

// Cargar eventos
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
  const event = require(`./events/${file}`);
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
});

// Cargar comandos prefix
const prefixPath = path.join(__dirname, 'commands', 'prefix');
fs.readdirSync(prefixPath).forEach(file => {
  const cmd = require(`./commands/prefix/${file}`);
  client.prefixCommands.set(cmd.name, cmd);
});

// Cargar comandos slash
const slashPath = path.join(__dirname, 'commands', 'slash');
fs.readdirSync(slashPath).forEach(file => {
  const cmd = require(`./commands/slash/${file}`);
  client.commands.set(cmd.data.name, cmd);
});

// Express keep-alive
const app = express();
app.get('/', (_, res) => res.send('Virgo Prime alive!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webserver UP on ${PORT}`));

// Login
client.login(process.env.DISCORD_TOKEN);
