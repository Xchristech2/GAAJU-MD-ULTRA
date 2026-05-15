'use strict';

const {
  getBotName
} = require("../../lib/botname");
const {
  detectIntent,
  runIntent
} = require("../../lib/ai-intent");
async function pollinationsAI(_0x19f4ee, _0x2c728d = "openai", _0x342b70 = 30000) {
  const _0x566704 = encodeURIComponent(_0x19f4ee);
  const _0x4bb66d = new AbortController();
  const _0x4549a2 = setTimeout(() => _0x4bb66d.abort(), _0x342b70);
  try {
    const _0x2a62cc = await fetch("https://text.pollinations.ai/" + _0x566704 + "?model=" + _0x2c728d, {
      signal: _0x4bb66d.signal,
      headers: {
        "User-Agent": "Gaaju/1.0",
        Accept: "text/plain,*/*"
      }
    });
    if (!_0x2a62cc.ok) {
      throw new Error("AI service returned HTTP " + _0x2a62cc.status);
    }
    const _0x4bd4cc = await _0x2a62cc.text();
    if (!_0x4bd4cc?.trim()) {
      throw new Error("No response from AI");
    }
    return _0x4bd4cc.trim();
  } finally {
    clearTimeout(_0x4549a2);
  }
}
module.exports = {
  name: "ai",
  aliases: ["gaaju", "gaajuAi", "gaajuai", "ask"],
  description: "Chat with Gaaju AI — powered by live bot APIs",
  category: "ai",
  async execute(_0x24bf12, _0x4f93e8, _0x59c6d0, _0x56f0c6, _0x18e41c) {
    const _0x5e7e1a = _0x4f93e8.key.remoteJid;
    const _0x307240 = _0x59c6d0.join(" ").trim();
    if (!_0x307240) {
      return _0x24bf12.sendMessage(_0x5e7e1a, {
        text: ["╔═|〔  🤖 GAAJU AI 〕", "║", "║ ▸ *Usage*   : " + _0x56f0c6 + "ai <anything>", "║", "║ ▸ *Examples*:", "║   " + _0x56f0c6 + "ai play Rema Calm Down", "║   " + _0x56f0c6 + "ai weather in Nairobi", "║   " + _0x56f0c6 + "ai price of bitcoin", "║   " + _0x56f0c6 + "ai translate hello to french", "║   " + _0x56f0c6 + "ai recipe for jollof rice", "║   " + _0x56f0c6 + "ai who is Elon Musk", "║   " + _0x56f0c6 + "ai calculate 25 * 4", "║   " + _0x56f0c6 + "ai latest news", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x4f93e8
      });
    }
    try {
      const _0x343b07 = detectIntent(_0x307240);
      if (_0x343b07 && _0x343b07.args.length) {
        await _0x24bf12.sendMessage(_0x5e7e1a, {
          react: {
            text: "⚡",
            key: _0x4f93e8.key
          }
        });
        const _0x3c509f = await runIntent(_0x24bf12, _0x4f93e8, _0x343b07, _0x56f0c6, _0x18e41c);
        if (_0x3c509f) {
          return;
        }
      }
    } catch {}
    try {
      await _0x24bf12.sendMessage(_0x5e7e1a, {
        react: {
          text: "🤖",
          key: _0x4f93e8.key
        }
      });
      const _0x39823f = await pollinationsAI(_0x307240, "openai");
      const _0x47fab9 = _0x39823f.split("\n").map(_0x401b6e => "║ " + _0x401b6e).join("\n");
      await _0x24bf12.sendMessage(_0x5e7e1a, {
        text: "╔═|〔  🤖 GAAJU AI 〕\n║\n" + _0x47fab9 + "\n║\n╚═╝"
      }, {
        quoted: _0x4f93e8
      });
    } catch (_0x47b259) {
      await _0x24bf12.sendMessage(_0x5e7e1a, {
        text: "╔═|〔  🤖 GAAJU AI 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x47b259.message + "\n║\n╚═╝"
      }, {
        quoted: _0x4f93e8
      });
    }
  }
};