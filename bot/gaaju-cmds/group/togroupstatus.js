const {
  downloadContentFromMessage,
  generateWAMessageContent,
  generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const {
  getBotName
} = require("../../lib/botname");
const crypto = require("crypto");
async function downloadToBuffer(_0x4b2822, _0x5227a9) {
  const _0x58fa89 = await downloadContentFromMessage(_0x4b2822, _0x5227a9);
  let _0x39a54c = Buffer.from([]);
  for await (const _0x518275 of _0x58fa89) {
    _0x39a54c = Buffer.concat([_0x39a54c, _0x518275]);
  }
  return _0x39a54c;
}
async function sendGroupStatus(_0x3a943f, _0x719de5, _0x2439bb) {
  const _0x14d18c = await generateWAMessageContent(_0x2439bb, {
    upload: _0x3a943f.waUploadToServer
  });
  const _0x31197f = crypto.randomBytes(32);
  const _0x123436 = generateWAMessageFromContent(_0x719de5, {
    messageContextInfo: {
      messageSecret: _0x31197f
    },
    groupStatusMessageV2: {
      message: {
        ..._0x14d18c,
        messageContextInfo: {
          messageSecret: _0x31197f
        }
      }
    }
  }, {});
  await _0x3a943f.relayMessage(_0x719de5, _0x123436.message, {
    messageId: _0x123436.key.id
  });
  return _0x123436;
}
module.exports = {
  name: "togroupstatus",
  aliases: ["groupstatus", "gstatus"],
  description: "Post text / image / video / audio to the group status (Updates tab)",
  category: "group",
  async execute(_0x3f9a1c, _0x413a9f, _0x4bf6e9, _0x42cf12, _0x4b12de) {
    const _0x3576ee = _0x413a9f.key.remoteJid;
    const _0x2d7a7b = getBotName();
    const _0x27da0a = "╚═|〔 " + _0x2d7a7b + " 〕";
    if (!_0x4b12de?.isOwnerUser && !_0x4b12de?.isSudoUser && !_0x4b12de?.isGroupAdmin) {
      return _0x3f9a1c.sendMessage(_0x3576ee, {
        text: "╔═|〔  GROUP STATUS 〕\n║\n║ ▸ *Status* : ❌ Admins/Owner only\n║\n" + _0x27da0a
      }, {
        quoted: _0x413a9f
      });
    }
    if (!_0x3576ee.endsWith("@g.us")) {
      return _0x3f9a1c.sendMessage(_0x3576ee, {
        text: "╔═|〔  GROUP STATUS 〕\n║\n║ ▸ *Status* : ❌ Groups only\n║\n" + _0x27da0a
      }, {
        quoted: _0x413a9f
      });
    }
    const _0x98327a = _0x413a9f.message?.extendedTextMessage?.contextInfo;
    const _0x522b12 = _0x98327a?.quotedMessage;
    const _0x2c6827 = _0x4bf6e9.join(" ").trim();
    const _0x19cc1d = {
      red: "#FF6B6B",
      blue: "#34B7F1",
      green: "#25D366",
      black: "#000000",
      purple: "#8B5CF6",
      yellow: "#F59E0B",
      teal: "#128C7E"
    };
    let _0x44536e = "#25D366";
    let _0x161c91 = _0x2c6827;
    const _0x18f477 = _0x2c6827.match(/^(#[0-9a-fA-F]{3,6}|red|blue|green|black|purple|yellow|teal)\s*(.*)/i);
    if (_0x18f477) {
      _0x44536e = _0x19cc1d[_0x18f477[1].toLowerCase()] || _0x18f477[1];
      _0x161c91 = _0x18f477[2].trim();
    }
    if (!_0x161c91 && !_0x522b12) {
      return _0x3f9a1c.sendMessage(_0x3576ee, {
        text: ["╔═|〔  GROUP STATUS 〕", "║", "║ ▸ *Usage* :", "║   " + _0x42cf12 + "gstatus <text>", "║   " + _0x42cf12 + "gstatus <color> <text>", "║   Reply image/video/audio + " + _0x42cf12 + "gstatus", "║", "║ ▸ *Colors* : red blue green black", "║   purple yellow teal  or  #hex", "║", "" + _0x27da0a].join("\n")
      }, {
        quoted: _0x413a9f
      });
    }
    try {
      let _0x13e126 = null;
      let _0x16e280 = "📝 Text";
      if (_0x522b12) {
        if (_0x522b12.videoMessage) {
          const _0xc27d43 = await downloadToBuffer(_0x522b12.videoMessage, "video");
          _0x13e126 = {
            video: _0xc27d43,
            caption: _0x161c91 || _0x522b12.videoMessage.caption || "",
            mimetype: _0x522b12.videoMessage.mimetype || "video/mp4"
          };
          _0x16e280 = "📹 Video";
        } else if (_0x522b12.imageMessage) {
          const _0x428328 = await downloadToBuffer(_0x522b12.imageMessage, "image");
          _0x13e126 = {
            image: _0x428328,
            caption: _0x161c91 || _0x522b12.imageMessage.caption || ""
          };
          _0x16e280 = "🖼️ Image";
        } else if (_0x522b12.audioMessage) {
          const _0x5daba6 = await downloadToBuffer(_0x522b12.audioMessage, "audio");
          _0x13e126 = {
            audio: _0x5daba6,
            mimetype: _0x522b12.audioMessage.mimetype || "audio/mpeg",
            ptt: _0x522b12.audioMessage.ptt || false
          };
          _0x16e280 = "🎵 Audio";
        } else {
          const _0x490356 = _0x522b12.conversation || _0x522b12.extendedTextMessage?.text || _0x161c91;
          _0x13e126 = {
            text: _0x490356 || _0x161c91
          };
        }
      }
      if (!_0x13e126) {
        _0x13e126 = {
          text: _0x161c91
        };
      }
      if (_0x13e126.text && !_0x13e126.image && !_0x13e126.video && !_0x13e126.audio) {
        _0x13e126 = {
          ..._0x13e126,
          backgroundColor: _0x44536e,
          font: 2
        };
      }
      await sendGroupStatus(_0x3f9a1c, _0x3576ee, _0x13e126);
      return _0x3f9a1c.sendMessage(_0x3576ee, {
        text: "╔═|〔  GROUP STATUS 〕\n║\n║ ▸ *Type*   : " + _0x16e280 + "\n║ ▸ *Status* : ✅ Posted\n║\n" + _0x27da0a
      }, {
        quoted: _0x413a9f
      });
    } catch (_0x183183) {
      console.error("[GS] ERROR:", _0x183183.message);
      return _0x3f9a1c.sendMessage(_0x3576ee, {
        text: "╔═|〔  GROUP STATUS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x183183.message + "\n║\n" + _0x27da0a
      }, {
        quoted: _0x413a9f
      });
    }
  }
};