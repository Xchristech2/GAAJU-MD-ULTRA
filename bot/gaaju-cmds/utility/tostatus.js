const {
  downloadMediaMessage
} = require("@whiskeysockets/baileys");
module.exports = {
  name: "tostatus",
  aliases: ["poststatus", "setstatus"],
  description: "Post text / image / video / audio as the bot personal WhatsApp status",
  category: "utility",
  async execute(_0x3f7cf5, _0x3dc122, _0x67e512, _0x1b54e5, _0x54aa02) {
    const _0x57231d = _0x3dc122.key.remoteJid;
    try {
      await _0x3f7cf5.sendMessage(_0x57231d, {
        react: {
          text: "📤",
          key: _0x3dc122.key
        }
      });
    } catch {}
    if (!_0x54aa02?.isOwnerUser && !_0x54aa02?.isSudoUser) {
      return _0x3f7cf5.sendMessage(_0x57231d, {
        text: "╔═|〔  TO STATUS 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═╝"
      }, {
        quoted: _0x3dc122
      });
    }
    const _0x33216f = _0x3dc122.message?.extendedTextMessage?.contextInfo;
    const _0x442895 = _0x33216f?.quotedMessage;
    const _0x5b7543 = _0x67e512.join(" ").trim();
    let _0x10aeb1 = [];
    if (_0x57231d.endsWith("@g.us")) {
      try {
        const _0x2c3f7b = await _0x3f7cf5.groupMetadata(_0x57231d);
        _0x10aeb1 = _0x2c3f7b.participants.map(_0x30e703 => _0x30e703.id);
      } catch {}
    }
    const _0x37f7c3 = {
      statusJidList: _0x10aeb1,
      backgroundColor: "#25D366",
      font: 2
    };
    try {
      if (_0x442895) {
        const _0xdd8c87 = Object.keys(_0x442895)[0];
        const _0xc7c515 = _0xdd8c87 === "imageMessage";
        const _0x216178 = _0xdd8c87 === "videoMessage";
        const _0x5a97c2 = _0xdd8c87 === "audioMessage";
        if (_0xc7c515 || _0x216178 || _0x5a97c2) {
          const _0x808be1 = {
            key: {
              remoteJid: _0x57231d,
              id: _0x33216f.stanzaId,
              participant: _0x33216f.participant,
              fromMe: false
            },
            message: _0x442895
          };
          const _0x555077 = await downloadMediaMessage(_0x808be1, "buffer", {});
          if (!_0x555077?.length) {
            throw new Error("Could not download media");
          }
          if (_0xc7c515) {
            await _0x3f7cf5.sendMessage("status@broadcast", {
              image: _0x555077,
              caption: _0x5b7543 || ""
            }, _0x37f7c3);
          } else if (_0x216178) {
            await _0x3f7cf5.sendMessage("status@broadcast", {
              video: _0x555077,
              caption: _0x5b7543 || ""
            }, _0x37f7c3);
          } else {
            const _0x43e795 = _0x442895.audioMessage?.mimetype || "audio/ogg; codecs=opus";
            const _0x344be0 = _0x442895.audioMessage?.ptt || false;
            await _0x3f7cf5.sendMessage("status@broadcast", {
              audio: _0x555077,
              mimetype: _0x43e795,
              ptt: _0x344be0
            }, {
              ..._0x37f7c3,
              backgroundColor: "#000000"
            });
          }
          const _0x16d385 = _0xc7c515 ? "🖼️ Image" : _0x216178 ? "📹 Video" : "🎵 Audio";
          return _0x3f7cf5.sendMessage(_0x57231d, {
            text: "╔═|〔  TO STATUS 〕\n║\n║ ▸ *Type*     : " + _0x16d385 + "\n║ ▸ *Audience* : " + (_0x10aeb1.length || "all") + "\n║ ▸ *Status*   : ✅ Posted\n║\n╚═╝"
          }, {
            quoted: _0x3dc122
          });
        }
        if (!_0x5b7543) {
          const _0x246e05 = _0x442895?.conversation || _0x442895?.extendedTextMessage?.text || "";
          if (_0x246e05) {
            await _0x3f7cf5.sendMessage("status@broadcast", {
              text: _0x246e05
            }, _0x37f7c3);
            return _0x3f7cf5.sendMessage(_0x57231d, {
              text: "╔═|〔  TO STATUS 〕\n║\n║ ▸ *Type*     : 📝 Text\n║ ▸ *Audience* : " + (_0x10aeb1.length || "all") + "\n║ ▸ *Status*   : ✅ Posted\n║\n╚═╝"
            }, {
              quoted: _0x3dc122
            });
          }
        }
      }
      if (!_0x5b7543) {
        return _0x3f7cf5.sendMessage(_0x57231d, {
          text: ["╔═|〔  TO STATUS 〕", "║", "║ ▸ *Usage* : " + _0x1b54e5 + "tostatus <text>", "║  or reply image / video / audio", "║", "╚═╝"].join("\n")
        }, {
          quoted: _0x3dc122
        });
      }
      await _0x3f7cf5.sendMessage("status@broadcast", {
        text: _0x5b7543
      }, _0x37f7c3);
      return _0x3f7cf5.sendMessage(_0x57231d, {
        text: "╔═|〔  TO STATUS 〕\n║\n║ ▸ *Type*     : 📝 Text\n║ ▸ *Audience* : " + (_0x10aeb1.length || "all") + "\n║ ▸ *Status*   : ✅ Posted\n║\n╚═╝"
      }, {
        quoted: _0x3dc122
      });
    } catch (_0x3c5302) {
      return _0x3f7cf5.sendMessage(_0x57231d, {
        text: "╔═|〔  TO STATUS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x3c5302.message + "\n║\n╚═╝"
      }, {
        quoted: _0x3dc122
      });
    }
  }
};