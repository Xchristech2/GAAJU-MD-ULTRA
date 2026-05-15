'use strict';

const {
  keithGet,
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
function fmtSize(_0x414432) {
  if (!_0x414432) {
    return "? MB";
  }
  if (_0x414432 >= 1048576) {
    return (_0x414432 / 1024 / 1024).toFixed(1) + " MB";
  }
  return (_0x414432 / 1024).toFixed(0) + " KB";
}
function fmtNum(_0x3bd53d) {
  if (!_0x3bd53d) {
    return "0";
  }
  if (_0x3bd53d >= 1000000000) {
    return (_0x3bd53d / 1000000000).toFixed(1) + "B";
  }
  if (_0x3bd53d >= 1000000) {
    return (_0x3bd53d / 1000000).toFixed(0) + "M";
  }
  if (_0x3bd53d >= 1000) {
    return (_0x3bd53d / 1000).toFixed(0) + "K";
  }
  return String(_0x3bd53d);
}
module.exports = {
  name: "apk",
  aliases: ["apkdl", "getapk"],
  description: "Search and download APK from Aptoide",
  category: "download",
  async execute(_0x38c12f, _0x216046, _0x461187, _0x29a904, _0xef35e6) {
    const _0x13887f = _0x216046.key.remoteJid;
    const _0x3036a2 = getBotName();
    const _0x126d3b = _0x461187.join(" ").trim();
    const _0x4bbabb = "╔═|〔  APK DOWNLOADER 〕";
    const _0x579380 = "╚═|〔 " + _0x3036a2 + " 〕";
    if (!_0x126d3b) {
      return _0x38c12f.sendMessage(_0x13887f, {
        text: [_0x4bbabb, "║", "║ ▸ *Usage*   : " + _0x29a904 + "apk <app name>", "║ ▸ *Example* : " + _0x29a904 + "apk whatsapp", "║", _0x579380].join("\n")
      }, {
        quoted: _0x216046
      });
    }
    try {
      await _0x38c12f.sendMessage(_0x13887f, {
        react: {
          text: "🔍",
          key: _0x216046.key
        }
      });
      const _0x2d1f8c = await keithGet("/search/aptoide", {
        q: _0x126d3b
      });
      if (!_0x2d1f8c?.status) {
        throw new Error(_0x2d1f8c?.error || "Search failed");
      }
      const _0xcecff6 = _0x2d1f8c?.result?.datalist?.list;
      if (!_0xcecff6?.length) {
        throw new Error("No APK found for \"" + _0x126d3b + "\"");
      }
      const _0x2d3a28 = _0xcecff6.filter(_0x501a55 => _0x501a55.file?.path);
      const _0x573d40 = _0x126d3b.toLowerCase();
      const _0x42ff8a = _0x573d40.split(/\s+/);
      const _0x12c298 = _0x2d3a28.map(_0x536a40 => {
        const _0x2c4e97 = (_0x536a40.name || "").toLowerCase();
        let _0x10a237 = 0;
        if (_0x2c4e97 === _0x573d40) {
          _0x10a237 += 1000;
        }
        for (const _0x84230d of _0x42ff8a) {
          if (_0x2c4e97.includes(_0x84230d)) {
            _0x10a237 += 100;
          }
        }
        _0x10a237 += Math.log10(_0x536a40.stats?.downloads || 1);
        return {
          a: _0x536a40,
          score: _0x10a237
        };
      });
      const _0x1a196c = _0x12c298.sort((_0x3d0081, _0x805a5f) => _0x805a5f.score - _0x3d0081.score)[0]?.a;
      if (!_0x1a196c) {
        throw new Error("No downloadable APK found for \"" + _0x126d3b + "\"");
      }
      const _0x47a9c0 = _0x1a196c.name || _0x126d3b;
      const _0x28d6c7 = _0x1a196c.file?.vername || "?";
      const _0x3c9ba4 = _0x1a196c.file?.filesize || _0x1a196c.size || 0;
      const _0x479947 = _0x1a196c.developer?.name || "Unknown";
      const _0x379cc8 = _0x1a196c.stats?.rating?.avg ? _0x1a196c.stats.rating.avg.toFixed(1) + " ⭐" : "N/A";
      const _0x4df212 = fmtNum(_0x1a196c.stats?.downloads || 0);
      const _0x2866b0 = _0x1a196c.file?.path || _0x1a196c.file?.path_alt;
      const _0x1331b8 = _0x1a196c.icon || null;
      const _0x54c257 = _0x47a9c0.replace(/[^a-zA-Z0-9._-]/g, "_") + "_v" + _0x28d6c7 + ".apk";
      const _0x3e80bf = [_0x4bbabb, "║", "║ ▸ *App*        : " + _0x47a9c0, "║ ▸ *Version*    : v" + _0x28d6c7, "║ ▸ *Developer*  : " + _0x479947, "║ ▸ *Size*       : " + fmtSize(_0x3c9ba4), "║ ▸ *Rating*     : " + _0x379cc8, "║ ▸ *Downloads*  : " + _0x4df212, "║", _0x579380].join("\n");
      await _0x38c12f.sendMessage(_0x13887f, {
        react: {
          text: "⏬",
          key: _0x216046.key
        }
      });
      let _0x50c842 = null;
      if (_0x1331b8) {
        try {
          const _0xdd14c3 = await fetch(_0x1331b8, {
            signal: AbortSignal.timeout(8000)
          });
          if (_0xdd14c3.ok) {
            _0x50c842 = Buffer.from(await _0xdd14c3.arrayBuffer());
          }
        } catch {}
      }
      if (_0x3c9ba4 > 62914560) {
        await _0x38c12f.sendMessage(_0x13887f, {
          text: _0x3e80bf + "\n\n🔗 *Download Link*:\n" + _0x2866b0
        }, {
          quoted: _0x216046
        });
      } else {
        const _0x14ecb9 = await dlBuffer(_0x2866b0);
        const _0x212017 = {
          document: _0x14ecb9,
          mimetype: "application/vnd.android.package-archive",
          fileName: _0x54c257,
          caption: _0x3e80bf
        };
        if (_0x50c842) {
          _0x212017.jpegThumbnail = _0x50c842;
        }
        await _0x38c12f.sendMessage(_0x13887f, _0x212017, {
          quoted: _0x216046
        });
      }
      await _0x38c12f.sendMessage(_0x13887f, {
        react: {
          text: "✅",
          key: _0x216046.key
        }
      });
    } catch (_0xbd2430) {
      await _0x38c12f.sendMessage(_0x13887f, {
        react: {
          text: "❌",
          key: _0x216046.key
        }
      });
      await _0x38c12f.sendMessage(_0x13887f, {
        text: [_0x4bbabb, "║", "║ ▸ *Status* : ❌ Failed", "║ ▸ *Reason* : " + _0xbd2430.message, "║", _0x579380].join("\n")
      }, {
        quoted: _0x216046
      });
    }
  }
};