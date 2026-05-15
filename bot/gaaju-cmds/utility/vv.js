const {
  BOT_NAME
} = require("../../config");
const {
  resolvePhone
} = require("../../lib/groupUtils");
module.exports = {
  name: "vv",
  aliases: ["viewonce", "vo"],
  description: "Reveal a view-once photo/video/audio",
  category: "utility",
  async execute(_0x395ce8, _0x4d88ff, _0x54c854, _0x3bfbe3, _0x54736c) {
    const _0x1352e9 = _0x4d88ff.key.remoteJid;
    try {
      await _0x395ce8.sendMessage(_0x1352e9, {
        react: {
          text: "👁️",
          key: _0x4d88ff.key
        }
      });
    } catch {}
    const _0x5d554a = _0x4d88ff.key.participant || _0x4d88ff.key.remoteJid;
    const _0x1e8d90 = _0x1352e9.endsWith("@g.us");
    const _0x392d88 = await resolvePhone(_0x395ce8, _0x1352e9, _0x5d554a);
    const _0x3aefd2 = _0x392d88 + "@s.whatsapp.net";
    const _0x433f96 = _0x4d88ff.message?.extendedTextMessage?.contextInfo;
    const _0x23e8e8 = _0x433f96?.stanzaId;
    if (!_0x23e8e8 || !_0x433f96?.quotedMessage) {
      return _0x395ce8.sendMessage(_0x1352e9, {
        text: "╔═|〔  VIEW ONCE 〕\n║\n║ ▸ *Usage* : Reply to a view-once\n║           message with " + _0x3bfbe3 + "vv\n║ ▸ *Tip*   : Add \"group\" to post in chat\n║           " + _0x3bfbe3 + "vv group\n║\n╚═╝"
      }, {
        quoted: _0x4d88ff
      });
    }
    function _0x237445(_0x5630ee) {
      if (!_0x5630ee) {
        return null;
      }
      const _0x142695 = _0x5630ee.viewOnceMessageV2?.message || _0x5630ee.viewOnceMessageV2Extension?.message;
      if (_0x142695) {
        if (_0x142695.imageMessage) {
          return {
            type: "image",
            media: _0x142695.imageMessage
          };
        }
        if (_0x142695.videoMessage) {
          return {
            type: "video",
            media: _0x142695.videoMessage
          };
        }
        if (_0x142695.audioMessage) {
          return {
            type: "audio",
            media: _0x142695.audioMessage
          };
        }
      }
      const _0x49f9e0 = _0x5630ee.viewOnceMessage?.message;
      if (_0x49f9e0) {
        if (_0x49f9e0.imageMessage) {
          return {
            type: "image",
            media: _0x49f9e0.imageMessage
          };
        }
        if (_0x49f9e0.videoMessage) {
          return {
            type: "video",
            media: _0x49f9e0.videoMessage
          };
        }
        if (_0x49f9e0.audioMessage) {
          return {
            type: "audio",
            media: _0x49f9e0.audioMessage
          };
        }
      }
      const _0xbf71a2 = _0x5630ee.ephemeralMessage?.message;
      if (_0xbf71a2) {
        const _0x1b84f5 = _0xbf71a2.viewOnceMessageV2?.message || _0xbf71a2.viewOnceMessageV2Extension?.message;
        if (_0x1b84f5?.imageMessage) {
          return {
            type: "image",
            media: _0x1b84f5.imageMessage
          };
        }
        if (_0x1b84f5?.videoMessage) {
          return {
            type: "video",
            media: _0x1b84f5.videoMessage
          };
        }
        if (_0x1b84f5?.audioMessage) {
          return {
            type: "audio",
            media: _0x1b84f5.audioMessage
          };
        }
        const _0x44063e = _0xbf71a2.viewOnceMessage?.message;
        if (_0x44063e?.imageMessage) {
          return {
            type: "image",
            media: _0x44063e.imageMessage
          };
        }
        if (_0x44063e?.videoMessage) {
          return {
            type: "video",
            media: _0x44063e.videoMessage
          };
        }
        if (_0x44063e?.audioMessage) {
          return {
            type: "audio",
            media: _0x44063e.audioMessage
          };
        }
      }
      if (_0x5630ee.imageMessage?.viewOnce) {
        return {
          type: "image",
          media: _0x5630ee.imageMessage
        };
      }
      if (_0x5630ee.videoMessage?.viewOnce) {
        return {
          type: "video",
          media: _0x5630ee.videoMessage
        };
      }
      if (_0x5630ee.audioMessage?.viewOnce) {
        return {
          type: "audio",
          media: _0x5630ee.audioMessage
        };
      }
      return null;
    }
    const _0x3cbfeb = globalThis.viewOnceCache_ref;
    const _0x47d539 = _0x3cbfeb?.get(_0x1352e9 + "|" + _0x23e8e8) || _0x3cbfeb?.get(_0x23e8e8);
    const _0x4ced21 = _0x47d539?.message || _0x47d539 || _0x433f96.quotedMessage;
    const _0x37545d = _0x237445(_0x4ced21);
    if (!_0x37545d) {
      return _0x395ce8.sendMessage(_0x1352e9, {
        text: "╔═|〔  VIEW ONCE 〕\n║\n║ ▸ *Status* : ❌ Not a view-once message\n║ ▸ *Tip*    : Reply directly to the\n║             view-once message\n║\n╚═╝"
      }, {
        quoted: _0x4d88ff
      });
    }
    try {
      const {
        downloadMediaMessage: _0x3f9f0f
      } = require("@whiskeysockets/baileys");
      const _0x57c560 = {
        key: {
          remoteJid: _0x1352e9,
          id: _0x23e8e8,
          participant: _0x433f96.participant || undefined,
          fromMe: false
        },
        message: _0x4ced21
      };
      const _0x316e4c = await _0x3f9f0f(_0x57c560, "buffer", {});
      if (!_0x316e4c || _0x316e4c.length === 0) {
        throw new Error("Empty buffer — media key may be stripped from view-once quote");
      }
      const _0x49c203 = _0x433f96?.participant || _0x5d554a;
      const _0x8b05d6 = await resolvePhone(_0x395ce8, _0x1352e9, _0x49c203);
      const _0x4c9833 = _0x54736c?.BOT_NAME || BOT_NAME || "Toosii AI";
      const _0x21cb34 = new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      let _0x1f725a = "";
      if (_0x1e8d90) {
        try {
          _0x1f725a = (await _0x395ce8.groupMetadata(_0x1352e9)).subject;
        } catch {}
      }
      const {
        type: _0x57f4c3,
        media: _0x358afc
      } = _0x37545d;
      const _0x293589 = _0x54c854[0]?.toLowerCase() === "group";
      const _0x474f87 = _0x293589 ? _0x1352e9 : _0x3aefd2;
      const _0x537d8f = "╔═|〔  VIEW ONCE 〕\n║\n║ ▸ *Sent by*   : +" + (_0x8b05d6 || "Unknown") + "\n║ ▸ *Via*       : " + _0x4c9833 + " (Manual)\n║ ▸ *Time*      : " + _0x21cb34 + "\n║ ▸ *" + (_0x1f725a ? "Group*     : " + _0x1f725a : "Chat*      : Private") + "\n║\n╚═╝";
      if (_0x57f4c3 === "image") {
        await _0x395ce8.sendMessage(_0x474f87, {
          image: _0x316e4c,
          caption: _0x537d8f
        });
      } else if (_0x57f4c3 === "video") {
        await _0x395ce8.sendMessage(_0x474f87, {
          video: _0x316e4c,
          caption: _0x537d8f
        });
      } else if (_0x57f4c3 === "audio") {
        await _0x395ce8.sendMessage(_0x474f87, {
          audio: _0x316e4c,
          mimetype: _0x358afc.mimetype || "audio/ogg; codecs=opus",
          ptt: _0x358afc.ptt || false
        });
        await _0x395ce8.sendMessage(_0x474f87, {
          text: _0x537d8f
        });
      }
      if (_0x1e8d90 && !_0x293589) {
        await _0x395ce8.sendMessage(_0x1352e9, {
          text: "╔═|〔  VIEW ONCE 〕\n║\n║ ▸ *Status* : ✅ Sent to your DM\n║ ▸ *User*   : @" + _0x392d88 + "\n║\n╚═╝",
          mentions: [_0x3aefd2]
        }, {
          quoted: _0x4d88ff
        });
      }
    } catch (_0x25530e) {
      await _0x395ce8.sendMessage(_0x1352e9, {
        text: "╔═|〔  VIEW ONCE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x25530e.message + "\n║\n╚═╝"
      }, {
        quoted: _0x4d88ff
      });
    }
  }
};