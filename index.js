// index.js
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const { Configuration, OpenAIApi } = require('openai');

// ——— Cliente Discord ———
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// ——— Supabase ———
client.supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ——— OpenAI ———
// Importamos una sola vez Configuration y OpenAIApi
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
client.openai = new OpenAIApi(configuration);
client.model = process.env.OPENAI_MODEL || 'gpt-4o';

// ——— Colecciones de comandos y cooldowns ———
client.commands = new Collection();
client.prefixCommands = new Collection();
client.cooldowns = new Collection();

// ——— Cargar eventos ———
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath)) {
  if (!file.endsWith('.js')) continue;
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ——— Cargar comandos prefix ———
const prefixPath = path.join(__dirname, 'commands', 'prefix');
for (const file of fs.readdirSync(prefixPath)) {
  if (!file.endsWith('.js')) continue;
  const cmd = require(path.join(prefixPath, file));
  client.prefixCommands.set(cmd.name, cmd);
}

// ——— Cargar comandos slash ———
const slashPath = path.join(__dirname, 'commands', 'slash');
for (const file of fs.readdirSync(slashPath)) {
  if (!file.endsWith('.js')) continue;
  const cmd = require(path.join(slashPath, file));
  client.commands.set(cmd.data.name, cmd);
}

// ——— Keep‑alive webserver ———
const app = express();
app.get('/', (_, res) => res.send('Virgo Prime alive!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webserver UP on ${PORT}`));

// ——— Login ———
client.login(process.env.DISCORD_TOKEN);
