'use strict';

const {
  getBotName
} = require("../../lib/botname");
const COMPLIMENTS = ["You have the kind of energy that makes every room brighter ☀️", "Your smile could charge a dead phone 😄🔋", "You're the reason someone smiles today 💫", "You give off main character energy and it shows 👑", "If kindness were money, you'd be a billionaire 💰", "The world is genuinely better with you in it 🌍", "Your vibe is immaculate and you know it 💅", "You're built different — in the best way possible 🔥", "You have a rare combination of intelligence and heart 🧠❤️", "People feel safe around you — that's a superpower 💪", "Not everyone can radiate warmth without trying — you do it effortlessly 🌟", "Your energy is contagious in the most positive way 🌈", "You're the type of person that makes memories just by being present 📸", "If you were a song, you'd be everyone's favourite 🎵", "You're the reason the word \"amazing\" was invented 🏆", "You're a whole vibe and a half 😍", "Even on your bad days you're still someone's favourite person 💖", "Your personality is a gift and I hope you never return it 🎁", "You're low-key one of the most underrated people around 💎", "Being around you feels like finding money in an old jacket 💸"];
function pick(_0x510e80) {
  return _0x510e80[Math.floor(Math.random() * _0x510e80.length)];
}
module.exports = {
  name: "compliment",
  aliases: ["hype", "biggup", "appreciate", "complimentme", "loveon"],
  description: "Get or give a genuine compliment — .compliment [@mention]",
  category: "fun",
  async execute(_0x5c7475, _0x3f5f39, _0xa4b1da, _0x170ce0) {
    const _0x17b425 = _0x3f5f39.key.remoteJid;
    const _0x5926ff = getBotName();
    const _0x41a56c = (_0x3f5f39.key.participant || _0x3f5f39.key.remoteJid).split("@")[0].split(":")[0];
    const _0x232d19 = _0x3f5f39.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const _0x23850a = _0x232d19 ? _0x232d19.split("@")[0].split(":")[0] : _0xa4b1da.join(" ").trim().replace(/^@/, "") || _0x41a56c;
    const _0x24a36f = pick(COMPLIMENTS);
    await _0x5c7475.sendMessage(_0x17b425, {
      text: ["╔═|〔  COMPLIMENT 💖 〕", "║", "║ To @" + _0x23850a + ":", "║", "║ ✨ " + _0x24a36f, "║", "╚═|〔 " + _0x5926ff + " 〕"].join("\n"),
      mentions: [_0x23850a + "@s.whatsapp.net"]
    }, {
      quoted: _0x3f5f39
    });
  }
};