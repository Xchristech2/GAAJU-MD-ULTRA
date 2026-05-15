'use strict';

const {
  getBotName
} = require("../../lib/botname");
const BASE = "https://apiskeith.top";
async function kFetch(_0x5aadcb) {
  const _0x3798af = await fetch("" + BASE + _0x5aadcb, {
    signal: AbortSignal.timeout(15000)
  });
  if (!_0x3798af.ok) {
    throw new Error("HTTP " + _0x3798af.status);
  }
  return _0x3798af.json();
}
const bibleCmd = {
  name: "biblesearch",
  aliases: ["biblesrch", "bverse", "findbible"],
  description: "Search Bible verses by keyword",
  category: "spiritual",
  async execute(_0x3be6fa, _0x33ae64, _0x32e24e, _0x577285) {
    const _0x3816b8 = _0x33ae64.key.remoteJid;
    const _0x5a0ce6 = getBotName();
    try {
      await _0x3be6fa.sendMessage(_0x3816b8, {
        react: {
          text: "✝️",
          key: _0x33ae64.key
        }
      });
    } catch {}
    const _0x5907d5 = _0x32e24e.join(" ").trim();
    if (!_0x5907d5) {
      return _0x3be6fa.sendMessage(_0x3816b8, {
        text: "╔═|〔  BIBLE SEARCH 〕\n║\n║ ▸ *Usage*   : " + _0x577285 + "biblesearch <keyword>\n║ ▸ *Example* : " + _0x577285 + "biblesearch love\n║\n╚═|〔 " + _0x5a0ce6 + " 〕"
      }, {
        quoted: _0x33ae64
      });
    }
    try {
      const _0x49cabf = await kFetch("/bible/search?q=" + encodeURIComponent(_0x5907d5));
      const _0x124168 = _0x49cabf?.result;
      const _0x35c955 = _0x124168?.verses || _0x124168?.results || [];
      if (!_0x35c955.length) {
        throw new Error("No verses found");
      }
      let _0x13eff0 = "╔═|〔  BIBLE SEARCH 〕\n║\n║ ▸ *Query*   : " + _0x5907d5 + "\n║ ▸ *Found*   : " + (_0x124168?.totalResults || _0x35c955.length) + " results\n║ ▸ *Version* : " + (_0x124168?.version || "KJV") + "\n║";
      for (const _0x5dd2f1 of _0x35c955.slice(0, 4)) {
        const _0x47f714 = _0x5dd2f1.reference || _0x5dd2f1.verse || _0x5dd2f1.book_name || "";
        const _0x57644c = _0x5dd2f1.text || _0x5dd2f1.verse_text || _0x5dd2f1.content || "";
        if (_0x47f714 || _0x57644c) {
          _0x13eff0 += "\n║ 📖 *" + _0x47f714 + "*\n║   _" + String(_0x57644c).slice(0, 200) + "_\n║";
        }
      }
      _0x13eff0 += "\n╚═|〔 " + _0x5a0ce6 + " 〕";
      await _0x3be6fa.sendMessage(_0x3816b8, {
        text: _0x13eff0
      }, {
        quoted: _0x33ae64
      });
    } catch (_0x393074) {
      await _0x3be6fa.sendMessage(_0x3816b8, {
        text: "╔═|〔  BIBLE SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x393074.message + "\n║\n╚═|〔 " + _0x5a0ce6 + " 〕"
      }, {
        quoted: _0x33ae64
      });
    }
  }
};
const randBibleCmd = {
  name: "randverse",
  aliases: ["dailyverse", "bibleverse", "devotional"],
  description: "Get a random Bible verse",
  category: "spiritual",
  async execute(_0x30109c, _0x53345b, _0x2fab2d, _0x151127) {
    const _0x258b44 = _0x53345b.key.remoteJid;
    const _0x140f5d = getBotName();
    try {
      await _0x30109c.sendMessage(_0x258b44, {
        react: {
          text: "📖",
          key: _0x53345b.key
        }
      });
    } catch {}
    try {
      const _0xde5a9c = await kFetch("/random/bible");
      const _0x567314 = _0xde5a9c?.result;
      const _0x33120e = _0x567314?.verse;
      if (!_0x33120e) {
        throw new Error("No verse returned");
      }
      const _0xec9002 = [_0x33120e.book_name || _0x33120e.bookId, _0x33120e.chapter, _0x33120e.verse_start || _0x33120e.verse].filter(Boolean).join(" ");
      const _0x1c8d8e = _0x33120e.text || _0x33120e.content || "";
      const _0x7d1546 = _0x567314?.translation?.name || "Bible";
      await _0x30109c.sendMessage(_0x258b44, {
        text: "╔═|〔  DAILY VERSE 〕\n║\n║ ▸ *Ref*     : " + _0xec9002 + "\n║ ▸ *Version* : " + _0x7d1546 + "\n║\n_" + _0x1c8d8e.slice(0, 500) + "_\n║\n╚═|〔 " + _0x140f5d + " 〕"
      }, {
        quoted: _0x53345b
      });
    } catch (_0x8864ab) {
      await _0x30109c.sendMessage(_0x258b44, {
        text: "╔═|〔  DAILY VERSE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x8864ab.message + "\n║\n╚═|〔 " + _0x140f5d + " 〕"
      }, {
        quoted: _0x53345b
      });
    }
  }
};
const aiBibleCmd = {
  name: "aibibl",
  aliases: ["askbible", "biblai", "godai"],
  description: "Ask a question and get Bible-based AI answer",
  category: "spiritual",
  async execute(_0x4b0695, _0x440f71, _0x18efa3, _0xc37e34) {
    const _0x304636 = _0x440f71.key.remoteJid;
    const _0x48a9ee = getBotName();
    try {
      await _0x4b0695.sendMessage(_0x304636, {
        react: {
          text: "✝️",
          key: _0x440f71.key
        }
      });
    } catch {}
    const _0x4337f6 = _0x440f71.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const _0x416bec = _0x4337f6?.conversation || _0x4337f6?.extendedTextMessage?.text;
    const _0xefc4fb = _0x18efa3.join(" ").trim() || _0x416bec;
    if (!_0xefc4fb) {
      return _0x4b0695.sendMessage(_0x304636, {
        text: "╔═|〔  AI BIBLE 〕\n║\n║ ▸ *Usage*   : " + _0xc37e34 + "aibibl <question>\n║ ▸ *Example* : " + _0xc37e34 + "aibibl who is Jesus\n║\n╚═|〔 " + _0x48a9ee + " 〕"
      }, {
        quoted: _0x440f71
      });
    }
    try {
      const _0x305833 = await kFetch("/ai/bible?q=" + encodeURIComponent(_0xefc4fb));
      const _0x21f862 = _0x305833?.result;
      const _0xb74f1e = _0x21f862?.results || [];
      const _0x1e061f = _0x21f862?.translation || "ESV";
      let _0x4730c8 = "╔═|〔  AI BIBLE 〕\n║\n║ ▸ *Q*       : " + _0xefc4fb.slice(0, 100) + "\n║ ▸ *Version* : " + _0x1e061f + "\n║";
      for (const _0x1bd5b4 of _0xb74f1e.slice(0, 3)) {
        const _0x29a598 = _0x1bd5b4.reference || "";
        const _0x5923fc = _0x1bd5b4.text || _0x1bd5b4.content || "";
        if (_0x5923fc) {
          _0x4730c8 += "\n║ 📖 *" + _0x29a598 + "*\n║   _" + String(_0x5923fc).slice(0, 250) + "_\n║";
        }
      }
      if (!_0xb74f1e.length) {
        const _0x192372 = _0x21f862?.answer || _0x21f862?.text || String(_0x21f862 || "").slice(0, 1000);
        _0x4730c8 += "\n" + _0x192372 + "\n║";
      }
      _0x4730c8 += "\n╚═|〔 " + _0x48a9ee + " 〕";
      await _0x4b0695.sendMessage(_0x304636, {
        text: _0x4730c8
      }, {
        quoted: _0x440f71
      });
    } catch (_0x459467) {
      await _0x4b0695.sendMessage(_0x304636, {
        text: "╔═|〔  AI BIBLE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x459467.message + "\n║\n╚═|〔 " + _0x48a9ee + " 〕"
      }, {
        quoted: _0x440f71
      });
    }
  }
};
const surahListCmd = {
  name: "surahlist",
  aliases: ["slist", "quranlist", "surahs"],
  description: "List all 114 Quran surahs with numbers",
  category: "spiritual",
  async execute(_0x396073, _0x4e6ff0, _0x4f459f, _0x229671) {
    const _0x42a43d = _0x4e6ff0.key.remoteJid;
    const _0x344786 = getBotName();
    try {
      await _0x396073.sendMessage(_0x42a43d, {
        react: {
          text: "🕌",
          key: _0x4e6ff0.key
        }
      });
    } catch {}
    try {
      const _0x2fb062 = await kFetch("/surahlist");
      const _0x3d35f2 = _0x2fb062?.result?.data || [];
      if (!_0x3d35f2.length) {
        throw new Error("No data returned");
      }
      const _0x258ef4 = parseInt(_0x4f459f[0]) || 1;
      const _0x3c9387 = 20;
      const _0x3d197e = (_0x258ef4 - 1) * _0x3c9387;
      const _0x1ca9a2 = _0x3d35f2.slice(_0x3d197e, _0x3d197e + _0x3c9387);
      const _0x7f2f78 = Math.ceil(_0x3d35f2.length / _0x3c9387);
      let _0x478597 = "╔═|〔  QURAN SURAHS — Page " + _0x258ef4 + "/" + _0x7f2f78 + " 〕\n║";
      for (const _0xefe029 of _0x1ca9a2) {
        _0x478597 += "\n║ " + String(_0xefe029.number).padStart(3, " ") + ". " + (_0xefe029.name || _0xefe029.englishName) + " — " + (_0xefe029.englishNameTranslation || _0xefe029.meaning || "");
      }
      _0x478597 += "\n║\n║ ▸ Page " + _0x258ef4 + "/" + _0x7f2f78 + " — use " + _0x229671 + "surahlist " + (_0x258ef4 + 1 <= _0x7f2f78 ? _0x258ef4 + 1 : 1) + " for next\n╚═|〔 " + _0x344786 + " 〕";
      await _0x396073.sendMessage(_0x42a43d, {
        text: _0x478597
      }, {
        quoted: _0x4e6ff0
      });
    } catch (_0x6b98fc) {
      await _0x396073.sendMessage(_0x42a43d, {
        text: "╔═|〔  SURAH LIST 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x6b98fc.message + "\n║\n╚═|〔 " + _0x344786 + " 〕"
      }, {
        quoted: _0x4e6ff0
      });
    }
  }
};
const aiMuslimCmd = {
  name: "aimuslim",
  aliases: ["askquran", "islamai", "allahq"],
  description: "Ask an Islamic question and get an AI answer with Quran references",
  category: "spiritual",
  async execute(_0x3eff35, _0x1ceba1, _0x2f5c39, _0x30d7fa) {
    const _0x245b1a = _0x1ceba1.key.remoteJid;
    const _0x3e149c = getBotName();
    try {
      await _0x3eff35.sendMessage(_0x245b1a, {
        react: {
          text: "🕌",
          key: _0x1ceba1.key
        }
      });
    } catch {}
    const _0x4cf129 = _0x1ceba1.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const _0x30c114 = _0x4cf129?.conversation || _0x4cf129?.extendedTextMessage?.text;
    const _0x4b8552 = _0x2f5c39.join(" ").trim() || _0x30c114;
    if (!_0x4b8552) {
      return _0x3eff35.sendMessage(_0x245b1a, {
        text: "╔═|〔  AI MUSLIM 〕\n║\n║ ▸ *Usage*   : " + _0x30d7fa + "aimuslim <question>\n║ ▸ *Example* : " + _0x30d7fa + "aimuslim what is Ramadan\n║\n╚═|〔 " + _0x3e149c + " 〕"
      }, {
        quoted: _0x1ceba1
      });
    }
    try {
      const _0x1ff45 = await kFetch("/ai/muslim?q=" + encodeURIComponent(_0x4b8552));
      const _0xb5a98b = _0x1ff45?.result?.results || [];
      let _0x2c9680 = "╔═|〔  AI MUSLIM 〕\n║\n║ ▸ *Q* : " + _0x4b8552.slice(0, 100) + "\n║";
      for (const _0x15b686 of _0xb5a98b.slice(0, 3)) {
        const _0xd3f8a1 = _0x15b686.surah_name || _0x15b686.surah || "";
        const _0x23a116 = _0x15b686.ayah || _0x15b686.verse || _0x15b686.id || "";
        const _0x27ce7e = _0x15b686.text || _0x15b686.content || _0x15b686.translation || "";
        if (_0x27ce7e) {
          _0x2c9680 += "\n║ 📿 " + (_0xd3f8a1 ? "*" + _0xd3f8a1 : "") + (_0x23a116 ? " (" + _0x23a116 + ")*" : "*") + "\n║   _" + String(_0x27ce7e).slice(0, 250) + "_\n║";
        }
      }
      if (!_0xb5a98b.length) {
        const _0xa0a2e0 = _0x1ff45?.result?.answer || String(_0x1ff45?.result || "").slice(0, 1000);
        _0x2c9680 += "\n" + _0xa0a2e0 + "\n║";
      }
      _0x2c9680 += "\n╚═|〔 " + _0x3e149c + " 〕";
      await _0x3eff35.sendMessage(_0x245b1a, {
        text: _0x2c9680
      }, {
        quoted: _0x1ceba1
      });
    } catch (_0x2348a5) {
      await _0x3eff35.sendMessage(_0x245b1a, {
        text: "╔═|〔  AI MUSLIM 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x2348a5.message + "\n║\n╚═|〔 " + _0x3e149c + " 〕"
      }, {
        quoted: _0x1ceba1
      });
    }
  }
};
const hymnCmd = {
  name: "hymn",
  aliases: ["hymnal", "adventhymn", "sda"],
  description: "Look up an Adventist hymnal by number (1–695)",
  category: "spiritual",
  async execute(_0x52c105, _0x17f152, _0x4cefae, _0x45fead) {
    const _0x2a5cc1 = _0x17f152.key.remoteJid;
    const _0xb50a86 = getBotName();
    try {
      await _0x52c105.sendMessage(_0x2a5cc1, {
        react: {
          text: "🎼",
          key: _0x17f152.key
        }
      });
    } catch {}
    const _0xac5e0a = parseInt(_0x4cefae[0]);
    if (!_0xac5e0a || _0xac5e0a < 1 || _0xac5e0a > 695) {
      return _0x52c105.sendMessage(_0x2a5cc1, {
        text: "╔═|〔  ADVENTIST HYMNAL 〕\n║\n║ ▸ *Usage*   : " + _0x45fead + "hymn <number>\n║ ▸ *Example* : " + _0x45fead + "hymn 1\n║ ▸ *Range*   : 1 – 695\n║\n╚═|〔 " + _0xb50a86 + " 〕"
      }, {
        quoted: _0x17f152
      });
    }
    try {
      const _0x1dd469 = await kFetch("/adventist/hymnal?q=" + _0xac5e0a);
      const _0x2614b9 = _0x1dd469?.result;
      if (!_0x2614b9?.title) {
        throw new Error("Hymn not found");
      }
      const _0x18aace = (_0x2614b9.verses || []).slice(0, 4);
      let _0x3f15a0 = "╔═|〔  ADVENTIST HYMNAL 〕\n║\n║ ▸ *#" + _0x2614b9.number + "* — " + _0x2614b9.title + "\n║";
      for (const _0x3a57d8 of _0x18aace) {
        _0x3f15a0 += "\n║ ── *Verse " + _0x3a57d8.number + "*\n";
        for (const _0x14d1ed of _0x3a57d8.lines || []) {
          _0x3f15a0 += "║   " + _0x14d1ed + "\n";
        }
        _0x3f15a0 += "║";
      }
      if (_0x2614b9.chorus?.lines?.length) {
        _0x3f15a0 += "\n║ ── *Chorus*\n";
        for (const _0x2d3624 of _0x2614b9.chorus.lines) {
          _0x3f15a0 += "║   " + _0x2d3624 + "\n";
        }
        _0x3f15a0 += "║";
      }
      _0x3f15a0 += "\n╚═|〔 " + _0xb50a86 + " 〕";
      await _0x52c105.sendMessage(_0x2a5cc1, {
        text: _0x3f15a0
      }, {
        quoted: _0x17f152
      });
    } catch (_0x3c95ad) {
      await _0x52c105.sendMessage(_0x2a5cc1, {
        text: "╔═|〔  ADVENTIST HYMNAL 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x3c95ad.message + "\n║\n╚═|〔 " + _0xb50a86 + " 〕"
      }, {
        quoted: _0x17f152
      });
    }
  }
};
module.exports = [bibleCmd, randBibleCmd, aiBibleCmd, surahListCmd, aiMuslimCmd, hymnCmd];