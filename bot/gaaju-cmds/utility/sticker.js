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
const fs = require("fs");
const os = require("os");
const path = require("path");
const execFileAsync = promisify(execFile);
module.exports = {
  name: "sticker",
  aliases: ["s", "stiker", "stick"],
  description: "Convert an image or video clip to a WhatsApp sticker",
  category: "utility",
  async execute(_0x6a1595, _0x5ec58a, _0x575ab7, _0x2b518b, _0x119455) {
    const _0x58b786 = _0x5ec58a.key.remoteJid;
    const _0x73f23a = getBotName();
    try {
      await _0x6a1595.sendMessage(_0x58b786, {
        react: {
          text: "🎨",
          key: _0x5ec58a.key
        }
      });
    } catch {}
    const _0x4af5a1 = _0x5ec58a.message?.extendedTextMessage?.contextInfo;
    const _0x4cca51 = _0x4af5a1?.quotedMessage;
    const _0x107fd4 = _0x4cca51?.imageMessage;
    const _0x12e77b = _0x4cca51?.videoMessage;
    const _0x39b912 = _0x4cca51?.stickerMessage;
    if (!_0x4cca51 || !_0x107fd4 && !_0x12e77b && !_0x39b912) {
      return _0x6a1595.sendMessage(_0x58b786, {
        text: "╔═|〔  STICKER 〕\n║\n║ ▸ *Usage* : Reply to an image or\n║            short video with *" + _0x2b518b + "s*\n║\n╚═|〔 " + _0x73f23a + " 〕"
      }, {
        quoted: _0x5ec58a
      });
    }
    const _0x42c191 = {
      key: {
        remoteJid: _0x58b786,
        id: _0x4af5a1.stanzaId,
        participant: _0x4af5a1.participant,
        fromMe: false
      },
      message: _0x4cca51
    };
    const _0x18e4e1 = await downloadMediaMessage(_0x42c191, "buffer", {});
    if (!_0x18e4e1 || _0x18e4e1.length === 0) {
      throw new Error("Could not download media");
    }
    const _0x27972f = !!_0x12e77b || !!_0x39b912?.isAnimated;
    const _0xeb4a22 = _0x27972f ? "mp4" : "jpg";
    const _0x50bf76 = path.join(os.tmpdir(), "stkr_in_" + Date.now() + "." + _0xeb4a22);
    const _0x4f7c8d = path.join(os.tmpdir(), "stkr_out_" + Date.now() + ".webp");
    try {
      fs.writeFileSync(_0x50bf76, _0x18e4e1);
      const _0x225593 = _0x27972f ? ["-y", "-i", _0x50bf76, "-vf", "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,fps=15", "-t", "10", "-loop", "0", "-preset", "default", "-an", "-vsync", "0", _0x4f7c8d] : ["-y", "-i", _0x50bf76, "-vf", "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2", _0x4f7c8d];
      await execFileAsync("ffmpeg", _0x225593, {
        timeout: 30000
      });
      const _0x393e6e = fs.readFileSync(_0x4f7c8d);
      await _0x6a1595.sendMessage(_0x58b786, {
        sticker: _0x393e6e
      }, {
        quoted: _0x5ec58a
      });
    } finally {
      try {
        fs.unlinkSync(_0x50bf76);
      } catch {}
      try {
        fs.unlinkSync(_0x4f7c8d);
      } catch {}
    }
  }
};