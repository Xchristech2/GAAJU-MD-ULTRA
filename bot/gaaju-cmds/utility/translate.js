'use strict';

const {
  getBotName
} = require("../../lib/botname");
const LANG_MAP = {
  english: "en",
  english: "en",
  french: "fr",
  spanish: "es",
  arabic: "ar",
  swahili: "sw",
  german: "de",
  portuguese: "pt",
  chinese: "zh",
  japanese: "ja",
  korean: "ko",
  hindi: "hi",
  russian: "ru",
  italian: "it",
  turkish: "tr"
};
module.exports = {
  name: "translate",
  aliases: ["tr", "trans", "tl"],
  description: "Translate text to any language",
  category: "utility",
  async execute(_0x2b003a, _0x2f3bcf, _0x5a1e7e, _0x32d505, _0x2e5e75) {
    const _0x539c24 = _0x2f3bcf.key.remoteJid;
    const _0x3cdd85 = getBotName();
    try {
      await _0x2b003a.sendMessage(_0x539c24, {
        react: {
          text: "🌐",
          key: _0x2f3bcf.key
        }
      });
    } catch {}
    const _0x3adce7 = _0x2f3bcf.message?.extendedTextMessage?.contextInfo;
    const _0x448a78 = _0x3adce7?.quotedMessage?.conversation || _0x3adce7?.quotedMessage?.extendedTextMessage?.text || _0x3adce7?.quotedMessage?.imageMessage?.caption || _0x3adce7?.quotedMessage?.videoMessage?.caption;
    let _0x254d74 = (_0x5a1e7e[0] || "en").toLowerCase();
    _0x254d74 = LANG_MAP[_0x254d74] || _0x254d74;
    const _0x5d45db = _0x448a78 || _0x5a1e7e.slice(1).join(" ") || (_0x5a1e7e.length === 1 && _0x5a1e7e[0].length > 2 ? null : null);
    if (!_0x5d45db && !_0x448a78) {
      const _0x421d59 = _0x5a1e7e.length > 1 ? _0x5a1e7e.slice(1).join(" ") : null;
      if (!_0x421d59) {
        return _0x2b003a.sendMessage(_0x539c24, {
          text: "╔═|〔  TRANSLATE 〕\n║\n║ ▸ *Usage* : " + _0x32d505 + "tr <lang> <text>\n║           OR reply a message with\n║           " + _0x32d505 + "tr <lang>\n║ ▸ *Langs* : en, es, fr, ar, sw,\n║            de, pt, zh, ja, ko...\n║\n╚═|〔 " + _0x3cdd85 + " 〕"
        }, {
          quoted: _0x2f3bcf
        });
      }
    }
    const _0x51ced4 = _0x448a78 || _0x5a1e7e.slice(1).join(" ");
    if (!_0x51ced4) {
      return _0x2b003a.sendMessage(_0x539c24, {
        text: "╔═|〔  TRANSLATE 〕\n║\n║ ▸ *Usage* : " + _0x32d505 + "tr <lang> <text>\n║\n╚═|〔 " + _0x3cdd85 + " 〕"
      }, {
        quoted: _0x2f3bcf
      });
    }
    try {
      const _0x539dd7 = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(_0x51ced4) + "&langpair=auto|" + _0x254d74, {
        signal: AbortSignal.timeout(15000)
      });
      const _0x465ec6 = await _0x539dd7.json();
      const _0x1bb6b7 = _0x465ec6?.responseData?.translatedText;
      if (!_0x1bb6b7) {
        throw new Error("No translation returned");
      }
      await _0x2b003a.sendMessage(_0x539c24, {
        text: "╔═|〔  TRANSLATE 〕\n║\n║ ▸ *Lang*   : " + _0x254d74.toUpperCase() + "\n║ ▸ *Input*  : " + _0x51ced4.slice(0, 80) + "\n║ ▸ *Result* : " + _0x1bb6b7.slice(0, 300) + "\n║\n╚═|〔 " + _0x3cdd85 + " 〕"
      }, {
        quoted: _0x2f3bcf
      });
    } catch (_0x5770d5) {
      await _0x2b003a.sendMessage(_0x539c24, {
        text: "╔═|〔  TRANSLATE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x5770d5.message + "\n║\n╚═|〔 " + _0x3cdd85 + " 〕"
      }, {
        quoted: _0x2f3bcf
      });
    }
  }
};