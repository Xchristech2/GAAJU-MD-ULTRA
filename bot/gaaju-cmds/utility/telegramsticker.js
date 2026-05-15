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
const fs = require("fs");
const os = require("os");
const path = require("path");
const execFileAsync = promisify(execFile);
function tgBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN || "";
}
async function tgApiGet(_0x517cc0, _0x4418cb = {}) {
  const _0x185191 = tgBotToken();
  if (!_0x185191) {
    throw new Error("TELEGRAM_BOT_TOKEN not set");
  }
  const _0x12c435 = new URLSearchParams(_0x4418cb).toString();
  const _0x2af00d = "https://api.telegram.org/bot" + _0x185191 + "/" + _0x517cc0 + (_0x12c435 ? "?" + _0x12c435 : "");
  const _0x5075b0 = await fetch(_0x2af00d, {
    signal: AbortSignal.timeout(12000)
  });
  const _0x2f136d = await _0x5075b0.json();
  if (!_0x2f136d.ok) {
    throw new Error(_0x2f136d.description || "Telegram API error");
  }
  return _0x2f136d.result;
}
async function tgFileUrl(_0x5864e6) {
  const _0x2612d8 = await tgApiGet("getFile", {
    file_id: _0x5864e6
  });
  const _0x590198 = tgBotToken();
  return "https://api.telegram.org/file/bot" + _0x590198 + "/" + _0x2612d8.file_path;
}
async function downloadUrl(_0x355cca) {
  const _0x35a1ab = await fetch(_0x355cca, {
    signal: AbortSignal.timeout(30000)
  });
  if (!_0x35a1ab.ok) {
    throw new Error("HTTP " + _0x35a1ab.status);
  }
  const _0x3dec09 = await _0x35a1ab.arrayBuffer();
  return Buffer.from(_0x3dec09);
}
async function toStickerWebp(_0xc76876, _0x1b79cf = false) {
  const _0x529c22 = os.tmpdir();
  const _0x752bcf = Date.now();
  if (_0x1b79cf) {
    const _0x1cfb76 = path.join(_0x529c22, "tgstk_" + _0x752bcf + ".tgs");
    const _0x37ddb6 = path.join(_0x529c22, "tgstk_" + _0x752bcf + ".webp");
    try {
      fs.writeFileSync(_0x1cfb76, _0xc76876);
      await execFileAsync("ffmpeg", ["-y", "-i", _0x1cfb76, "-vf", "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,fps=15", "-t", "10", "-loop", "0", "-preset", "default", "-an", "-vsync", "0", _0x37ddb6], {
        timeout: 30000
      });
      return fs.readFileSync(_0x37ddb6);
    } finally {
      try {
        fs.unlinkSync(_0x1cfb76);
      } catch {}
      try {
        fs.unlinkSync(_0x37ddb6);
      } catch {}
    }
  }
  return sharp(_0xc76876).resize(512, 512, {
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
}
function parsePack(_0x5ca2c9) {
  const _0x2b602c = _0x5ca2c9.match(/(?:t\.me\/addstickers\/|tg:\/\/addstickers\?set=)([A-Za-z0-9_]+)/);
  if (_0x2b602c) {
    return _0x2b602c[1];
  } else {
    return _0x5ca2c9.trim();
  }
}
module.exports = {
  name: "telegramsticker",
  aliases: ["tgsticker", "tgstk", "telestk", "tsticker"],
  description: "Convert a Telegram sticker to WhatsApp — reply to a .webp doc or use .telegramsticker <pack>",
  category: "utility",
  async execute(_0x172c72, _0x4a403d, _0xf33f25, _0x576a80) {
    const _0x9ec0bb = _0x4a403d.key.remoteJid;
    const _0x449c0c = getBotName();
    const _0x2411a8 = _0xf33f25.join(" ").trim();
    try {
      await _0x172c72.sendMessage(_0x9ec0bb, {
        react: {
          text: "🎭",
          key: _0x4a403d.key
        }
      });
    } catch {}
    if (_0x2411a8) {
      const _0x20fcb5 = tgBotToken();
      if (!_0x20fcb5) {
        return _0x172c72.sendMessage(_0x9ec0bb, {
          text: ["╔═|〔  🎭 TELEGRAM STICKER 〕", "║", "║ ▸ Pack downloads need a Telegram bot token.", "║ ▸ Ask owner to set *TELEGRAM_BOT_TOKEN* env var.", "║", "║ 💡 *Alternative*: Forward a Telegram sticker", "║    as a document then reply with *" + _0x576a80 + "telegramsticker*", "║", "╚═|〔 " + _0x449c0c + " 〕"].join("\n")
        }, {
          quoted: _0x4a403d
        });
      }
      const _0x2f3d25 = parsePack(_0x2411a8);
      await _0x172c72.sendMessage(_0x9ec0bb, {
        text: "╔═|〔  🎭 TELEGRAM STICKER 〕\n║\n║ ⏳ Fetching pack *" + _0x2f3d25 + "*...\n║\n╚═|〔 " + _0x449c0c + " 〕"
      }, {
        quoted: _0x4a403d
      });
      try {
        const _0x4685d5 = await tgApiGet("getStickerSet", {
          name: _0x2f3d25
        });
        const _0x4c242b = _0x4685d5.stickers || [];
        if (!_0x4c242b.length) {
          throw new Error("Sticker pack is empty");
        }
        await _0x172c72.sendMessage(_0x9ec0bb, {
          text: "╔═|〔  🎭 TELEGRAM STICKER 〕\n║\n║ ▸ *Pack*  : " + _0x4685d5.title + "\n║ ▸ *Count* : " + _0x4c242b.length + " stickers\n║ ▸ Sending first 5...\n║\n╚═|〔 " + _0x449c0c + " 〕"
        }, {
          quoted: _0x4a403d
        });
        const _0x1645d1 = _0x4c242b.slice(0, 5);
        for (const _0x2719f3 of _0x1645d1) {
          try {
            const _0x3da400 = await tgFileUrl(_0x2719f3.file_id);
            const _0x3d1428 = await downloadUrl(_0x3da400);
            const _0x11d895 = await toStickerWebp(_0x3d1428, _0x2719f3.is_animated || false);
            await _0x172c72.sendMessage(_0x9ec0bb, {
              sticker: _0x11d895
            }, {
              quoted: _0x4a403d
            });
            await new Promise(_0x59d94d => setTimeout(_0x59d94d, 800));
          } catch {}
        }
      } catch (_0x4aa50a) {
        await _0x172c72.sendMessage(_0x9ec0bb, {
          text: "╔═|〔  🎭 TELEGRAM STICKER 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x4aa50a.message + "\n║\n╚═|〔 " + _0x449c0c + " 〕"
        }, {
          quoted: _0x4a403d
        });
      }
      return;
    }
    const _0x1a11f5 = _0x4a403d.message?.extendedTextMessage?.contextInfo;
    const _0x2e5add = _0x1a11f5?.quotedMessage;
    const _0x31f5c2 = _0x2e5add?.documentMessage;
    const _0x388d2c = _0x2e5add?.imageMessage;
    const _0x28b670 = _0x2e5add?.stickerMessage;
    const _0x2275a2 = _0x2e5add?.videoMessage;
    if (!_0x2e5add || !_0x31f5c2 && !_0x388d2c && !_0x28b670 && !_0x2275a2) {
      return _0x172c72.sendMessage(_0x9ec0bb, {
        text: ["╔═|〔  🎭 TELEGRAM STICKER 〕", "║", "║ *Two ways to use this:*", "║", "║ 1️⃣  Reply to a Telegram sticker forwarded", "║      as a .webp file/document", "║", "║ 2️⃣  " + _0x576a80 + "telegramsticker <pack name or t.me link>", "║      (requires TELEGRAM_BOT_TOKEN to be set)", "║", "║ 💡 Example: " + _0x576a80 + "telegramsticker Animals", "║", "╚═|〔 " + _0x449c0c + " 〕"].join("\n")
      }, {
        quoted: _0x4a403d
      });
    }
    try {
      const _0x2b5664 = {
        key: {
          remoteJid: _0x9ec0bb,
          id: _0x1a11f5.stanzaId,
          participant: _0x1a11f5.participant,
          fromMe: false
        },
        message: _0x2e5add
      };
      const _0x592e2c = await downloadMediaMessage(_0x2b5664, "buffer", {});
      if (!_0x592e2c || _0x592e2c.length === 0) {
        throw new Error("Could not download media");
      }
      const _0x1f7a8d = _0x31f5c2?.mimetype || _0x388d2c?.mimetype || _0x28b670?.mimetype || "";
      const _0x5608bd = _0x1f7a8d.includes("tgs") || _0x28b670?.isAnimated || _0x1f7a8d.includes("video");
      const _0x42c7e4 = await toStickerWebp(_0x592e2c, _0x5608bd);
      await _0x172c72.sendMessage(_0x9ec0bb, {
        sticker: _0x42c7e4
      }, {
        quoted: _0x4a403d
      });
    } catch (_0x158947) {
      await _0x172c72.sendMessage(_0x9ec0bb, {
        text: "╔═|〔  🎭 TELEGRAM STICKER 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x158947.message + "\n║\n╚═|〔 " + _0x449c0c + " 〕"
      }, {
        quoted: _0x4a403d
      });
    }
  }
};