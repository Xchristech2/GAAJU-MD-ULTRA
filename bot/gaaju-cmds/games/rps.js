'use strict';

const {
  getBotName
} = require("../../lib/botname");
const CHOICES = ["rock", "paper", "scissors"];
const EMOJI = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️"
};
const BEATS = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper"
};
const TAUNTS_WIN = ["🎉 You crushed me!", "😤 Well played!", "👏 You got lucky!", "🏆 Impressive!"];
const TAUNTS_LOSE = ["😈 Too easy!", "🤖 Bots never lose!", "💀 Get rekted!", "😂 Try again!"];
const TAUNTS_DRAW = ["🤝 Great minds think alike!", "😅 We're evenly matched!", "🔁 Spooky!"];
function pick(_0x1458af) {
  return _0x1458af[Math.floor(Math.random() * _0x1458af.length)];
}
module.exports = {
  name: "rps",
  aliases: ["rockpaperscissors", "roshambo", "janken", "rpsls"],
  description: "Play rock, paper, scissors vs the bot — .rps <rock/paper/scissors>",
  category: "games",
  async execute(_0x3fc1aa, _0x1753d9, _0x11e6a1, _0x42f2b8) {
    const _0x32db62 = _0x1753d9.key.remoteJid;
    const _0x51a0ad = getBotName();
    const _0x5065db = (_0x1753d9.key.participant || _0x1753d9.key.remoteJid).split("@")[0].split(":")[0];
    const _0x4e433c = (_0x11e6a1[0] || "").toLowerCase().trim();
    const _0x3381a5 = CHOICES.find(_0xdf23f3 => _0xdf23f3.startsWith(_0x4e433c));
    if (!_0x3381a5) {
      return _0x3fc1aa.sendMessage(_0x32db62, {
        text: ["╔═|〔  ROCK PAPER SCISSORS ✂️ 〕", "║", "║ ▸ *Usage* : " + _0x42f2b8 + "rps <choice>", "║ ▸ 🪨 " + _0x42f2b8 + "rps rock", "║ ▸ 📄 " + _0x42f2b8 + "rps paper", "║ ▸ ✂️ " + _0x42f2b8 + "rps scissors", "║", "╚═|〔 " + _0x51a0ad + " 〕"].join("\n")
      }, {
        quoted: _0x1753d9
      });
    }
    const _0x4158b5 = pick(CHOICES);
    const _0x7d0c31 = EMOJI[_0x3381a5];
    const _0x1255ed = EMOJI[_0x4158b5];
    let _0x16f451;
    let _0xb15222;
    if (_0x3381a5 === _0x4158b5) {
      _0x16f451 = "🤝 *DRAW!*";
      _0xb15222 = pick(TAUNTS_DRAW);
    } else if (BEATS[_0x3381a5] === _0x4158b5) {
      _0x16f451 = "🏆 *YOU WIN!*";
      _0xb15222 = pick(TAUNTS_WIN);
    } else {
      _0x16f451 = "💀 *YOU LOSE!*";
      _0xb15222 = pick(TAUNTS_LOSE);
    }
    await _0x3fc1aa.sendMessage(_0x32db62, {
      text: ["╔═|〔  ROCK PAPER SCISSORS ✂️ 〕", "║", "║ ▸ @" + _0x5065db + "  : " + _0x7d0c31 + " *" + _0x3381a5.toUpperCase() + "*", "║ ▸ " + _0x51a0ad + "  : " + _0x1255ed + " *" + _0x4158b5.toUpperCase() + "*", "║", "║ ▸ " + _0x16f451, "║ ▸ " + _0xb15222, "║", "╚═|〔 " + _0x51a0ad + " 〕"].join("\n"),
      mentions: [_0x5065db + "@s.whatsapp.net"]
    }, {
      quoted: _0x1753d9
    });
  }
};