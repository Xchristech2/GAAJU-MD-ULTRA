'use strict';

const {
  getBotName
} = require("../../lib/botname");
async function wikiSearch(_0x2950d2) {
  const _0x540d1d = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + encodeURIComponent(_0x2950d2) + "&limit=5&format=json&origin=*";
  const _0x12fde1 = await fetch(_0x540d1d, {
    signal: AbortSignal.timeout(12000),
    headers: {
      "User-Agent": "Gaaju/1.0"
    }
  });
  if (!_0x12fde1.ok) {
    throw new Error("HTTP " + _0x12fde1.status);
  }
  const [, _0x517393] = await _0x12fde1.json();
  return _0x517393;
}
async function wikiSummary(_0xd14d5e) {
  const _0x1abd9b = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(_0xd14d5e);
  const _0x4e2c8c = await fetch(_0x1abd9b, {
    signal: AbortSignal.timeout(12000),
    headers: {
      "User-Agent": "Gaaju/1.0"
    }
  });
  if (!_0x4e2c8c.ok) {
    throw new Error(_0x4e2c8c.status === 404 ? "Page not found" : "HTTP " + _0x4e2c8c.status);
  }
  return _0x4e2c8c.json();
}
module.exports = [{
  name: "wiki",
  aliases: ["wikipedia", "wp", "define"],
  description: "Search Wikipedia for any topic — .wiki <topic>",
  category: "search",
  async execute(_0x109481, _0x4e42e3, _0x1917d9, _0x347563) {
    const _0x3552a6 = _0x4e42e3.key.remoteJid;
    const _0x4162e3 = getBotName();
    const _0x1d38d5 = _0x1917d9.join(" ").trim();
    try {
      await _0x109481.sendMessage(_0x3552a6, {
        react: {
          text: "📚",
          key: _0x4e42e3.key
        }
      });
    } catch {}
    if (!_0x1d38d5) {
      return _0x109481.sendMessage(_0x3552a6, {
        text: "╔═|〔  WIKIPEDIA 📚 〕\n║\n║ ▸ *Usage*   : " + _0x347563 + "wiki <topic>\n║ ▸ *Example* : " + _0x347563 + "wiki Nairobi\n║ ▸ *Example* : " + _0x347563 + "wiki artificial intelligence\n║\n╚═╝"
      }, {
        quoted: _0x4e42e3
      });
    }
    try {
      const _0x17a41e = await wikiSearch(_0x1d38d5);
      if (!_0x17a41e.length) {
        throw new Error("No results found");
      }
      const _0x1905cc = await wikiSummary(_0x17a41e[0]);
      if (!_0x1905cc.extract) {
        throw new Error("No summary available");
      }
      const _0x3c3237 = _0x1905cc.extract.length > 800 ? _0x1905cc.extract.slice(0, 800) + "…" : _0x1905cc.extract;
      const _0x93f976 = ["╔═|〔  WIKIPEDIA 📚 〕", "║", "║ ▸ *Topic* : " + _0x1905cc.title, _0x1905cc.description ? "║ ▸ *Type*  : " + _0x1905cc.description : null, "║", ..._0x3c3237.split("\n").filter(Boolean).map(_0x5482a4 => "║ " + _0x5482a4), "║", "║ 🔗 https://en.wikipedia.org/wiki/" + encodeURIComponent(_0x1905cc.title.replace(/ /g, "_")), "║", "╚═╝"].filter(Boolean).join("\n");
      await _0x109481.sendMessage(_0x3552a6, {
        text: _0x93f976
      }, {
        quoted: _0x4e42e3
      });
    } catch (_0xf7e9dc) {
      await _0x109481.sendMessage(_0x3552a6, {
        text: "╔═|〔  WIKIPEDIA 〕\n║\n║ ▸ *Status* : ❌ " + _0xf7e9dc.message + "\n║\n╚═╝"
      }, {
        quoted: _0x4e42e3
      });
    }
  }
}, {
  name: "wikisearch",
  aliases: ["wpsearch", "wikifind", "wikilist"],
  description: "List Wikipedia search results for a topic",
  category: "search",
  async execute(_0x269c16, _0x5a0e96, _0x247df8, _0x37969f) {
    const _0x5a35e6 = _0x5a0e96.key.remoteJid;
    const _0x44d42c = getBotName();
    const _0x370bd2 = _0x247df8.join(" ").trim();
    try {
      await _0x269c16.sendMessage(_0x5a35e6, {
        react: {
          text: "🔍",
          key: _0x5a0e96.key
        }
      });
    } catch {}
    if (!_0x370bd2) {
      return _0x269c16.sendMessage(_0x5a35e6, {
        text: "╔═|〔  WIKI SEARCH 〕\n║\n║ ▸ *Usage* : " + _0x37969f + "wikisearch <topic>\n║\n╚═╝"
      }, {
        quoted: _0x5a0e96
      });
    }
    try {
      const _0xf1ef87 = await wikiSearch(_0x370bd2);
      if (!_0xf1ef87.length) {
        throw new Error("No results found");
      }
      const _0x143355 = _0xf1ef87.map((_0x485e80, _0x3ae5c0) => "║ ▸ [" + (_0x3ae5c0 + 1) + "] " + _0x485e80).join("\n");
      await _0x269c16.sendMessage(_0x5a35e6, {
        text: "╔═|〔  WIKI SEARCH 🔍 〕\n║\n║ 🔍 *" + _0x370bd2 + "*\n║\n" + _0x143355 + "\n║\n║ 💡 " + _0x37969f + "wiki <title> for full summary\n║\n╚═╝"
      }, {
        quoted: _0x5a0e96
      });
    } catch (_0x11fa73) {
      await _0x269c16.sendMessage(_0x5a35e6, {
        text: "╔═|〔  WIKI SEARCH 〕\n║\n║ ▸ *Status* : ❌ " + _0x11fa73.message + "\n║\n╚═╝"
      }, {
        quoted: _0x5a0e96
      });
    }
  }
}];