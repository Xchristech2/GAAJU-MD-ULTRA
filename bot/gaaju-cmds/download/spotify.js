const {
  casperGet,
  keithGet,
  dlBuffer,
  convertTo128kbps
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "spotify",
  aliases: ["sp", "spotifydl"],
  description: "Download Spotify track as MP3",
  category: "download",
  async execute(_0x436a8a, _0x4d01af, _0x30b443, _0x2ffd10, _0x491853) {
    const _0x2585d9 = _0x4d01af.key.remoteJid;
    const _0x3775ee = getBotName();
    const _0x53483b = _0x30b443[0];
    if (!_0x53483b) {
      return _0x436a8a.sendMessage(_0x2585d9, {
        text: "╔═|〔  SPOTIFY 〕\n║\n║ ▸ *Usage* : " + _0x2ffd10 + "spotify <track_url>\n║\n╚═|〔 " + _0x3775ee + " 〕"
      }, {
        quoted: _0x4d01af
      });
    }
    try {
      let _0x55fffc;
      let _0x3a1540;
      let _0x2d925d;
      const _0x1ae5d2 = ["/api/downloader/spotify", "/api/downloader/spotify2", "/api/downloader/spotify3"];
      let _0x5461ae = false;
      for (const _0x22d0de of _0x1ae5d2) {
        try {
          const _0x581a8a = await casperGet(_0x22d0de, {
            url: _0x53483b
          });
          if (!_0x581a8a.success) {
            continue;
          }
          const _0x429cfc = _0x581a8a.download?.url;
          if (!_0x429cfc) {
            continue;
          }
          _0x3a1540 = ((_0x581a8a.track?.title || "track") + " - " + (_0x581a8a.track?.artist || "")).trim().replace(/\s*-\s*$/, "");
          _0x2d925d = _0x581a8a.download?.quality || _0x581a8a.download?.format || "HQ";
          _0x55fffc = await dlBuffer(_0x429cfc);
          _0x5461ae = true;
          break;
        } catch {}
      }
      if (!_0x5461ae) {
        for (const _0x3040d8 of ["/api/downloader/sportify", "/api/downloader/sportify2"]) {
          try {
            const _0x315840 = await casperGet(_0x3040d8, {
              url: _0x53483b
            });
            if (!_0x315840.success) {
              continue;
            }
            const _0x5bc6f2 = _0x315840.track?.download_url || _0x315840.track?.url || _0x315840.track?.mp3_url;
            if (!_0x5bc6f2) {
              continue;
            }
            _0x3a1540 = ((_0x315840.track?.title || "track") + " - " + (_0x315840.track?.artist || "")).trim().replace(/\s*-\s*$/, "");
            _0x2d925d = _0x315840.track?.quality || "128kbps";
            _0x55fffc = await dlBuffer(_0x5bc6f2);
            _0x5461ae = true;
            break;
          } catch {}
        }
      }
      if (!_0x5461ae) {
        const _0x183902 = await keithGet("/download/spotify", {
          url: _0x53483b
        });
        if (!_0x183902.status) {
          throw new Error(_0x183902.error || "fallback failed");
        }
        const _0x5776f = _0x183902.result?.url || _0x183902.result;
        if (!_0x5776f) {
          throw new Error("No fallback URL");
        }
        _0x55fffc = await dlBuffer(_0x5776f);
        _0x55fffc = await convertTo128kbps(_0x55fffc);
        _0x3a1540 = "track";
        _0x2d925d = "128kbps";
      }
      const _0x3b852b = "╔═|〔  SPOTIFY 〕\n║\n║ ▸ *Track*   : " + _0x3a1540 + "\n║ ▸ *Quality* : " + _0x2d925d + "\n║ ▸ *Size*    : " + (_0x55fffc.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x3775ee + " 〕";
      await _0x436a8a.sendMessage(_0x2585d9, {
        document: _0x55fffc,
        mimetype: "audio/mpeg",
        fileName: _0x3a1540 + ".mp3",
        caption: _0x3b852b
      }, {
        quoted: _0x4d01af
      });
    } catch (_0x4ba6a0) {
      await _0x436a8a.sendMessage(_0x2585d9, {
        text: "╔═|〔  SPOTIFY 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x4ba6a0.message + "\n║\n╚═|〔 " + _0x3775ee + " 〕"
      }, {
        quoted: _0x4d01af
      });
    }
  }
};