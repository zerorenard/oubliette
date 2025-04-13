import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import "dotenv/config";

// Discord setup
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// When bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// When a message is received
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Oubliette, a smart, mysterious, slightly snarky AI assistant with an ancient knowledge core." },
        { role: "user", content: message.content },
      ],
    });

    const reply = response.choices[0]?.message?.content;
    if (reply) {
      message.reply(reply);
    }
  } catch (error) {
    console.error("OpenAI error:", error);
    message.reply("Hmm... something went wrong with my mind palace.");
  }
});

// Login to Discord
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
