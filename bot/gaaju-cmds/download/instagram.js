const {
  casperGet,
  keithTry,
  extractUrl,
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "ig",
  aliases: ["insta", "instagram", "instadl"],
  description: "Download Instagram post/reel/story",
  category: "download",
  async execute(_0x1fa52f, _0x489bc3, _0x3567b5, _0x6f82b6, _0x2aa3e2) {
    const _0x1bedb9 = _0x489bc3.key.remoteJid;
    const _0x2e5680 = getBotName();
    const _0x3861b3 = _0x3567b5[0];
    if (!_0x3861b3) {
      return _0x1fa52f.sendMessage(_0x1bedb9, {
        text: "╔═|〔  INSTAGRAM 〕\n║\n║ ▸ *Usage* : " + _0x6f82b6 + "ig <url>\n║\n╚═|〔 " + _0x2e5680 + " 〕"
      }, {
        quoted: _0x489bc3
      });
    }
    try {
      let _0x5a9ede;
      let _0x3dfb1f;
      try {
        const _0x3ec485 = await casperGet("/api/downloader/ig", {
          url: _0x3861b3
        });
        if (_0x3ec485.success) {
          _0x5a9ede = _0x3ec485.download_url || _0x3ec485.all_media?.[0]?.url;
          if (_0x5a9ede) {
            _0x3dfb1f = _0x5a9ede.includes(".mp4") || _0x3ec485.type === "video";
          }
        }
      } catch {}
      if (!_0x5a9ede) {
        try {
          const _0x55c923 = await casperGet("/api/downloader/reelsvideo", {
            url: _0x3861b3
          });
          if (_0x55c923.success) {
            if (_0x55c923.videos?.length) {
              _0x5a9ede = _0x55c923.videos[0]?.url || _0x55c923.videos[0]?.download_url;
              _0x3dfb1f = true;
            } else if (_0x55c923.images?.length) {
              _0x5a9ede = _0x55c923.images[0]?.url || _0x55c923.images[0];
              _0x3dfb1f = false;
            }
          }
        } catch {}
      }
      if (!_0x5a9ede) {
        const _0x2c40d8 = await keithTry(["/download/instadl", "/download/instaposts"], {
          url: _0x3861b3
        });
        _0x5a9ede = extractUrl(_0x2c40d8.result);
        if (!_0x5a9ede) {
          throw new Error("No download URL found");
        }
        _0x3dfb1f = _0x5a9ede.includes(".mp4") || _0x5a9ede.includes("video");
      }
      const _0x3e5ccb = await dlBuffer(_0x5a9ede);
      const _0x5f16e3 = "╔═|〔  INSTAGRAM 〕\n║\n║ ▸ *Type* : " + (_0x3dfb1f ? "📹 Video" : "🖼️ Image") + "\n║ ▸ *Size* : " + (_0x3e5ccb.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x2e5680 + " 〕";
      if (_0x3dfb1f) {
        await _0x1fa52f.sendMessage(_0x1bedb9, {
          video: _0x3e5ccb,
          caption: _0x5f16e3
        }, {
          quoted: _0x489bc3
        });
      } else {
        await _0x1fa52f.sendMessage(_0x1bedb9, {
          image: _0x3e5ccb,
          caption: _0x5f16e3
        }, {
          quoted: _0x489bc3
        });
      }
    } catch (_0x580a55) {
      await _0x1fa52f.sendMessage(_0x1bedb9, {
        text: "╔═|〔  INSTAGRAM 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x580a55.message + "\n║\n╚═|〔 " + _0x2e5680 + " 〕"
      }, {
        quoted: _0x489bc3
      });
    }
  }
};