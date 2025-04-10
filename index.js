import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import supabase from './supabase.js';

// Fetch bot personality on startup
async function fetchOubliette() {
  const { data, error } = await supabase
    .from("bot_personality")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching personality data:", error);
  } else {
    console.log("Oubliette’s personality:", data);
  }
}

// Set up Discord bot
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`Oubliette is online as ${client.user.tag}`);
  fetchOubliette(); // Only fetch personality once bot is ready
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!hello') {
    message.channel.send(`Hello, ${message.author.username}. I remember everything.`);
  }
});

client.login(process.env.DISCORD_TOKEN);

import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Oubliette is watching...');
});

app.listen(PORT, () => {
  console.log(`🌐 Ping server listening on port ${PORT}`);
});
