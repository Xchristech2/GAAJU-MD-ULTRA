'use strict';

const {
  getBotName
} = require("../../lib/botname");
async function fetchQuote() {
  const _0x2f8b71 = await fetch("https://zenquotes.io/api/random", {
    signal: AbortSignal.timeout(10000)
  });
  const _0x26a283 = await _0x2f8b71.json();
  const _0x5f13b4 = Array.isArray(_0x26a283) ? _0x26a283[0] : _0x26a283;
  if (!_0x5f13b4 || !_0x5f13b4.q) {
    throw new Error("No quote returned");
  }
  return {
    text: _0x5f13b4.q,
    author: _0x5f13b4.a || "Unknown"
  };
}
async function fetchJoke() {
  const _0xda641d = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode&type=single", {
    signal: AbortSignal.timeout(10000)
  });
  const _0x527656 = await _0xda641d.json();
  if (_0x527656.type === "twopart") {
    return _0x527656.setup + "\n" + _0x527656.delivery;
  }
  return _0x527656.joke || "Could not get a joke 😅";
}
async function fetchFact() {
  const _0x252825 = await fetch("https://uselessfacts.jsph.pl/random.json?language=en", {
    signal: AbortSignal.timeout(10000)
  });
  const _0x120826 = await _0x252825.json();
  return _0x120826.text || "No fact returned";
}
const jokeCmd = {
  name: "joke",
  aliases: ["jokes", "funny", "lol"],
  description: "Get a random safe joke",
  category: "utility",
  async execute(_0x30677c, _0x510bb5, _0x4690ea, _0x7f71dc) {
    const _0x1ffdae = _0x510bb5.key.remoteJid;
    const _0x35ddb5 = getBotName();
    try {
      await _0x30677c.sendMessage(_0x1ffdae, {
        react: {
          text: "😂",
          key: _0x510bb5.key
        }
      });
    } catch {}
    try {
      const _0x264ef7 = await fetchJoke();
      await _0x30677c.sendMessage(_0x1ffdae, {
        text: "╔═|〔  JOKE 😂 〕\n║\n║ " + _0x264ef7.replace(/\n/g, "\n║ ") + "\n║\n╚═╝"
      }, {
        quoted: _0x510bb5
      });
    } catch (_0x2dd3d2) {
      await _0x30677c.sendMessage(_0x1ffdae, {
        text: "╔═|〔  JOKE 〕\n║\n║ ▸ *Status* : ❌ " + _0x2dd3d2.message + "\n║\n╚═╝"
      }, {
        quoted: _0x510bb5
      });
    }
  }
};
const factCmd = {
  name: "fact",
  aliases: ["funfact", "facts", "didyouknow"],
  description: "Get a random fun fact",
  category: "utility",
  async execute(_0x928b7c, _0x30e1f2, _0x2c02bd, _0x3926b1) {
    const _0x5db5bb = _0x30e1f2.key.remoteJid;
    const _0x4d13f1 = getBotName();
    try {
      await _0x928b7c.sendMessage(_0x5db5bb, {
        react: {
          text: "🧠",
          key: _0x30e1f2.key
        }
      });
    } catch {}
    try {
      const _0x3e703c = await fetchFact();
      await _0x928b7c.sendMessage(_0x5db5bb, {
        text: "╔═|〔  FUN FACT 🧠 〕\n║\n║ " + _0x3e703c + "\n║\n╚═╝"
      }, {
        quoted: _0x30e1f2
      });
    } catch (_0x5e4b2a) {
      await _0x928b7c.sendMessage(_0x5db5bb, {
        text: "╔═|〔  FUN FACT 〕\n║\n║ ▸ *Status* : ❌ " + _0x5e4b2a.message + "\n║\n╚═╝"
      }, {
        quoted: _0x30e1f2
      });
    }
  }
};
const quoteCmd = {
  name: "qfun",
  aliases: ["quotes", "quotabl", "funquote"],
  description: "Get a random inspirational quote",
  category: "utility",
  async execute(_0x46d05c, _0x3a4489, _0x1c1418, _0x2ed01d) {
    const _0x1bec2f = _0x3a4489.key.remoteJid;
    const _0x55196c = getBotName();
    try {
      await _0x46d05c.sendMessage(_0x1bec2f, {
        react: {
          text: "💬",
          key: _0x3a4489.key
        }
      });
    } catch {}
    try {
      const {
        text: _0x136dca,
        author: _0x450a67
      } = await fetchQuote();
      await _0x46d05c.sendMessage(_0x1bec2f, {
        text: "╔═|〔  QUOTE 💬 〕\n║\n║ _\"" + _0x136dca + "\"_\n║\n║ ▸ *—* " + _0x450a67 + "\n║\n╚═╝"
      }, {
        quoted: _0x3a4489
      });
    } catch (_0xbdc1b0) {
      await _0x46d05c.sendMessage(_0x1bec2f, {
        text: "╔═|〔  QUOTE 〕\n║\n║ ▸ *Status* : ❌ " + _0xbdc1b0.message + "\n║\n╚═╝"
      }, {
        quoted: _0x3a4489
      });
    }
  }
};
module.exports = [jokeCmd, factCmd, quoteCmd];