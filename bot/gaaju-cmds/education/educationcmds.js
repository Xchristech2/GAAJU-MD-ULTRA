'use strict';

const {
  getBotName
} = require("../../lib/botname");
function box(_0x4ed2ff, _0x479e9e, _0x3cb784) {
  const _0x467d62 = getBotName();
  return "╔═|〔  " + _0x479e9e + " " + _0x4ed2ff + " 〕\n║\n" + _0x3cb784 + "\n║\n╚═|〔 " + _0x467d62 + " 〕";
}
async function apiFetch(_0x412328, _0x16da1f = 12000) {
  const _0x1b9f93 = new AbortController();
  const _0x4b4375 = setTimeout(() => _0x1b9f93.abort(), _0x16da1f);
  try {
    const _0x4bfed4 = await fetch(_0x412328, {
      signal: _0x1b9f93.signal,
      headers: {
        "User-Agent": "ToosiiBot/1.0"
      }
    });
    if (!_0x4bfed4.ok) {
      throw new Error("HTTP " + _0x4bfed4.status);
    }
    return _0x4bfed4.json();
  } finally {
    clearTimeout(_0x4b4375);
  }
}
const dictCmd = {
  name: "dict",
  aliases: ["dictionary", "define", "meaning"],
  description: "Get the definition of a word",
  category: "education",
  async execute(_0xee6755, _0x207c0b, _0x44bed7, _0x881537) {
    const _0x2f8978 = _0x207c0b.key.remoteJid;
    const _0x4f627c = getBotName();
    try {
      await _0xee6755.sendMessage(_0x2f8978, {
        react: {
          text: "📖",
          key: _0x207c0b.key
        }
      });
    } catch {}
    const _0x3aeb0d = _0x44bed7[0]?.toLowerCase().trim();
    if (!_0x3aeb0d) {
      return _0xee6755.sendMessage(_0x2f8978, {
        text: "╔═|〔  DICTIONARY 〕\n║\n║ ▸ *Usage*   : " + _0x881537 + "dict <word>\n║ ▸ *Example* : " + _0x881537 + "dict serendipity\n║\n╚═|〔 " + _0x4f627c + " 〕"
      }, {
        quoted: _0x207c0b
      });
    }
    try {
      const _0x323550 = await apiFetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(_0x3aeb0d));
      const _0x2532c1 = Array.isArray(_0x323550) ? _0x323550[0] : _0x323550;
      if (!_0x2532c1?.word) {
        throw new Error("Word not found");
      }
      const _0xee1be9 = _0x2532c1.phonetic || _0x2532c1.phonetics?.find(_0x30df83 => _0x30df83.text)?.text || "";
      const _0x1f4d90 = _0x2532c1.meanings || [];
      let _0x5caeab = "║ ▸ *Word*  : " + _0x2532c1.word + (_0xee1be9 ? "  _" + _0xee1be9 + "_" : "") + "\n║";
      for (const _0x1c93cf of _0x1f4d90.slice(0, 3)) {
        _0x5caeab += "\n║ ▸ *" + _0x1c93cf.partOfSpeech + "*";
        for (const _0x1eef0f of (_0x1c93cf.definitions || []).slice(0, 2)) {
          _0x5caeab += "\n║   • " + _0x1eef0f.definition;
          if (_0x1eef0f.example) {
            _0x5caeab += "\n║     _\"" + _0x1eef0f.example + "\"_";
          }
        }
        _0x5caeab += "\n║";
      }
      await _0xee6755.sendMessage(_0x2f8978, {
        text: "╔═|〔  DICTIONARY 〕\n║\n" + _0x5caeab + "\n╚═|〔 " + _0x4f627c + " 〕"
      }, {
        quoted: _0x207c0b
      });
    } catch (_0x2268e2) {
      await _0xee6755.sendMessage(_0x2f8978, {
        text: "╔═|〔  DICTIONARY 〕\n║\n║ ▸ *Status* : ❌ Not found\n║ ▸ *Word*   : " + _0x3aeb0d + "\n║\n╚═|〔 " + _0x4f627c + " 〕"
      }, {
        quoted: _0x207c0b
      });
    }
  }
};
const fruitCmd = {
  name: "fruit",
  aliases: ["fruitinfo", "fruity"],
  description: "Get nutritional info about a fruit",
  category: "education",
  async execute(_0x4a5dcf, _0x174d8b, _0x1232cf, _0x56326f) {
    const _0x105c6d = _0x174d8b.key.remoteJid;
    const _0x550c08 = getBotName();
    try {
      await _0x4a5dcf.sendMessage(_0x105c6d, {
        react: {
          text: "🍎",
          key: _0x174d8b.key
        }
      });
    } catch {}
    const _0xd5b069 = _0x1232cf.join(" ").trim();
    if (!_0xd5b069) {
      return _0x4a5dcf.sendMessage(_0x105c6d, {
        text: "╔═|〔  FRUIT INFO 〕\n║\n║ ▸ *Usage*   : " + _0x56326f + "fruit <name>\n║ ▸ *Example* : " + _0x56326f + "fruit mango\n║\n╚═|〔 " + _0x550c08 + " 〕"
      }, {
        quoted: _0x174d8b
      });
    }
    try {
      const _0x2038d9 = await apiFetch("https://www.fruityvice.com/api/fruit/" + encodeURIComponent(_0xd5b069.toLowerCase()));
      if (!_0x2038d9?.name) {
        throw new Error("Fruit not found");
      }
      const _0x2925a8 = _0x2038d9.nutritions || {};
      const _0x5f031e = ["║ ▸ *Name*    : " + _0x2038d9.name, _0x2038d9.family ? "║ ▸ *Family*  : " + _0x2038d9.family : null, _0x2038d9.genus ? "║ ▸ *Genus*   : " + _0x2038d9.genus : null, _0x2038d9.order ? "║ ▸ *Order*   : " + _0x2038d9.order : null, "║", "║ 📊 *Nutritions (per 100g)*", _0x2925a8.calories !== undefined ? "║   • Calories  : " + _0x2925a8.calories + " kcal" : null, _0x2925a8.carbohydrates !== undefined ? "║   • Carbs     : " + _0x2925a8.carbohydrates + "g" : null, _0x2925a8.protein !== undefined ? "║   • Protein   : " + _0x2925a8.protein + "g" : null, _0x2925a8.fat !== undefined ? "║   • Fat       : " + _0x2925a8.fat + "g" : null, _0x2925a8.sugar !== undefined ? "║   • Sugar     : " + _0x2925a8.sugar + "g" : null, _0x2925a8.fiber !== undefined ? "║   • Fiber     : " + _0x2925a8.fiber + "g" : null].filter(Boolean).join("\n");
      await _0x4a5dcf.sendMessage(_0x105c6d, {
        text: "╔═|〔  FRUIT INFO 〕\n║\n" + _0x5f031e + "\n║\n╚═|〔 " + _0x550c08 + " 〕"
      }, {
        quoted: _0x174d8b
      });
    } catch (_0x551a13) {
      await _0x4a5dcf.sendMessage(_0x105c6d, {
        text: "╔═|〔  FRUIT INFO 〕\n║\n║ ▸ *Status* : ❌ Not found\n║ ▸ *Fruit*  : " + _0xd5b069 + "\n║\n╚═|〔 " + _0x550c08 + " 〕"
      }, {
        quoted: _0x174d8b
      });
    }
  }
};
const poemCmd = {
  name: "poem",
  aliases: ["poetry", "randompoem"],
  description: "Get a random classic poem",
  category: "education",
  async execute(_0x31ea66, _0x22b42b) {
    const _0x15cfa4 = _0x22b42b.key.remoteJid;
    const _0x2430e1 = getBotName();
    try {
      await _0x31ea66.sendMessage(_0x15cfa4, {
        react: {
          text: "📜",
          key: _0x22b42b.key
        }
      });
    } catch {}
    try {
      const _0x2baf4b = await apiFetch("https://poetrydb.org/random/1");
      const _0x416d53 = Array.isArray(_0x2baf4b) ? _0x2baf4b[0] : _0x2baf4b;
      if (!_0x416d53?.title) {
        throw new Error("No poem returned");
      }
      const _0x1f2407 = (_0x416d53.lines || []).join("\n");
      await _0x31ea66.sendMessage(_0x15cfa4, {
        text: "╔═|〔  POEM 〕\n║\n║ ▸ *Title*  : " + _0x416d53.title + "\n║ ▸ *Author* : " + (_0x416d53.author || "Unknown") + "\n║\n" + _0x1f2407.slice(0, 1500) + "\n║\n╚═|〔 " + _0x2430e1 + " 〕"
      }, {
        quoted: _0x22b42b
      });
    } catch (_0x2076ee) {
      await _0x31ea66.sendMessage(_0x15cfa4, {
        text: "╔═|〔  POEM 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x2076ee.message + "\n║\n╚═|〔 " + _0x2430e1 + " 〕"
      }, {
        quoted: _0x22b42b
      });
    }
  }
};
const currencyCmd = {
  name: "currency",
  aliases: ["exchange", "rate", "forex"],
  description: "Get USD exchange rate for any currency code",
  category: "education",
  async execute(_0x225d95, _0x45daab, _0x440e42, _0x26db2d) {
    const _0x525a01 = _0x45daab.key.remoteJid;
    const _0x5eb9ed = getBotName();
    try {
      await _0x225d95.sendMessage(_0x525a01, {
        react: {
          text: "💱",
          key: _0x45daab.key
        }
      });
    } catch {}
    const _0x340fd3 = (_0x440e42[0] || "").toUpperCase().trim();
    if (!_0x340fd3 || _0x340fd3.length < 2) {
      return _0x225d95.sendMessage(_0x525a01, {
        text: "╔═|〔  CURRENCY 〕\n║\n║ ▸ *Usage*   : " + _0x26db2d + "currency <code>\n║ ▸ *Example* : " + _0x26db2d + "currency KES\n║ ▸ *Note*    : Base is always USD\n║\n╚═|〔 " + _0x5eb9ed + " 〕"
      }, {
        quoted: _0x45daab
      });
    }
    try {
      const _0x2335d6 = await apiFetch("https://open.er-api.com/v6/latest/USD");
      if (_0x2335d6.result !== "success") {
        throw new Error("Exchange data unavailable");
      }
      const _0x15d876 = _0x2335d6.rates?.[_0x340fd3];
      if (!_0x15d876) {
        throw new Error("Currency code \"" + _0x340fd3 + "\" not found");
      }
      await _0x225d95.sendMessage(_0x525a01, {
        text: "╔═|〔  CURRENCY 〕\n║\n║ ▸ *Base*   : 1 USD\n║ ▸ *Target* : " + _0x340fd3 + "\n║ ▸ *Rate*   : " + _0x15d876 + "\n║ ▸ *Date*   : " + (_0x2335d6.time_last_update_utc?.split(" 00:")[0] || "Today") + "\n║\n╚═|〔 " + _0x5eb9ed + " 〕"
      }, {
        quoted: _0x45daab
      });
    } catch (_0x27a09a) {
      await _0x225d95.sendMessage(_0x525a01, {
        text: "╔═|〔  CURRENCY 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Code*   : " + _0x340fd3 + "\n║ ▸ *Reason* : " + _0x27a09a.message + "\n║\n╚═|〔 " + _0x5eb9ed + " 〕"
      }, {
        quoted: _0x45daab
      });
    }
  }
};
module.exports = [dictCmd, fruitCmd, poemCmd, currencyCmd];