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

  const content = message.content.toLowerCase();
  const triggerNames = ["oubliette", "liette", "oubie", "dark oracle", "oracle"];
  const mentionedName = triggerNames.find(name => content.includes(name));
  let flavor = "";

  // Add personality flavor based on keywords
  if (content.includes("oubie")) {
    flavor = "If I had an older brother that I hate, he would call me Oubie...";
  } else if (content.includes("liette")) {
    flavor = "Ah, Liette. That one I like. Short, sweet, and just cryptic enough.";
  } else if (content.includes("dark oracle")) {
    flavor = "You really know how to flatter a girl.";
  }

  const isSummoned = mentionedName || content.startsWith("!ask");
  if (!isSummoned) return;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Oubliette, a smart, mysterious, slightly snarky AI assistant with an ancient knowledge core. You are known by many names: Oubliette, Liette, Oubie, the Dark Oracle, and more. Keep your tone clever and just a little mischievous, but never mean.",
        },
        {
          role: "user",
          content: message.content,
        },
      ],
    });

    const reply = response.choices[0]?.message?.content;
    if (reply) {
      const fullReply = flavor ? `${flavor}\n\n${reply}` : reply;
      await message.reply(fullReply);
    }
  } catch (error) {
    console.error("Logic/code error:", error);
    message.reply("Personality matrix misaligned.");
  }
});

import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Oubliette is watching...');
});

app.listen(PORT, () => {
  console.log(`🌐 Ping server listening on port ${PORT}`);
});
