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
  name: "toimg",
  aliases: ["toimage", "unsticker", "stktoimg"],
  description: "Convert a sticker back to an image",
  category: "utility",
  async execute(_0x3aad00, _0x3308f4, _0x52b245, _0x4097a8, _0x1ea4b3) {
    const _0x53ad44 = _0x3308f4.key.remoteJid;
    const _0x66c3b0 = getBotName();
    try {
      await _0x3aad00.sendMessage(_0x53ad44, {
        react: {
          text: "🖼️",
          key: _0x3308f4.key
        }
      });
    } catch {}
    const _0x3eb9e6 = _0x3308f4.message?.extendedTextMessage?.contextInfo;
    const _0x5cc691 = _0x3eb9e6?.quotedMessage;
    if (!_0x5cc691?.stickerMessage) {
      return _0x3aad00.sendMessage(_0x53ad44, {
        text: "╔═|〔  TO IMAGE 〕\n║\n║ ▸ *Usage* : Reply to a sticker\n║            with *" + _0x4097a8 + "toimg*\n║\n╚═|〔 " + _0x66c3b0 + " 〕"
      }, {
        quoted: _0x3308f4
      });
    }
    const _0x5f4627 = {
      key: {
        remoteJid: _0x53ad44,
        id: _0x3eb9e6.stanzaId,
        participant: _0x3eb9e6.participant,
        fromMe: false
      },
      message: _0x5cc691
    };
    const _0x22ab4f = await downloadMediaMessage(_0x5f4627, "buffer", {});
    if (!_0x22ab4f || _0x22ab4f.length === 0) {
      throw new Error("Could not download sticker");
    }
    const _0x3b1bf8 = path.join(os.tmpdir(), "toimg_in_" + Date.now() + ".webp");
    const _0x39bd7b = path.join(os.tmpdir(), "toimg_out_" + Date.now() + ".png");
    try {
      fs.writeFileSync(_0x3b1bf8, _0x22ab4f);
      await execFileAsync("ffmpeg", ["-y", "-i", _0x3b1bf8, _0x39bd7b], {
        timeout: 15000
      });
      const _0x10417a = fs.readFileSync(_0x39bd7b);
      await _0x3aad00.sendMessage(_0x53ad44, {
        image: _0x10417a,
        caption: "╔═|〔  TO IMAGE 〕\n║\n║ ▸ *Status* : ✅ Converted\n║\n╚═|〔 " + _0x66c3b0 + " 〕"
      }, {
        quoted: _0x3308f4
      });
    } finally {
      try {
        fs.unlinkSync(_0x3b1bf8);
      } catch {}
      try {
        fs.unlinkSync(_0x39bd7b);
      } catch {}
    }
  }
};