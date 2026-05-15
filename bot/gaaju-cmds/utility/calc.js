'use strict';

const {
  getBotName
} = require("../../lib/botname");
const SAFE_PATTERN = /^[0-9+\-*\/().%\s,eE^sqrtpilognabcfmorx]+$/i;
function safeEval(_0x2d9591) {
  const _0x2c532c = _0x2d9591.replace(/\^/g, "**").replace(/\bsqrt\b/gi, "Math.sqrt").replace(/\bpi\b/gi, "Math.PI").replace(/\bsin\b/gi, "Math.sin").replace(/\bcos\b/gi, "Math.cos").replace(/\btan\b/gi, "Math.tan").replace(/\blog\b/gi, "Math.log10").replace(/\bln\b/gi, "Math.log").replace(/\babs\b/gi, "Math.abs").replace(/\bceil\b/gi, "Math.ceil").replace(/\bfloor\b/gi, "Math.floor").replace(/\bround\b/gi, "Math.round").replace(/\bmax\b/gi, "Math.max").replace(/\bmin\b/gi, "Math.min").replace(/\bpow\b/gi, "Math.pow").replace(/,/g, ".");
  if (!SAFE_PATTERN.test(_0x2d9591.replace(/\s/g, ""))) {
    throw new Error("Only math expressions allowed");
  }
  const _0x30fe3c = new Function("\"use strict\"; return (" + _0x2c532c + ");");
  const _0x2d7c02 = _0x30fe3c();
  if (_0x2d7c02 === undefined || _0x2d7c02 === null) {
    throw new Error("Expression returned nothing");
  }
  if (!isFinite(_0x2d7c02)) {
    throw new Error("Result is infinite or NaN");
  }
  return _0x2d7c02;
}
function fmt(_0x56fc22) {
  if (Number.isInteger(_0x56fc22)) {
    return _0x56fc22.toLocaleString("en-US");
  }
  const _0x17efd1 = parseFloat(_0x56fc22.toPrecision(10)).toString();
  const [_0x5b9752, _0xabfd54] = _0x17efd1.split(".");
  return "" + parseInt(_0x5b9752).toLocaleString("en-US") + (_0xabfd54 ? "." + _0xabfd54 : "");
}
module.exports = {
  name: "calc",
  aliases: ["calculate", "math", "calculator", "eval", "compute"],
  description: "Calculate any math expression — .calc <expression>",
  category: "utility",
  async execute(_0xcbeb1e, _0x1ab757, _0x50dcf8, _0x43e121) {
    const _0x5723b7 = _0x1ab757.key.remoteJid;
    const _0x5e941c = getBotName();
    try {
      await _0xcbeb1e.sendMessage(_0x5723b7, {
        react: {
          text: "🧮",
          key: _0x1ab757.key
        }
      });
    } catch {}
    const _0x4afdde = _0x1ab757.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const _0xbd6c8d = _0x4afdde?.conversation || _0x4afdde?.extendedTextMessage?.text;
    const _0x33f1eb = _0x50dcf8.join(" ").trim() || _0xbd6c8d?.trim();
    if (!_0x33f1eb) {
      return _0xcbeb1e.sendMessage(_0x5723b7, {
        text: ["╔═|〔  CALCULATOR 🧮 〕", "║", "║ ▸ *Usage*   : " + _0x43e121 + "calc <expression>", "║ ▸ *Example* : " + _0x43e121 + "calc 25 * 4 + 10", "║ ▸ *Example* : " + _0x43e121 + "calc sqrt(144)", "║ ▸ *Example* : " + _0x43e121 + "calc 2^10", "║ ▸ *Ops*     : + - * / ^ % sqrt log sin cos", "║", "╚═|〔 " + _0x5e941c + " 〕"].join("\n")
      }, {
        quoted: _0x1ab757
      });
    }
    try {
      const _0x1691cc = safeEval(_0x33f1eb);
      const _0x2bc47a = fmt(_0x1691cc);
      await _0xcbeb1e.sendMessage(_0x5723b7, {
        text: ["╔═|〔  CALCULATOR 🧮 〕", "║", "║ ▸ *Expr*   : " + _0x33f1eb, "║ ▸ *Result* : *" + _0x2bc47a + "*", "║", "╚═|〔 " + _0x5e941c + " 〕"].join("\n")
      }, {
        quoted: _0x1ab757
      });
    } catch (_0x2a6bf2) {
      await _0xcbeb1e.sendMessage(_0x5723b7, {
        text: "╔═|〔  CALCULATOR 〕\n║\n║ ▸ *Status* : ❌ " + _0x2a6bf2.message + "\n║ ▸ *Hint*   : " + _0x43e121 + "calc 25*4 or sqrt(144)\n║\n╚═|〔 " + _0x5e941c + " 〕"
      }, {
        quoted: _0x1ab757
      });
    }
  }
};