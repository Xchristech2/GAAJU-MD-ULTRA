'use strict';

const {
  getBotName
} = require("../../lib/botname");
const POPULAR = ["usd", "kes", "eur", "gbp", "ngn", "zar", "inr", "cny", "jpy", "cad", "aud", "aed", "brl", "mxn", "egp", "ghs", "tzs", "ugx", "rwf", "etb"];
const SYMBOLS = {
  usd: "$",
  eur: "€",
  gbp: "£",
  jpy: "¥",
  cny: "¥",
  inr: "₹",
  kes: "KSh",
  ngn: "₦",
  zar: "R",
  cad: "CA$",
  aud: "A$",
  aed: "د.إ",
  brl: "R$",
  mxn: "MX$",
  egp: "E£",
  ghs: "₵",
  tzs: "TSh",
  ugx: "USh",
  rwf: "Fr",
  etb: "Br"
};
async function getRates(_0x5b79bd) {
  const _0x1b35ab = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/" + _0x5b79bd + ".json";
  const _0x4b22bc = await fetch(_0x1b35ab, {
    signal: AbortSignal.timeout(15000)
  });
  if (!_0x4b22bc.ok) {
    throw new Error("Rate API HTTP " + _0x4b22bc.status);
  }
  const _0x3bce79 = await _0x4b22bc.json();
  if (!_0x3bce79[_0x5b79bd]) {
    throw new Error("Invalid base currency");
  }
  return _0x3bce79[_0x5b79bd];
}
function fmt(_0x4d9eb0) {
  if (_0x4d9eb0 >= 1000) {
    return _0x4d9eb0.toLocaleString("en-US", {
      maximumFractionDigits: 2
    });
  }
  if (_0x4d9eb0 >= 1) {
    return _0x4d9eb0.toFixed(4).replace(/\.?0+$/, "");
  }
  return _0x4d9eb0.toFixed(6).replace(/\.?0+$/, "");
}
module.exports = [{
  name: "currency",
  aliases: ["forex", "convert", "exchange", "fx", "rate"],
  description: "Convert between currencies — .currency <amount> <from> <to>",
  category: "utility",
  async execute(_0x5e2bd7, _0x1cb0ab, _0x590627, _0x2dad23) {
    const _0x56eeef = _0x1cb0ab.key.remoteJid;
    const _0x16a519 = getBotName();
    try {
      await _0x5e2bd7.sendMessage(_0x56eeef, {
        react: {
          text: "💱",
          key: _0x1cb0ab.key
        }
      });
    } catch {}
    const _0x4b385a = "╔═|〔  CURRENCY 💱 〕\n║\n║ ▸ *Usage*   : " + _0x2dad23 + "currency <amount> <from> <to>\n║ ▸ *Example* : " + _0x2dad23 + "currency 100 USD KES\n║ ▸ *Example* : " + _0x2dad23 + "currency 50 EUR GBP\n║\n╚═|〔 " + _0x16a519 + " 〕";
    const _0x47cdd7 = parseFloat(_0x590627[0]);
    if (!_0x590627[0] || isNaN(_0x47cdd7) || _0x47cdd7 <= 0) {
      return _0x5e2bd7.sendMessage(_0x56eeef, {
        text: _0x4b385a
      }, {
        quoted: _0x1cb0ab
      });
    }
    const _0x1882d3 = (_0x590627[1] || "").toLowerCase();
    const _0xed10c5 = (_0x590627[2] || "").toLowerCase();
    if (!_0x1882d3 || !_0xed10c5) {
      return _0x5e2bd7.sendMessage(_0x56eeef, {
        text: _0x4b385a
      }, {
        quoted: _0x1cb0ab
      });
    }
    try {
      const _0x4748e9 = await getRates(_0x1882d3);
      const _0x537e44 = _0x4748e9[_0xed10c5];
      if (!_0x537e44) {
        throw new Error("Unknown currency: " + _0xed10c5.toUpperCase());
      }
      const _0x56ba8c = _0x47cdd7 * _0x537e44;
      const _0x3f0429 = SYMBOLS[_0x1882d3] || _0x1882d3.toUpperCase();
      const _0x48c90f = SYMBOLS[_0xed10c5] || _0xed10c5.toUpperCase();
      await _0x5e2bd7.sendMessage(_0x56eeef, {
        text: ["╔═|〔  CURRENCY 💱 〕", "║", "║ ▸ *From*   : " + _0x3f0429 + " " + fmt(_0x47cdd7) + " " + _0x1882d3.toUpperCase(), "║ ▸ *To*     : " + _0x48c90f + " " + fmt(_0x56ba8c) + " " + _0xed10c5.toUpperCase(), "║ ▸ *Rate*   : 1 " + _0x1882d3.toUpperCase() + " = " + fmt(_0x537e44) + " " + _0xed10c5.toUpperCase(), "║ ▸ *Source* : Fawazahmed0 (live)", "║", "╚═|〔 " + _0x16a519 + " 〕"].join("\n")
      }, {
        quoted: _0x1cb0ab
      });
    } catch (_0x15a9dc) {
      await _0x5e2bd7.sendMessage(_0x56eeef, {
        text: "╔═|〔  CURRENCY 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x15a9dc.message + "\n║\n╚═|〔 " + _0x16a519 + " 〕"
      }, {
        quoted: _0x1cb0ab
      });
    }
  }
}, {
  name: "rates",
  aliases: ["usdrates", "forexrates", "currencyrates", "fxrates"],
  description: "Show popular currency rates vs USD",
  category: "utility",
  async execute(_0x3bd42e, _0x1942cd, _0x1d8565, _0x11ee0a) {
    const _0x5e02f3 = _0x1942cd.key.remoteJid;
    const _0x20699c = getBotName();
    const _0x3e1b58 = (_0x1d8565[0] || "usd").toLowerCase();
    try {
      await _0x3bd42e.sendMessage(_0x5e02f3, {
        react: {
          text: "📊",
          key: _0x1942cd.key
        }
      });
    } catch {}
    try {
      const _0x3e26c9 = await getRates(_0x3e1b58);
      const _0x291af5 = POPULAR.filter(_0x2ac28d => _0x2ac28d !== _0x3e1b58 && _0x3e26c9[_0x2ac28d]).map(_0x1983c2 => {
        const _0xba9a51 = SYMBOLS[_0x1983c2] || _0x1983c2.toUpperCase();
        return "║ ▸ 1 " + _0x3e1b58.toUpperCase() + " = *" + fmt(_0x3e26c9[_0x1983c2]) + "* " + _0x1983c2.toUpperCase() + " (" + _0xba9a51 + ")";
      });
      await _0x3bd42e.sendMessage(_0x5e02f3, {
        text: ["╔═|〔  FOREX RATES 📊 〕", "║", "║ ▸ *Base* : " + _0x3e1b58.toUpperCase(), "║", ..._0x291af5, "║", "╚═|〔 " + _0x20699c + " 〕"].join("\n")
      }, {
        quoted: _0x1942cd
      });
    } catch (_0x129675) {
      await _0x3bd42e.sendMessage(_0x5e02f3, {
        text: "╔═|〔  FOREX RATES 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x129675.message + "\n║\n╚═|〔 " + _0x20699c + " 〕"
      }, {
        quoted: _0x1942cd
      });
    }
  }
}];