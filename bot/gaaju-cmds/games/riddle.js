'use strict';

const {
  getBotName
} = require("../../lib/botname");
const pending = new Map();
async function fetchRiddle() {
  const _0x506f34 = await fetch("https://riddles-api.vercel.app/random", {
    signal: AbortSignal.timeout(10000)
  });
  if (!_0x506f34.ok) {
    throw new Error("HTTP " + _0x506f34.status);
  }
  const _0x39b0ab = await _0x506f34.json();
  if (!_0x39b0ab.riddle || !_0x39b0ab.answer) {
    throw new Error("Invalid riddle returned");
  }
  return {
    question: _0x39b0ab.riddle,
    answer: _0x39b0ab.answer
  };
}
module.exports = [{
  name: "riddle",
  aliases: ["startriddle", "brainteaser", "puzzle"],
  description: "Get a random riddle to solve — .riddle",
  category: "games",
  async execute(_0x1fb85e, _0x1093ce, _0x335539, _0x54c084) {
    const _0x43f2c1 = _0x1093ce.key.remoteJid;
    const _0x4c4a09 = getBotName();
    try {
      await _0x1fb85e.sendMessage(_0x43f2c1, {
        react: {
          text: "🧩",
          key: _0x1093ce.key
        }
      });
    } catch {}
    if (pending.has(_0x43f2c1)) {
      return _0x1fb85e.sendMessage(_0x43f2c1, {
        text: "╔═|〔  RIDDLE 〕\n║\n║ ▸ A riddle is active! Guess or type\n║   *" + _0x54c084 + "riddleanswr* to reveal the answer\n║\n╚═|〔 " + _0x4c4a09 + " 〕"
      }, {
        quoted: _0x1093ce
      });
    }
    try {
      const {
        question: _0x2e18c5,
        answer: _0x6ca84b
      } = await fetchRiddle();
      const _0xaf0ec6 = setTimeout(async () => {
        pending.delete(_0x43f2c1);
        await _0x1fb85e.sendMessage(_0x43f2c1, {
          text: "╔═|〔  RIDDLE 🧩 〕\n║\n║ ▸ ⏰ Time's up!\n║ ▸ *Answer* : " + _0x6ca84b + "\n║\n╚═|〔 " + _0x4c4a09 + " 〕"
        });
      }, 90000);
      pending.set(_0x43f2c1, {
        answer: _0x6ca84b.toLowerCase().trim(),
        raw: _0x6ca84b,
        timer: _0xaf0ec6,
        name: _0x4c4a09
      });
      await _0x1fb85e.sendMessage(_0x43f2c1, {
        text: ["╔═|〔  RIDDLE 🧩 〕", "║", "║ 🤔 *" + _0x2e18c5 + "*", "║", "║ ▸ Type your answer in chat", "║ ▸ *" + _0x54c084 + "riddleanswr* to reveal", "║ ▸ 90 seconds on the clock ⏱️", "║", "╚═|〔 " + _0x4c4a09 + " 〕"].join("\n")
      }, {
        quoted: _0x1093ce
      });
    } catch (_0x1a623b) {
      await _0x1fb85e.sendMessage(_0x43f2c1, {
        text: "╔═|〔  RIDDLE 〕\n║\n║ ▸ *Status* : ❌ " + _0x1a623b.message + "\n║\n╚═|〔 " + _0x4c4a09 + " 〕"
      }, {
        quoted: _0x1093ce
      });
    }
  }
}, {
  name: "riddleanswr",
  aliases: ["riddleans", "revealriddle", "showriddle", "riddleskip"],
  description: "Reveal the answer to the active riddle",
  category: "games",
  async execute(_0x458e04, _0x51f27e, _0x181980, _0x3ca2d4) {
    const _0x40aec1 = _0x51f27e.key.remoteJid;
    const _0x29d1f7 = getBotName();
    const _0x5de85c = pending.get(_0x40aec1);
    if (!_0x5de85c) {
      return _0x458e04.sendMessage(_0x40aec1, {
        text: "╔═|〔  RIDDLE 〕\n║\n║ ▸ No active riddle. Start one with *" + _0x3ca2d4 + "riddle*\n║\n╚═|〔 " + _0x29d1f7 + " 〕"
      }, {
        quoted: _0x51f27e
      });
    }
    clearTimeout(_0x5de85c.timer);
    pending.delete(_0x40aec1);
    await _0x458e04.sendMessage(_0x40aec1, {
      text: "╔═|〔  RIDDLE 🧩 〕\n║\n║ ▸ *Answer* : " + _0x5de85c.raw + "\n║ ▸ Start another with *" + _0x3ca2d4 + "riddle*\n║\n╚═|〔 " + _0x29d1f7 + " 〕"
    }, {
      quoted: _0x51f27e
    });
  }
}, {
  name: "riddlecheck",
  description: "Internal handler — checks if a message is a correct riddle answer",
  category: "games",
  hidden: true,
  async execute(_0x4aaa94, _0x539cca, _0x71f14e, _0x430768) {
    const _0x3fe3ce = _0x539cca.key.remoteJid;
    const _0x4d29a9 = pending.get(_0x3fe3ce);
    if (!_0x4d29a9) {
      return;
    }
    const _0x1397f4 = (_0x71f14e.join(" ") || "").toLowerCase().trim();
    if (!_0x1397f4) {
      return;
    }
    if (_0x1397f4.includes(_0x4d29a9.answer) || _0x4d29a9.answer.includes(_0x1397f4)) {
      clearTimeout(_0x4d29a9.timer);
      pending.delete(_0x3fe3ce);
      const _0x440191 = (_0x539cca.key.participant || _0x539cca.key.remoteJid).split("@")[0].split(":")[0];
      await _0x4aaa94.sendMessage(_0x3fe3ce, {
        text: "╔═|〔  RIDDLE 🧩 〕\n║\n║ ▸ ✅ Correct! @" + _0x440191 + " got it!\n║ ▸ *Answer* : " + _0x4d29a9.raw + "\n║\n╚═|〔 " + (_0x4d29a9.name || "TOOSII-XD") + " 〕",
        mentions: [_0x440191 + "@s.whatsapp.net"]
      }, {
        quoted: _0x539cca
      });
    }
  }
}];