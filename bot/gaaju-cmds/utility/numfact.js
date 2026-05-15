'use strict';

const {
  getBotName
} = require("../../lib/botname");
const TYPES = {
  trivia: "trivia",
  math: "math",
  date: "date",
  year: "year",
  random: "random"
};
async function getNumberFact(_0x5c0d08, _0x202949 = "trivia") {
  const _0xed4e8c = _0x5c0d08 === "random" ? "random" : encodeURIComponent(_0x5c0d08);
  const _0x33e7a6 = "http://numbersapi.com/" + _0xed4e8c + "/" + _0x202949 + "?json=true";
  const _0x8ab01e = await fetch(_0x33e7a6, {
    signal: AbortSignal.timeout(10000)
  });
  if (!_0x8ab01e.ok) {
    throw new Error("HTTP " + _0x8ab01e.status);
  }
  const _0x3ef9d4 = await _0x8ab01e.json();
  if (!_0x3ef9d4.text) {
    throw new Error("No fact returned");
  }
  return _0x3ef9d4;
}
module.exports = {
  name: "numfact",
  aliases: ["numberfact", "numtrivia", "mathfact", "numberinfo", "nfact"],
  description: "Get an interesting fact about any number — .numfact <number> [type]",
  category: "utility",
  async execute(_0x1c29d4, _0x148d6b, _0x12a111, _0x58c5a1) {
    const _0x3ec8d2 = _0x148d6b.key.remoteJid;
    const _0x19cf8d = getBotName();
    try {
      await _0x1c29d4.sendMessage(_0x3ec8d2, {
        react: {
          text: "🔢",
          key: _0x148d6b.key
        }
      });
    } catch {}
    const _0x3e2252 = _0x12a111[0] || "random";
    const _0x650040 = TYPES[(_0x12a111[1] || "").toLowerCase()] || "trivia";
    const _0x5ed823 = _0x3e2252 === "random" || /^-?\d+(\.\d+)?$/.test(_0x3e2252);
    if (!_0x5ed823) {
      return _0x1c29d4.sendMessage(_0x3ec8d2, {
        text: ["╔═|〔  NUMBER FACT 🔢 〕", "║", "║ ▸ *Usage*   : " + _0x58c5a1 + "numfact <number> [type]", "║ ▸ *Types*   : trivia | math | year | date", "║ ▸ *Example* : " + _0x58c5a1 + "numfact 42", "║ ▸ *Example* : " + _0x58c5a1 + "numfact 1969 year", "║ ▸ *Example* : " + _0x58c5a1 + "numfact random math", "║", "╚═|〔 " + _0x19cf8d + " 〕"].join("\n")
      }, {
        quoted: _0x148d6b
      });
    }
    try {
      const _0xbefc4b = await getNumberFact(_0x3e2252, _0x650040);
      await _0x1c29d4.sendMessage(_0x3ec8d2, {
        text: ["╔═|〔  NUMBER FACT 🔢 〕", "║", "║ ▸ *Number* : " + _0xbefc4b.number, "║ ▸ *Type*   : " + (_0x650040[0].toUpperCase() + _0x650040.slice(1)), "║", "║ " + _0xbefc4b.text, "║", "╚═|〔 " + _0x19cf8d + " 〕"].join("\n")
      }, {
        quoted: _0x148d6b
      });
    } catch (_0x10bc86) {
      await _0x1c29d4.sendMessage(_0x3ec8d2, {
        text: "╔═|〔  NUMBER FACT 〕\n║\n║ ▸ *Status* : ❌ " + _0x10bc86.message + "\n║\n╚═|〔 " + _0x19cf8d + " 〕"
      }, {
        quoted: _0x148d6b
      });
    }
  }
};