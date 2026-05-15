'use strict';

const {
  getBotName
} = require("../../lib/botname");
const path = require("path");
const fs = require("fs");
let LOCAL = {};
try {
  LOCAL = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/quotes.json"), "utf-8"));
} catch {}
const ALL_CATS = Object.keys(LOCAL);
function pickLocal(_0x3851b0) {
  if (!_0x3851b0) {
    const _0x4b695e = ALL_CATS[Math.floor(Math.random() * ALL_CATS.length)];
    const _0x3800ed = LOCAL[_0x4b695e];
    return _0x3800ed[Math.floor(Math.random() * _0x3800ed.length)];
  }
  const _0x573f2b = _0x3851b0.toLowerCase();
  const _0x1856b8 = ALL_CATS.find(_0x3b1d53 => _0x3b1d53 === _0x573f2b);
  if (_0x1856b8) {
    const _0x52851d = LOCAL[_0x1856b8];
    return _0x52851d[Math.floor(Math.random() * _0x52851d.length)];
  }
  const _0x1c864a = ALL_CATS.find(_0x9581ce => _0x9581ce.includes(_0x573f2b) || _0x573f2b.includes(_0x9581ce));
  if (_0x1c864a) {
    const _0x209cb4 = LOCAL[_0x1c864a];
    return _0x209cb4[Math.floor(Math.random() * _0x209cb4.length)];
  }
  const _0x111a86 = [];
  for (const _0x4486da of Object.values(LOCAL)) {
    for (const _0xbc9fc3 of _0x4486da) {
      if (_0xbc9fc3.q.toLowerCase().includes(_0x573f2b) || _0xbc9fc3.a.toLowerCase().includes(_0x573f2b)) {
        _0x111a86.push(_0xbc9fc3);
      }
    }
  }
  if (_0x111a86.length) {
    return _0x111a86[Math.floor(Math.random() * _0x111a86.length)];
  }
  return null;
}
async function fetchApiQuote(_0x42600a) {
  const _0x3a54fa = _0x42600a ? "https://zenquotes.io/api/quotes/" + encodeURIComponent(_0x42600a) : "https://zenquotes.io/api/random";
  const _0x43a554 = await fetch(_0x3a54fa, {
    headers: {
      "User-Agent": "TOOSII-XD-Bot/1.0"
    },
    signal: AbortSignal.timeout(10000)
  });
  if (!_0x43a554.ok) {
    throw new Error("API " + _0x43a554.status);
  }
  const _0x36a594 = await _0x43a554.json();
  if (!Array.isArray(_0x36a594) || !_0x36a594.length || !_0x36a594[0]?.q) {
    throw new Error("No quotes");
  }
  const _0x4ca991 = _0x36a594[Math.floor(Math.random() * _0x36a594.length)];
  return {
    q: _0x4ca991.q,
    a: _0x4ca991.a || "Unknown"
  };
}
function totalQuotes() {
  return Object.values(LOCAL).reduce((_0x1a32fa, _0x1cb082) => _0x1a32fa + _0x1cb082.length, 0);
}
module.exports = {
  name: "quote",
  aliases: ["randomquote", "inspire", "motivation", "qod"],
  description: "Get an inspirational quote (300+ local quotes)",
  category: "utility",
  async execute(_0x22334c, _0x11781d, _0x1fdb88, _0x496520, _0x2d187a) {
    const _0x3e04d9 = _0x11781d.key.remoteJid;
    const _0x143507 = getBotName();
    const _0x53edf = _0x1fdb88.join(" ").trim().toLowerCase() || null;
    const _0x17c758 = "╔═|〔  💬 QUOTE 〕";
    const _0x1acc48 = "╚═|〔 " + _0x143507 + " 〕";
    if (_0x53edf === "list" || _0x53edf === "categories") {
      const _0x1be58d = ALL_CATS.map((_0x21936d, _0xcc41a7) => "║  " + (_0xcc41a7 + 1) + ". " + _0x21936d + " (" + LOCAL[_0x21936d].length + ")").join("\n");
      return _0x22334c.sendMessage(_0x3e04d9, {
        text: [_0x17c758, "║", "║ ▸ *Total* : " + totalQuotes() + " quotes", "║ ▸ *Categories* :", _0x1be58d, "║", "║  Usage: " + _0x496520 + "quote <category>", "║", _0x1acc48].join("\n")
      }, {
        quoted: _0x11781d
      });
    }
    try {
      await _0x22334c.sendMessage(_0x3e04d9, {
        react: {
          text: "💬",
          key: _0x11781d.key
        }
      });
      let _0x5d3e1f = pickLocal(_0x53edf);
      let _0xcb1e11 = "local";
      if (!_0x5d3e1f) {
        try {
          const _0x462c7c = await fetchApiQuote(_0x53edf);
          _0x5d3e1f = {
            q: _0x462c7c.q,
            a: _0x462c7c.a
          };
          _0xcb1e11 = "api";
        } catch {
          _0x5d3e1f = pickLocal(null);
          _0xcb1e11 = "local";
        }
      }
      const _0x18f62f = [_0x17c758, "║", "║  _\"" + _0x5d3e1f.q + "\"_", "║", "║ ▸ *Author*  : " + _0x5d3e1f.a];
      if (_0x53edf && _0x53edf !== "list") {
        _0x18f62f.push("║ ▸ *Topic*   : " + _0x53edf);
      }
      _0x18f62f.push("║ ▸ *Library* : " + totalQuotes() + " quotes");
      _0x18f62f.push("║", _0x1acc48);
      await _0x22334c.sendMessage(_0x3e04d9, {
        text: _0x18f62f.join("\n")
      }, {
        quoted: _0x11781d
      });
      await _0x22334c.sendMessage(_0x3e04d9, {
        react: {
          text: "✅",
          key: _0x11781d.key
        }
      });
    } catch (_0x37c395) {
      await _0x22334c.sendMessage(_0x3e04d9, {
        react: {
          text: "❌",
          key: _0x11781d.key
        }
      });
      await _0x22334c.sendMessage(_0x3e04d9, {
        text: [_0x17c758, "║", "║ ▸ *Status* : ❌ Failed", "║ ▸ *Reason* : " + _0x37c395.message, "║", _0x1acc48].join("\n")
      }, {
        quoted: _0x11781d
      });
    }
  }
};