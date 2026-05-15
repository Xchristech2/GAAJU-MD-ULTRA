'use strict';

const {
  getBotName
} = require("../../lib/botname");
const BASE = "https://apiskeith.top";
async function kFetch(_0x45d3a7) {
  const _0x47be65 = await fetch("" + BASE + _0x45d3a7, {
    signal: AbortSignal.timeout(20000)
  });
  if (!_0x47be65.ok) {
    throw new Error("HTTP " + _0x47be65.status);
  }
  return _0x47be65.json();
}
const xvideosSearchCmd = {
  name: "xvideossearch",
  aliases: ["xvs", "xvsearch"],
  description: "Search for videos on XVideos",
  category: "adult",
  async execute(_0x4b3d1b, _0x17f86b, _0xb508fa, _0x2768cf) {
    const _0x5cd771 = _0x17f86b.key.remoteJid;
    const _0x5d587c = getBotName();
    try {
      await _0x4b3d1b.sendMessage(_0x5cd771, {
        react: {
          text: "🔞",
          key: _0x17f86b.key
        }
      });
    } catch {}
    const _0x306a57 = _0xb508fa.join(" ").trim();
    if (!_0x306a57) {
      return _0x4b3d1b.sendMessage(_0x5cd771, {
        text: "╔═|〔  XVIDEOS SEARCH 〕\n║\n║ ▸ *Usage*   : " + _0x2768cf + "xvs <query>\n║ ▸ *Example* : " + _0x2768cf + "xvs big booty\n║\n╚═|〔 " + _0x5d587c + " 〕"
      }, {
        quoted: _0x17f86b
      });
    }
    try {
      const _0x3d1d5c = await kFetch("/search/xvideos?q=" + encodeURIComponent(_0x306a57));
      const _0x29d632 = _0x3d1d5c.result || [];
      if (!_0x29d632.length) {
        return _0x4b3d1b.sendMessage(_0x5cd771, {
          text: "╔═|〔  XVIDEOS SEARCH 〕\n║\n║ ▸ *Query* : " + _0x306a57 + "\n║ ▸ No results found\n║\n╚═|〔 " + _0x5d587c + " 〕"
        }, {
          quoted: _0x17f86b
        });
      }
      const _0x34a4ac = _0x29d632.slice(0, 6);
      const _0x5f1485 = ["╔═|〔  🔞 XVIDEOS SEARCH 〕", "║", "║ ▸ *Query* : " + _0x306a57, "║ ▸ *Found* : " + _0x29d632.length + " results", "║"];
      _0x34a4ac.forEach((_0xfb21ab, _0x1f9bd5) => {
        _0x5f1485.push("║ " + (_0x1f9bd5 + 1) + ". *" + _0xfb21ab.title + "*");
        if (_0xfb21ab.duration) {
          _0x5f1485.push("║    ⏱️ " + _0xfb21ab.duration);
        }
        _0x5f1485.push("║    🔗 " + _0xfb21ab.url);
        _0x5f1485.push("║");
      });
      _0x5f1485.push("║ 💡 Use *" + _0x2768cf + "xvdl <url>* to download");
      _0x5f1485.push("╚═|〔 " + _0x5d587c + " 〕");
      return _0x4b3d1b.sendMessage(_0x5cd771, {
        text: _0x5f1485.join("\n")
      }, {
        quoted: _0x17f86b
      });
    } catch (_0x2a1ea3) {
      return _0x4b3d1b.sendMessage(_0x5cd771, {
        text: "╔═|〔  XVIDEOS SEARCH 〕\n║\n║ ▸ ❌ Error: " + _0x2a1ea3.message + "\n║\n╚═|〔 " + _0x5d587c + " 〕"
      }, {
        quoted: _0x17f86b
      });
    }
  }
};
const xvideosDownloadCmd = {
  name: "xvideosdownload",
  aliases: ["xvdl", "xvdownload"],
  description: "Download a video from XVideos",
  category: "adult",
  async execute(_0x30e326, _0x5e0964, _0x4c1e1a, _0x30d4da) {
    const _0x25efa5 = _0x5e0964.key.remoteJid;
    const _0xaa65f9 = getBotName();
    try {
      await _0x30e326.sendMessage(_0x25efa5, {
        react: {
          text: "⏬",
          key: _0x5e0964.key
        }
      });
    } catch {}
    const _0x574ec3 = _0x4c1e1a[0]?.trim();
    if (!_0x574ec3 || !_0x574ec3.includes("xvideos.com")) {
      return _0x30e326.sendMessage(_0x25efa5, {
        text: "╔═|〔  XVIDEOS DOWNLOAD 〕\n║\n║ ▸ *Usage*   : " + _0x30d4da + "xvdl <xvideos-url>\n║ ▸ *Example* : " + _0x30d4da + "xvdl https://www.xvideos.com/video.xxx\n║\n╚═|〔 " + _0xaa65f9 + " 〕"
      }, {
        quoted: _0x5e0964
      });
    }
    try {
      const _0x5dae52 = await kFetch("/download/xvideos?url=" + encodeURIComponent(_0x574ec3));
      const _0x2de9e0 = _0x5dae52.result;
      if (!_0x2de9e0?.download_url) {
        throw new Error("No download URL returned");
      }
      await _0x30e326.sendMessage(_0x25efa5, {
        text: ["╔═|〔  🔞 XVIDEOS DOWNLOAD 〕", "║", "║ ▸ *Title* : " + _0x2de9e0.title, "║ ▸ *Size*  : " + (_0x2de9e0.size || "unknown"), "║ ▸ *Views* : " + (_0x2de9e0.views || "N/A"), "║", "╚═|〔 " + _0xaa65f9 + " 〕"].join("\n")
      }, {
        quoted: _0x5e0964
      });
      return _0x30e326.sendMessage(_0x25efa5, {
        video: {
          url: _0x2de9e0.download_url
        },
        caption: "🔞 *" + _0x2de9e0.title + "*\n📦 " + (_0x2de9e0.size || "") + "\n\n> " + _0xaa65f9,
        mimetype: "video/mp4"
      }, {
        quoted: _0x5e0964
      });
    } catch (_0x3c49ad) {
      return _0x30e326.sendMessage(_0x25efa5, {
        text: "╔═|〔  XVIDEOS DOWNLOAD 〕\n║\n║ ▸ ❌ Error: " + _0x3c49ad.message + "\n║\n╚═|〔 " + _0xaa65f9 + " 〕"
      }, {
        quoted: _0x5e0964
      });
    }
  }
};
const xnxxSearchCmd = {
  name: "xnxxsearch",
  aliases: ["xns", "xnxxs"],
  description: "Search for videos on XNXX",
  category: "adult",
  async execute(_0x575db1, _0x346047, _0x57bbb7, _0x41f090) {
    const _0x4aec08 = _0x346047.key.remoteJid;
    const _0x552f5c = getBotName();
    try {
      await _0x575db1.sendMessage(_0x4aec08, {
        react: {
          text: "🔞",
          key: _0x346047.key
        }
      });
    } catch {}
    const _0x2c0122 = _0x57bbb7.join(" ").trim();
    if (!_0x2c0122) {
      return _0x575db1.sendMessage(_0x4aec08, {
        text: "╔═|〔  XNXX SEARCH 〕\n║\n║ ▸ *Usage*   : " + _0x41f090 + "xns <query>\n║ ▸ *Example* : " + _0x41f090 + "xns milf\n║\n╚═|〔 " + _0x552f5c + " 〕"
      }, {
        quoted: _0x346047
      });
    }
    try {
      const _0x42b476 = await kFetch("/search/xnxx?q=" + encodeURIComponent(_0x2c0122));
      const _0x4f854b = _0x42b476.result || [];
      if (!_0x4f854b.length) {
        return _0x575db1.sendMessage(_0x4aec08, {
          text: "╔═|〔  XNXX SEARCH 〕\n║\n║ ▸ *Query* : " + _0x2c0122 + "\n║ ▸ No results found\n║\n╚═|〔 " + _0x552f5c + " 〕"
        }, {
          quoted: _0x346047
        });
      }
      const _0x3f693b = _0x4f854b.slice(0, 6);
      const _0x32efa0 = ["╔═|〔  🔞 XNXX SEARCH 〕", "║", "║ ▸ *Query* : " + _0x2c0122, "║ ▸ *Found* : " + _0x4f854b.length + " results", "║"];
      _0x3f693b.forEach((_0x4008f8, _0x121ae6) => {
        _0x32efa0.push("║ " + (_0x121ae6 + 1) + ". *" + _0x4008f8.title + "*");
        _0x32efa0.push("║    🔗 " + _0x4008f8.link);
        _0x32efa0.push("║");
      });
      _0x32efa0.push("║ 💡 Use *" + _0x41f090 + "xndl <url>* to download");
      _0x32efa0.push("╚═|〔 " + _0x552f5c + " 〕");
      return _0x575db1.sendMessage(_0x4aec08, {
        text: _0x32efa0.join("\n")
      }, {
        quoted: _0x346047
      });
    } catch (_0x1fdb15) {
      return _0x575db1.sendMessage(_0x4aec08, {
        text: "╔═|〔  XNXX SEARCH 〕\n║\n║ ▸ ❌ Error: " + _0x1fdb15.message + "\n║\n╚═|〔 " + _0x552f5c + " 〕"
      }, {
        quoted: _0x346047
      });
    }
  }
};
const xnxxDownloadCmd = {
  name: "xnxxdownload",
  aliases: ["xndl", "xnxxdl"],
  description: "Download a video from XNXX",
  category: "adult",
  async execute(_0x1c33f4, _0x5e6710, _0x1cba81, _0x3606e1) {
    const _0x40baf8 = _0x5e6710.key.remoteJid;
    const _0x5d0c8b = getBotName();
    try {
      await _0x1c33f4.sendMessage(_0x40baf8, {
        react: {
          text: "⏬",
          key: _0x5e6710.key
        }
      });
    } catch {}
    const _0x1ab56c = _0x1cba81[0]?.trim();
    if (!_0x1ab56c || !_0x1ab56c.includes("xnxx.com")) {
      return _0x1c33f4.sendMessage(_0x40baf8, {
        text: "╔═|〔  XNXX DOWNLOAD 〕\n║\n║ ▸ *Usage*   : " + _0x3606e1 + "xndl <xnxx-url>\n║ ▸ *Example* : " + _0x3606e1 + "xndl https://www.xnxx.com/video-xxx\n║\n╚═|〔 " + _0x5d0c8b + " 〕"
      }, {
        quoted: _0x5e6710
      });
    }
    try {
      const _0x351580 = await kFetch("/download/xnxx?url=" + encodeURIComponent(_0x1ab56c));
      const _0x10bb7a = _0x351580.result;
      const _0x22c8cd = _0x10bb7a?.files?.low || _0x10bb7a?.files?.high || _0x10bb7a?.download_url;
      if (!_0x22c8cd) {
        throw new Error("No download URL returned");
      }
      await _0x1c33f4.sendMessage(_0x40baf8, {
        text: ["╔═|〔  🔞 XNXX DOWNLOAD 〕", "║", "║ ▸ *Title*    : " + _0x10bb7a.title, "║ ▸ *Duration* : " + (_0x10bb7a.duration ? Math.round(_0x10bb7a.duration / 60) + " min" : "N/A"), "║ ▸ *Quality*  : " + (_0x10bb7a.info || "N/A"), "║", "╚═|〔 " + _0x5d0c8b + " 〕"].join("\n")
      }, {
        quoted: _0x5e6710
      });
      return _0x1c33f4.sendMessage(_0x40baf8, {
        video: {
          url: _0x22c8cd
        },
        caption: "🔞 *" + _0x10bb7a.title + "*\n\n> " + _0x5d0c8b,
        mimetype: "video/mp4"
      }, {
        quoted: _0x5e6710
      });
    } catch (_0x2a56f0) {
      return _0x1c33f4.sendMessage(_0x40baf8, {
        text: "╔═|〔  XNXX DOWNLOAD 〕\n║\n║ ▸ ❌ Error: " + _0x2a56f0.message + "\n║\n╚═|〔 " + _0x5d0c8b + " 〕"
      }, {
        quoted: _0x5e6710
      });
    }
  }
};
const hentaiCmd = {
  name: "hentai",
  aliases: ["hentaivid", "hentaivideo", "hentai18"],
  description: "Get a random hentai video",
  category: "adult",
  async execute(_0x247d28, _0x45a6ef, _0x14489e, _0x3568f0) {
    const _0x1550a0 = _0x45a6ef.key.remoteJid;
    const _0x1d72ce = getBotName();
    try {
      await _0x247d28.sendMessage(_0x1550a0, {
        react: {
          text: "🔞",
          key: _0x45a6ef.key
        }
      });
    } catch {}
    try {
      const _0x3a10de = await kFetch("/dl/hentaivid");
      const _0x598ab8 = (_0x3a10de.result || [])[0];
      if (!_0x598ab8) {
        throw new Error("No hentai result returned");
      }
      const _0x28891e = _0x598ab8.media?.video_url || _0x598ab8.media?.fallback_url;
      if (!_0x28891e) {
        throw new Error("No video URL in response");
      }
      return _0x247d28.sendMessage(_0x1550a0, {
        video: {
          url: _0x28891e
        },
        caption: ["╔═|〔  🔞 HENTAI 〕", "║", "║ ▸ *Title*    : " + _0x598ab8.title, "║ ▸ *Category* : " + (_0x598ab8.category || "N/A"), "║ ▸ *Views*    : " + (_0x598ab8.views_count || "N/A"), "║", "╚═|〔 " + _0x1d72ce + " 〕"].join("\n"),
        mimetype: "video/mp4"
      }, {
        quoted: _0x45a6ef
      });
    } catch (_0x2a493e) {
      return _0x247d28.sendMessage(_0x1550a0, {
        text: "╔═|〔  HENTAI 〕\n║\n║ ▸ ❌ Error: " + _0x2a493e.message + "\n║\n╚═|〔 " + _0x1d72ce + " 〕"
      }, {
        quoted: _0x45a6ef
      });
    }
  }
};
module.exports = [xvideosSearchCmd, xvideosDownloadCmd, xnxxSearchCmd, xnxxDownloadCmd, hentaiCmd];