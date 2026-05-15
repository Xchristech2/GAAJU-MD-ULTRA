'use strict';

const {
  getBotName
} = require("../../lib/botname");
const util = require("util");
module.exports = {
  name: "eval",
  aliases: ["ev", ">"],
  description: "Evaluate JavaScript code (owner only)",
  category: "owner",
  async execute(_0x53a6e3, _0x791e90, _0x242b04, _0x27ca1c, _0x371687) {
    const _0x5ba298 = _0x791e90.key.remoteJid;
    const _0x362865 = getBotName();
    if (!_0x371687.isOwner()) {
      return _0x53a6e3.sendMessage(_0x5ba298, {
        text: "╔═|〔  EVAL 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 " + _0x362865 + " 〕"
      }, {
        quoted: _0x791e90
      });
    }
    const _0x3cdd9 = _0x242b04.join(" ").trim();
    if (!_0x3cdd9) {
      return _0x53a6e3.sendMessage(_0x5ba298, {
        text: "╔═|〔  EVAL 〕\n║\n║ ▸ *Usage* : " + _0x27ca1c + "eval <js code>\n║\n╚═|〔 " + _0x362865 + " 〕"
      }, {
        quoted: _0x791e90
      });
    }
    try {
      let _0x2249f1 = eval(_0x3cdd9);
      if (_0x2249f1 instanceof Promise) {
        _0x2249f1 = await _0x2249f1;
      }
      const _0x2524ae = util.inspect(_0x2249f1, {
        depth: 3,
        compact: true
      }).slice(0, 2000);
      await _0x53a6e3.sendMessage(_0x5ba298, {
        text: "╔═|〔  EVAL 〕\n║\n║ ▸ *Input*\n║ " + _0x3cdd9.slice(0, 200) + "\n║\n║ ▸ *Output*\n║ " + _0x2524ae + "\n║\n╚═|〔 " + _0x362865 + " 〕"
      }, {
        quoted: _0x791e90
      });
    } catch (_0x1bc9de) {
      await _0x53a6e3.sendMessage(_0x5ba298, {
        text: "╔═|〔  EVAL 〕\n║\n║ ▸ *Error*\n║ " + _0x1bc9de.message + "\n║\n╚═|〔 " + _0x362865 + " 〕"
      }, {
        quoted: _0x791e90
      });
    }
  }
};