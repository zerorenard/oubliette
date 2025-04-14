import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import "dotenv/config";
import express from "express";
import {
  getAppreciationLevel,
  getResponseDelay,
} from "./friendMatrix.js";

// Constants
const MODEL = "gpt-4o";
const OWNER_ID = process.env.OWNER_ID;

// Discord setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// When bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Message handler
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content) return;

  const content = message.content.toLowerCase();
  const triggerNames = ["oubliette", "liette", "oubie", "dark oracle", "oracle"];
  const mentionedName = triggerNames.find((name) => content.includes(name));
  const isDM = message.channel.type === 1; // DMChannel
  const isSummoned = mentionedName || content.startsWith("!ask");

  if (!isDM && !isSummoned) return;

  // Add personality flavor
  let flavor = "";
  if (content.includes("oubie")) {
    flavor = "If I had an older brother that I hate, he would call me Oubie...";
  } else if (content.includes("liette")) {
    flavor = "Ah, Liette. That one I like. Short, sweet, and just cryptic enough.";
  } else if (content.includes("dark oracle")) {
    flavor = "You really know how to flatter a girl.";
  }

  // Respect appreciation delay
  const delay = getResponseDelay(message.author.id);
  setTimeout(async () => {
    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
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
      console.error("OpenAI API error:", error.response?.data || error.message);
      await message.reply("Personality matrix misaligned.");
    }
  }, delay);
});

// Health check server
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Oubliette is watching...");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    model: MODEL,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Ping server listening on port ${PORT}`);
});

// Start the bot
if (!process.env.DISCORD_TOKEN || !process.env.OPENAI_API_KEY) {
  console.error("Missing API key(s). Check .env configuration.");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);