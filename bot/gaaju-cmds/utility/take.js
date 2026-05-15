'use strict';

const {
  downloadMediaMessage
} = require("@whiskeysockets/baileys");
const {
  getBotName
} = require("../../lib/botname");
const {
  execFile
} = require("child_process");
const {
  promisify
} = require("util");
const sharp = require("sharp");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const execFileAsync = promisify(execFile);
function buildExifChunk(_0x1d8133, _0x2654f7) {
  const _0x2c00ad = JSON.stringify({
    "sticker-pack-id": crypto.randomBytes(8).toString("hex"),
    "sticker-pack-name": _0x1d8133,
    "sticker-pack-publisher": _0x2654f7,
    "android-app-store-link": "",
    "ios-app-store-link": ""
  });
  const _0x248076 = Buffer.from(_0x2c00ad, "utf8");
  const _0x1a19c4 = 32;
  const _0x10d5ee = Buffer.alloc(_0x1a19c4 + _0x248076.length);
  _0x10d5ee.write("Exif\0\0", 0, "ascii");
  _0x10d5ee.writeUInt16LE(18761, 6);
  _0x10d5ee.writeUInt16LE(42, 8);
  _0x10d5ee.writeUInt32LE(8, 10);
  _0x10d5ee.writeUInt16LE(1, 14);
  _0x10d5ee.writeUInt16LE(270, 16);
  _0x10d5ee.writeUInt16LE(2, 18);
  _0x10d5ee.writeUInt32LE(_0x248076.length, 20);
  _0x10d5ee.writeUInt32LE(_0x1a19c4 - 6, 24);
  _0x10d5ee.writeUInt32LE(0, 28);
  _0x248076.copy(_0x10d5ee, _0x1a19c4);
  const _0x11a56c = Buffer.alloc(8 + _0x10d5ee.length);
  _0x11a56c.write("EXIF", 0, "ascii");
  _0x11a56c.writeUInt32LE(_0x10d5ee.length, 4);
  _0x10d5ee.copy(_0x11a56c, 8);
  return _0x11a56c;
}
function injectExifToWebp(_0x553421, _0x255906, _0x4ba806) {
  if (_0x553421.slice(0, 4).toString("ascii") !== "RIFF") {
    throw new Error("Not a RIFF buffer");
  }
  if (_0x553421.slice(8, 12).toString("ascii") !== "WEBP") {
    throw new Error("Not a WebP file");
  }
  const _0x973064 = _0x553421.slice(12);
  const _0x3c42c8 = [];
  let _0x406b41 = 0;
  while (_0x406b41 + 8 <= _0x973064.length) {
    const _0x58a9ab = _0x973064.slice(_0x406b41, _0x406b41 + 4).toString("ascii");
    const _0x346f4c = _0x973064.readUInt32LE(_0x406b41 + 4);
    const _0x48a81f = _0x346f4c % 2;
    if (_0x58a9ab !== "EXIF") {
      _0x3c42c8.push(_0x973064.slice(_0x406b41, _0x406b41 + 8 + _0x346f4c + _0x48a81f));
    }
    _0x406b41 += 8 + _0x346f4c + _0x48a81f;
  }
  const _0x477c0c = buildExifChunk(_0x255906, _0x4ba806);
  const _0x3991df = Buffer.concat([..._0x3c42c8, _0x477c0c]);
  const _0x240b65 = Buffer.alloc(12);
  _0x240b65.write("RIFF", 0, "ascii");
  _0x240b65.writeUInt32LE(4 + _0x3991df.length, 4);
  _0x240b65.write("WEBP", 8, "ascii");
  return Buffer.concat([_0x240b65, _0x3991df]);
}
module.exports = {
  name: "take",
  aliases: ["steal", "stickerpack", "stkpack", "taka"],
  description: "Re-pack a sticker with a custom name & author — .take [PackName | Author]",
  category: "utility",
  async execute(_0x5692e6, _0x1f1711, _0xd7e8b2, _0x414130) {
    const _0x4c85be = _0x1f1711.key.remoteJid;
    const _0xe7fbf1 = getBotName();
    try {
      await _0x5692e6.sendMessage(_0x4c85be, {
        react: {
          text: "🎨",
          key: _0x1f1711.key
        }
      });
    } catch {}
    const _0x457b46 = _0xd7e8b2.join(" ").trim();
    const [_0x23eef7, _0xccf2a1] = _0x457b46.includes("|") ? _0x457b46.split("|").map(_0x3c2f35 => _0x3c2f35.trim()) : [_0x457b46, ""];
    const _0xe691e0 = _0x23eef7 || _0xe7fbf1;
    const _0x4b3ece = _0xccf2a1 || _0xe7fbf1;
    const _0x1b6f99 = _0x1f1711.message?.extendedTextMessage?.contextInfo;
    const _0x46228c = _0x1b6f99?.quotedMessage;
    const _0x441be4 = _0x46228c?.stickerMessage;
    const _0x3129da = _0x46228c?.imageMessage;
    const _0xb08dd2 = _0x46228c?.videoMessage;
    const _0x5e12b1 = _0x46228c?.documentMessage;
    if (!_0x46228c || !_0x441be4 && !_0x3129da && !_0xb08dd2 && !_0x5e12b1) {
      return _0x5692e6.sendMessage(_0x4c85be, {
        text: ["╔═|〔  🎨 TAKE STICKER 〕", "║", "║ ▸ *Usage*   : Reply to a sticker or image", "║              with *" + _0x414130 + "take*", "║ ▸ *Custom*  : " + _0x414130 + "take MyPack | Author", "║", "╚═|〔 " + _0xe7fbf1 + " 〕"].join("\n")
      }, {
        quoted: _0x1f1711
      });
    }
    const _0x20f824 = os.tmpdir();
    const _0x2a08df = path.join(_0x20f824, "take_in_" + Date.now());
    const _0x11ec56 = path.join(_0x20f824, "take_out_" + Date.now() + ".webp");
    try {
      const _0x3dfc41 = {
        key: {
          remoteJid: _0x4c85be,
          id: _0x1b6f99.stanzaId,
          participant: _0x1b6f99.participant,
          fromMe: false
        },
        message: _0x46228c
      };
      const _0x3e9ca0 = await downloadMediaMessage(_0x3dfc41, "buffer", {});
      if (!_0x3e9ca0 || _0x3e9ca0.length === 0) {
        throw new Error("Could not download media");
      }
      let _0x14807c;
      if (_0x441be4) {
        _0x14807c = _0x3e9ca0;
      } else if (_0x3129da || _0x5e12b1) {
        _0x14807c = await sharp(_0x3e9ca0).resize(512, 512, {
          fit: "contain",
          background: {
            r: 0,
            g: 0,
            b: 0,
            alpha: 0
          }
        }).webp({
          lossless: true
        }).toBuffer();
      } else if (_0xb08dd2) {
        const _0x30535e = "mp4";
        const _0x584fcb = _0x2a08df + "." + _0x30535e;
        fs.writeFileSync(_0x584fcb, _0x3e9ca0);
        await execFileAsync("ffmpeg", ["-y", "-i", _0x584fcb, "-vf", "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,fps=15", "-t", "10", "-loop", "0", "-preset", "default", "-an", "-vsync", "0", _0x11ec56], {
          timeout: 30000
        });
        _0x14807c = fs.readFileSync(_0x11ec56);
        try {
          fs.unlinkSync(_0x584fcb);
        } catch {}
        try {
          fs.unlinkSync(_0x11ec56);
        } catch {}
      }
      const _0x2b2eff = injectExifToWebp(_0x14807c, _0xe691e0, _0x4b3ece);
      await _0x5692e6.sendMessage(_0x4c85be, {
        sticker: _0x2b2eff
      }, {
        quoted: _0x1f1711
      });
      await _0x5692e6.sendMessage(_0x4c85be, {
        text: ["╔═|〔  🎨 TAKE STICKER 〕", "║", "║ ▸ *Pack*   : " + _0xe691e0, "║ ▸ *Author* : " + _0x4b3ece, "║ ▸ *Status* : ✅ Done", "║", "╚═|〔 " + _0xe7fbf1 + " 〕"].join("\n")
      }, {
        quoted: _0x1f1711
      });
    } catch (_0x43a2a9) {
      await _0x5692e6.sendMessage(_0x4c85be, {
        text: "╔═|〔  🎨 TAKE STICKER 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x43a2a9.message + "\n║\n╚═|〔 " + _0xe7fbf1 + " 〕"
      }, {
        quoted: _0x1f1711
      });
    } finally {
      try {
        if (fs.existsSync(_0x11ec56)) {
          fs.unlinkSync(_0x11ec56);
        }
      } catch {}
    }
  }
};