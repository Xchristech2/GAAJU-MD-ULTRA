'use strict';

const { getBotName } = require("../../lib/botname");
const { detectIntent, runIntent } = require("../../lib/ai-intent");

async function pollinationsAI(prompt, model = "openai", timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      "https://text.pollinations.ai/" +
        encodeURIComponent(prompt) +
        "?model=" + encodeURIComponent(model),
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "Gaaju/1.0",
          Accept: "text/plain,*/*"
        }
      }
    );

    if (!response.ok) {
      throw new Error("AI service returned HTTP " + response.status);
    }

    const answer = await response.text();

    if (!answer.trim()) {
      throw new Error("No response from AI");
    }

    return answer.trim();
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  name: "ai",
  aliases: ["gaaju", "gaajuAi", "gaajuai", "ask"],
  description: "Chat with Gaaju AI",
  category: "ai",

  async execute(sock, msg, args, prefix, extra) {
    const chatId = msg.key.remoteJid;
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return sock.sendMessage(
        chatId,
        {
          text:
            `🤖 *GAAJU AI*\n\n` +
            `Usage: ${prefix}ai <your question>\n\n` +
            `Examples:\n` +
            `${prefix}ai who is Elon Musk\n` +
            `${prefix}ai calculate 25 * 4\n` +
            `${prefix}ai translate hello to French\n` +
            `${prefix}ai write an Afrobeats song`
        },
        { quoted: msg }
      );
    }

    try {
      const intent = detectIntent(prompt);

      if (intent && intent.args?.length) {
        try {
          await sock.sendMessage(chatId, {
            react: { text: "🔮", key: msg.key }
          });
        } catch {}

        const handled = await runIntent(
          sock,
          msg,
          intent,
          prefix,
          extra
        );

        if (handled) return;
      }
    } catch {}

    try {
      try {
        await sock.sendMessage(chatId, {
          react: { text: "🤖", key: msg.key }
        });
      } catch {}

      const answer = await pollinationsAI(prompt);

      await sock.sendMessage(
        chatId,
        { text: `🤖 *GAAJU AI*\n\n${answer}` },
        { quoted: msg }
      );
    } catch (error) {
      await sock.sendMessage(
        chatId,
        {
          text: `🤖 *GAAJU AI*\n\nI couldn't get a response right now.\nReason: ${error.message}`
        },
        { quoted: msg }
      );
    }
  }
};
