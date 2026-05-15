'use strict';

const {
  getBotName
} = require("../../lib/botname");
const CATEGORIES = {
  general: 9,
  books: 10,
  film: 11,
  music: 12,
  tv: 14,
  games: 15,
  nature: 17,
  science: 17,
  computers: 18,
  math: 19,
  sports: 21,
  geography: 22,
  history: 23,
  politics: 24,
  art: 25,
  animals: 27,
  vehicles: 28,
  comics: 29,
  anime: 31,
  cartoon: 32
};
const pending = new Map();
function decodeHtml(_0x1c772b) {
  return _0x1c772b.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#039;/g, "'").replace(/&ldquo;/g, "\"").replace(/&rdquo;/g, "\"");
}
function shuffle(_0x2e0cb) {
  for (let _0x38163d = _0x2e0cb.length - 1; _0x38163d > 0; _0x38163d--) {
    const _0x4e37e9 = Math.floor(Math.random() * (_0x38163d + 1));
    [_0x2e0cb[_0x38163d], _0x2e0cb[_0x4e37e9]] = [_0x2e0cb[_0x4e37e9], _0x2e0cb[_0x38163d]];
  }
  return _0x2e0cb;
}
async function fetchTrivia(_0x24bb72) {
  const _0x3fc83f = _0x24bb72 ? "https://opentdb.com/api.php?amount=1&type=multiple&category=" + _0x24bb72 : "https://opentdb.com/api.php?amount=1&type=multiple";
  const _0x1d7a23 = await fetch(_0x3fc83f, {
    signal: AbortSignal.timeout(12000)
  });
  if (!_0x1d7a23.ok) {
    throw new Error("Trivia API HTTP " + _0x1d7a23.status);
  }
  const _0x2fd5fc = await _0x1d7a23.json();
  if (!_0x2fd5fc.results?.length) {
    throw new Error("No trivia returned");
  }
  return _0x2fd5fc.results[0];
}
module.exports = [{
  name: "trivia",
  aliases: ["quiz", "triviastart", "startquiz"],
  description: "Start a trivia question — .trivia [category]",
  category: "games",
  async execute(_0x3847ea, _0x5d1fe9, _0x1e6de4, _0x4e2f0d) {
    const _0xf68f94 = _0x5d1fe9.key.remoteJid;
    const _0x3af82e = getBotName();
    try {
      await _0x3847ea.sendMessage(_0xf68f94, {
        react: {
          text: "🧠",
          key: _0x5d1fe9.key
        }
      });
    } catch {}
    if (pending.has(_0xf68f94)) {
      const _0x35fafc = pending.get(_0xf68f94);
      return _0x3847ea.sendMessage(_0xf68f94, {
        text: "╔═|〔  TRIVIA 〕\n║\n║ ▸ A question is already active!\n║ ▸ Answer it or type *" + _0x4e2f0d + "triviaend* to skip\n║\n╚═|〔 " + _0x3af82e + " 〕"
      }, {
        quoted: _0x5d1fe9
      });
    }
    const _0x374884 = _0x1e6de4.join(" ").toLowerCase().trim();
    const _0x2c5ba4 = CATEGORIES[_0x374884] || null;
    try {
      const _0x2aac52 = await fetchTrivia(_0x2c5ba4);
      const _0x4de39c = decodeHtml(_0x2aac52.correct_answer);
      const _0x3c2160 = _0x2aac52.incorrect_answers.map(decodeHtml);
      const _0x5f8c4 = shuffle([_0x4de39c, ..._0x3c2160]);
      const _0x27820e = ["A", "B", "C", "D"];
      const _0x466547 = _0x27820e[_0x5f8c4.indexOf(_0x4de39c)];
      const _0xdc9cb8 = _0x5f8c4.map((_0x43d33c, _0x49ebeb) => "║  " + _0x27820e[_0x49ebeb] + ") " + _0x43d33c).join("\n");
      const _0x119dfc = decodeHtml(_0x2aac52.category);
      const _0x4f35ff = _0x2aac52.difficulty[0].toUpperCase() + _0x2aac52.difficulty.slice(1);
      const _0x3497d7 = ["╔═|〔  TRIVIA 🧠 〕", "║", "║ ▸ *Category*   : " + _0x119dfc, "║ ▸ *Difficulty* : " + _0x4f35ff, "║", "║ ❓ *" + decodeHtml(_0x2aac52.question) + "*", "║", _0xdc9cb8, "║", "║ ▸ Type *A / B / C / D* to answer", "║ ▸ *" + _0x4e2f0d + "triviaend* to skip", "║", "╚═|〔 " + _0x3af82e + " 〕"].join("\n");
      const _0x52bcd9 = setTimeout(async () => {
        pending.delete(_0xf68f94);
        await _0x3847ea.sendMessage(_0xf68f94, {
          text: "╔═|〔  TRIVIA 〕\n║\n║ ▸ ⏰ Time's up! Answer was: *" + _0x466547 + ") " + _0x4de39c + "*\n║\n╚═|〔 " + _0x3af82e + " 〕"
        });
      }, 60000);
      pending.set(_0xf68f94, {
        answer: _0x466547,
        correct: _0x4de39c,
        timer: _0x52bcd9,
        name: _0x3af82e
      });
      await _0x3847ea.sendMessage(_0xf68f94, {
        text: _0x3497d7
      }, {
        quoted: _0x5d1fe9
      });
    } catch (_0x61cd34) {
      await _0x3847ea.sendMessage(_0xf68f94, {
        text: "╔═|〔  TRIVIA 〕\n║\n║ ▸ *Status* : ❌ " + _0x61cd34.message + "\n║\n╚═|〔 " + _0x3af82e + " 〕"
      }, {
        quoted: _0x5d1fe9
      });
    }
  }
}, {
  name: "triviaanswer",
  aliases: ["ta", "answer"],
  description: "Answer the active trivia question — .ta A",
  category: "games",
  async execute(_0x487caf, _0x5cb450, _0x385e02, _0x18ff28) {
    const _0x3a6179 = _0x5cb450.key.remoteJid;
    const _0x129f4f = getBotName();
    const _0x348b04 = pending.get(_0x3a6179);
    if (!_0x348b04) {
      return;
    }
    const _0x5a663d = (_0x385e02[0] || "").toUpperCase().trim();
    if (!["A", "B", "C", "D"].includes(_0x5a663d)) {
      return;
    }
    clearTimeout(_0x348b04.timer);
    pending.delete(_0x3a6179);
    const _0x3cc7a2 = (_0x5cb450.key.participant || _0x5cb450.key.remoteJid).split("@")[0].split(":")[0];
    const _0x2c5764 = _0x5a663d === _0x348b04.answer;
    await _0x487caf.sendMessage(_0x3a6179, {
      text: ["╔═|〔  TRIVIA 🧠 〕", "║", "║ ▸ *@" + _0x3cc7a2 + "* answered: " + _0x5a663d, "║ ▸ *Result* : " + (_0x2c5764 ? "✅ Correct! 🎉" : "❌ Wrong! It was *" + _0x348b04.answer + ") " + _0x348b04.correct + "*"), "║", "║ ▸ Start another with *" + _0x18ff28 + "trivia*", "║", "╚═|〔 " + _0x129f4f + " 〕"].join("\n"),
      mentions: [_0x3cc7a2 + "@s.whatsapp.net"]
    }, {
      quoted: _0x5cb450
    });
  }
}, {
  name: "triviaend",
  aliases: ["skipquiz", "endtrivia", "stoptrivia"],
  description: "Skip the current trivia question",
  category: "games",
  async execute(_0x560fe4, _0x4eb627, _0x13ff1e, _0x137bf2) {
    const _0x4f148a = _0x4eb627.key.remoteJid;
    const _0x18b244 = getBotName();
    const _0x4f2882 = pending.get(_0x4f148a);
    if (!_0x4f2882) {
      return _0x560fe4.sendMessage(_0x4f148a, {
        text: "╔═|〔  TRIVIA 〕\n║\n║ ▸ No active question\n║\n╚═|〔 " + _0x18b244 + " 〕"
      }, {
        quoted: _0x4eb627
      });
    }
    clearTimeout(_0x4f2882.timer);
    pending.delete(_0x4f148a);
    await _0x560fe4.sendMessage(_0x4f148a, {
      text: "╔═|〔  TRIVIA 〕\n║\n║ ▸ ⏭️ Skipped! Answer was: *" + _0x4f2882.answer + ") " + _0x4f2882.correct + "*\n║\n╚═|〔 " + _0x18b244 + " 〕"
    }, {
      quoted: _0x4eb627
    });
  }
}];