'use strict';

const {
  getBotName
} = require("../../lib/botname");
const RESPONSES = ["✅ It is certain", "✅ It is decidedly so", "✅ Without a doubt", "✅ Yes, definitely", "✅ You may rely on it", "✅ As I see it, yes", "✅ Most likely", "✅ Outlook good", "✅ Yes", "✅ Signs point to yes", "🔮 Reply hazy, try again", "🔮 Ask again later", "🔮 Better not tell you now", "🔮 Cannot predict now", "🔮 Concentrate and ask again", "❌ Don't count on it", "❌ My reply is no", "❌ My sources say no", "❌ Outlook not so good", "❌ Very doubtful"];
const EXTRAS = ["💀 Are you sure you want to know?", "😂 Lol okay okay... let me check", "🔮 The spirits are consulting...", "🤔 Hmm, interesting question", "👀 I've seen things you wouldn't believe...", "🫡 One moment, consulting the oracle"];
module.exports = {
  name: "8ball",
  aliases: ["eightball", "magic8", "oracle", "askball", "ask8"],
  description: "Ask the magic 8-ball anything — .8ball <question>",
  category: "fun",
  async execute(_0x34efab, _0x4b8186, _0x29e1b9, _0x17dbcf) {
    const _0x1763a9 = _0x4b8186.key.remoteJid;
    const _0x49939b = getBotName();
    const _0xf39181 = _0x29e1b9.join(" ").trim();
    try {
      await _0x34efab.sendMessage(_0x1763a9, {
        react: {
          text: "🎱",
          key: _0x4b8186.key
        }
      });
    } catch {}
    if (!_0xf39181) {
      return _0x34efab.sendMessage(_0x1763a9, {
        text: "╔═|〔  MAGIC 8-BALL 🎱 〕\n║\n║ ▸ *Usage* : " + _0x17dbcf + "8ball <your question>\n║ ▸ *Example* : " + _0x17dbcf + "8ball Will I be rich?\n║\n╚═|〔 " + _0x49939b + " 〕"
      }, {
        quoted: _0x4b8186
      });
    }
    const _0x4dca78 = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    const _0x482881 = Math.random() < 0.3 ? "\n║ ▸ *Psst*   : " + EXTRAS[Math.floor(Math.random() * EXTRAS.length)] : "";
    await _0x34efab.sendMessage(_0x1763a9, {
      text: ["╔═|〔  MAGIC 8-BALL 🎱 〕", "║", "║ ▸ *Question* : " + _0xf39181, "║", "║ ▸ *Answer*   : " + _0x4dca78 + _0x482881, "║", "╚═|〔 " + _0x49939b + " 〕"].join("\n")
    }, {
      quoted: _0x4b8186
    });
  }
};