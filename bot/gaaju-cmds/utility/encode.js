'use strict';

function getInput(_0x2d28a3, _0x59ad3d) {
  const _0x2fe94f = _0x59ad3d.join(" ").trim();
  if (_0x2fe94f) {
    return _0x2fe94f;
  }
  const _0x5a8c68 = _0x2d28a3.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (_0x5a8c68) {
    return _0x5a8c68.conversation || _0x5a8c68.extendedTextMessage?.text || "";
  }
  return "";
}
module.exports = [{
  name: "ebinary",
  aliases: ["texttobin", "txt2bin"],
  description: "Convert text to binary",
  category: "utility",
  async execute(_0x3976d6, _0x1af984, _0x1b2431, _0x3c99b1, _0x48249e) {
    const _0xef4d28 = _0x1af984.key.remoteJid;
    try {
      await _0x3976d6.sendMessage(_0xef4d28, {
        react: {
          text: "🔢",
          key: _0x1af984.key
        }
      });
    } catch {}
    const _0x20d7dc = getInput(_0x1af984, _0x1b2431);
    if (!_0x20d7dc) {
      return _0x3976d6.sendMessage(_0xef4d28, {
        text: "╔═|〔  ENCODE 〕\n║\n║ ▸ *Usage* : " + _0x3c99b1 + "ebinary <text>\n║           or reply to a message\n║\n╚═╝"
      }, {
        quoted: _0x1af984
      });
    }
    if (_0x20d7dc.length > 500) {
      return _0x3976d6.sendMessage(_0xef4d28, {
        text: "╔═|〔  ENCODE 〕\n║\n║ ▸ Text too long (max 500 chars)\n║\n╚═╝"
      }, {
        quoted: _0x1af984
      });
    }
    const _0x3357d8 = [..._0x20d7dc].map(_0x4caf66 => _0x4caf66.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    await _0x3976d6.sendMessage(_0xef4d28, {
      text: "╔═|〔  BINARY ENCODE 〕\n║\n║ ▸ *Input* : " + _0x20d7dc + "\n║\n║ ▸ *Binary* :\n║ " + _0x3357d8.match(/.{1,40}/g).join("\n║ ") + "\n║\n╚═╝"
    }, {
      quoted: _0x1af984
    });
  }
}, {
  name: "debinary",
  aliases: ["bintotext", "bin2txt"],
  description: "Convert binary to text",
  category: "utility",
  async execute(_0x1ae742, _0x1948eb, _0x55f696, _0x5d361f, _0xcbdcc0) {
    const _0x10433c = _0x1948eb.key.remoteJid;
    try {
      await _0x1ae742.sendMessage(_0x10433c, {
        react: {
          text: "🔡",
          key: _0x1948eb.key
        }
      });
    } catch {}
    const _0x4c990a = getInput(_0x1948eb, _0x55f696);
    if (!_0x4c990a) {
      return _0x1ae742.sendMessage(_0x10433c, {
        text: "╔═|〔  DECODE 〕\n║\n║ ▸ *Usage* : " + _0x5d361f + "debinary <binary>\n║           or reply to a binary message\n║\n╚═╝"
      }, {
        quoted: _0x1948eb
      });
    }
    try {
      const _0x3fffb5 = _0x4c990a.replace(/[^01\s]/g, "").trim();
      const _0x155c56 = _0x3fffb5.split(/\s+/).filter(_0x2836f7 => _0x2836f7.length === 8);
      if (!_0x155c56.length) {
        throw new Error("Invalid binary format");
      }
      const _0x451b08 = _0x155c56.map(_0x2c8041 => String.fromCharCode(parseInt(_0x2c8041, 2))).join("");
      await _0x1ae742.sendMessage(_0x10433c, {
        text: "╔═|〔  BINARY DECODE 〕\n║\n║ ▸ *Result* : " + _0x451b08 + "\n║\n╚═╝"
      }, {
        quoted: _0x1948eb
      });
    } catch {
      await _0x1ae742.sendMessage(_0x10433c, {
        text: "╔═|〔  DECODE 〕\n║\n║ ▸ ❌ Invalid binary input\n║ ▸ Format: 01001000 01101001\n║\n╚═╝"
      }, {
        quoted: _0x1948eb
      });
    }
  }
}, {
  name: "ebase",
  aliases: ["tobase64", "base64encode", "b64enc"],
  description: "Encode text to Base64",
  category: "utility",
  async execute(_0x3dca15, _0x399efc, _0x1b72e4, _0x5e8fc5, _0x2ab7f8) {
    const _0x4942dc = _0x399efc.key.remoteJid;
    try {
      await _0x3dca15.sendMessage(_0x4942dc, {
        react: {
          text: "🔐",
          key: _0x399efc.key
        }
      });
    } catch {}
    const _0x34c06d = getInput(_0x399efc, _0x1b72e4);
    if (!_0x34c06d) {
      return _0x3dca15.sendMessage(_0x4942dc, {
        text: "╔═|〔  ENCODE 〕\n║\n║ ▸ *Usage* : " + _0x5e8fc5 + "ebase <text>\n║\n╚═╝"
      }, {
        quoted: _0x399efc
      });
    }
    if (_0x34c06d.length > 1000) {
      return _0x3dca15.sendMessage(_0x4942dc, {
        text: "╔═|〔  ENCODE 〕\n║\n║ ▸ Text too long (max 1000 chars)\n║\n╚═╝"
      }, {
        quoted: _0x399efc
      });
    }
    const _0x9637b7 = Buffer.from(_0x34c06d, "utf-8").toString("base64");
    await _0x3dca15.sendMessage(_0x4942dc, {
      text: "╔═|〔  BASE64 ENCODE 〕\n║\n║ ▸ *Input* : " + _0x34c06d.slice(0, 60) + (_0x34c06d.length > 60 ? "..." : "") + "\n║\n║ ▸ *Base64* :\n║ " + _0x9637b7.match(/.{1,50}/g).join("\n║ ") + "\n║\n╚═╝"
    }, {
      quoted: _0x399efc
    });
  }
}, {
  name: "dbase",
  aliases: ["frombase64", "base64decode", "b64dec"],
  description: "Decode Base64 to text",
  category: "utility",
  async execute(_0x544cab, _0x18b4c3, _0x11280d, _0x4a0799, _0x4b53f0) {
    const _0x439db9 = _0x18b4c3.key.remoteJid;
    try {
      await _0x544cab.sendMessage(_0x439db9, {
        react: {
          text: "🔓",
          key: _0x18b4c3.key
        }
      });
    } catch {}
    const _0x5a0cd8 = getInput(_0x18b4c3, _0x11280d);
    if (!_0x5a0cd8) {
      return _0x544cab.sendMessage(_0x439db9, {
        text: "╔═|〔  DECODE 〕\n║\n║ ▸ *Usage* : " + _0x4a0799 + "dbase <base64>\n║\n╚═╝"
      }, {
        quoted: _0x18b4c3
      });
    }
    try {
      const _0x5a6c0a = Buffer.from(_0x5a0cd8.trim(), "base64").toString("utf-8");
      if (!_0x5a6c0a) {
        throw new Error("Empty result");
      }
      await _0x544cab.sendMessage(_0x439db9, {
        text: "╔═|〔  BASE64 DECODE 〕\n║\n║ ▸ *Result* : " + _0x5a6c0a + "\n║\n╚═╝"
      }, {
        quoted: _0x18b4c3
      });
    } catch {
      await _0x544cab.sendMessage(_0x439db9, {
        text: "╔═|〔  DECODE 〕\n║\n║ ▸ ❌ Invalid Base64 input\n║\n╚═╝"
      }, {
        quoted: _0x18b4c3
      });
    }
  }
}, {
  name: "ehex",
  aliases: ["tohex", "texttohex"],
  description: "Encode text to Hexadecimal",
  category: "utility",
  async execute(_0x437a99, _0x244dee, _0x4443ed, _0x5a0b31, _0x4ad00d) {
    const _0x1660f1 = _0x244dee.key.remoteJid;
    try {
      await _0x437a99.sendMessage(_0x1660f1, {
        react: {
          text: "🔢",
          key: _0x244dee.key
        }
      });
    } catch {}
    const _0xcdb435 = getInput(_0x244dee, _0x4443ed);
    if (!_0xcdb435) {
      return _0x437a99.sendMessage(_0x1660f1, {
        text: "╔═|〔  ENCODE 〕\n║\n║ ▸ *Usage* : " + _0x5a0b31 + "ehex <text>\n║\n╚═╝"
      }, {
        quoted: _0x244dee
      });
    }
    const _0x4abebb = Buffer.from(_0xcdb435, "utf-8").toString("hex").match(/.{2}/g).join(" ");
    await _0x437a99.sendMessage(_0x1660f1, {
      text: "╔═|〔  HEX ENCODE 〕\n║\n║ ▸ *Input* : " + _0xcdb435.slice(0, 60) + "\n║\n║ ▸ *Hex* :\n║ " + _0x4abebb.match(/.{1,48}/g).join("\n║ ") + "\n║\n╚═╝"
    }, {
      quoted: _0x244dee
    });
  }
}, {
  name: "dhex",
  aliases: ["fromhex", "hextotext"],
  description: "Decode Hexadecimal to text",
  category: "utility",
  async execute(_0x2bea5d, _0x44cbcf, _0x19fd57, _0x1dbfee, _0x54b0f4) {
    const _0x1481ed = _0x44cbcf.key.remoteJid;
    try {
      await _0x2bea5d.sendMessage(_0x1481ed, {
        react: {
          text: "🔡",
          key: _0x44cbcf.key
        }
      });
    } catch {}
    const _0x3e54da = getInput(_0x44cbcf, _0x19fd57);
    if (!_0x3e54da) {
      return _0x2bea5d.sendMessage(_0x1481ed, {
        text: "╔═|〔  DECODE 〕\n║\n║ ▸ *Usage* : " + _0x1dbfee + "dhex <hex>\n║\n╚═╝"
      }, {
        quoted: _0x44cbcf
      });
    }
    try {
      const _0x3edbe1 = _0x3e54da.replace(/\s+/g, "");
      if (!/^[0-9a-fA-F]+$/.test(_0x3edbe1) || _0x3edbe1.length % 2 !== 0) {
        throw new Error("Invalid hex");
      }
      const _0xb50737 = Buffer.from(_0x3edbe1, "hex").toString("utf-8");
      await _0x2bea5d.sendMessage(_0x1481ed, {
        text: "╔═|〔  HEX DECODE 〕\n║\n║ ▸ *Result* : " + _0xb50737 + "\n║\n╚═╝"
      }, {
        quoted: _0x44cbcf
      });
    } catch {
      await _0x2bea5d.sendMessage(_0x1481ed, {
        text: "╔═|〔  DECODE 〕\n║\n║ ▸ ❌ Invalid hex input\n║\n╚═╝"
      }, {
        quoted: _0x44cbcf
      });
    }
  }
}];