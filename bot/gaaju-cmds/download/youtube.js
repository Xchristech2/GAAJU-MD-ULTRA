const {
  casperGet,
  keithTry,
  extractUrl,
  dlBuffer,
  convertTo128kbps
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
const KEITH_AUDIO = ["/download/ytmp3", "/download/audio", "/download/dlmp3", "/download/mp3", "/download/yta", "/download/yta2", "/download/yta3", "/download/yta4", "/download/yta5"];
const KEITH_VIDEO = ["/download/ytmp4", "/download/video", "/download/dlmp4", "/download/mp4", "/download/ytv", "/download/ytv2", "/download/ytv3", "/download/ytv4", "/download/ytv5"];
async function tryCasperAudio(_0x1ba6c2) {
  try {
    const _0x4cf429 = await casperGet("/api/downloader/ytmp3", {
      url: _0x1ba6c2,
      quality: "128"
    });
    if (_0x4cf429.success && _0x4cf429.url) {
      return {
        dlUrl: _0x4cf429.url,
        title: _0x4cf429.title || "audio",
        quality: _0x4cf429.quality || "128kbps"
      };
    }
  } catch {}
  try {
    const _0x109f24 = await casperGet("/api/downloader/yt-audio", {
      url: _0x1ba6c2
    });
    if (_0x109f24.success && _0x109f24.audios?.length) {
      const _0x2adfdd = _0x109f24.audios[0];
      return {
        dlUrl: _0x2adfdd.url,
        title: _0x109f24.title || "audio",
        quality: _0x2adfdd.quality || _0x2adfdd.label || "HQ"
      };
    }
  } catch {}
  try {
    const _0x4fcdee = await casperGet("/api/downloader/ytmp5", {
      url: _0x1ba6c2
    });
    if (_0x4fcdee.success && _0x4fcdee.url) {
      return {
        dlUrl: _0x4fcdee.url,
        title: _0x4fcdee.title || "audio",
        quality: _0x4fcdee.quality || "128kbps"
      };
    }
  } catch {}
  try {
    const _0x4b03ad = await casperGet("/api/downloader/ytmp6", {
      url: _0x1ba6c2
    });
    if (_0x4b03ad.success && _0x4b03ad.url) {
      return {
        dlUrl: _0x4b03ad.url,
        title: _0x4b03ad.title || "audio",
        quality: _0x4b03ad.quality || "128kbps"
      };
    }
  } catch {}
  try {
    const _0x568cc5 = await casperGet("/api/downloader/yt-dl", {
      url: _0x1ba6c2
    });
    if (_0x568cc5.success && _0x568cc5.medias?.length) {
      const _0x4e5443 = _0x568cc5.medias.find(_0x302fe7 => _0x302fe7.is_audio || _0x302fe7.type === "audio") || _0x568cc5.medias[0];
      if (_0x4e5443?.original_url) {
        return {
          dlUrl: _0x4e5443.original_url,
          title: _0x568cc5.title || "audio",
          quality: _0x4e5443.quality || "HQ"
        };
      }
    }
  } catch {}
  try {
    const _0x2ac636 = await casperGet("/api/downloader/yt-dl2", {
      url: _0x1ba6c2
    });
    if (_0x2ac636.success && _0x2ac636.medias?.length) {
      const _0x51a1a1 = _0x2ac636.medias.find(_0x1326bc => _0x1326bc.is_audio || _0x1326bc.type === "audio") || _0x2ac636.medias[0];
      if (_0x51a1a1?.original_url) {
        return {
          dlUrl: _0x51a1a1.original_url,
          title: _0x2ac636.title || "audio",
          quality: _0x51a1a1.quality || "HQ"
        };
      }
    }
  } catch {}
  return null;
}
async function tryCasperVideo(_0x1d9e05) {
  try {
    const _0x2f9cdc = await casperGet("/api/downloader/ytmp4", {
      url: _0x1d9e05
    });
    if (_0x2f9cdc.success && _0x2f9cdc.data?.downloads?.length) {
      const _0x411f1c = _0x2f9cdc.data.downloads.find(_0x1339ab => _0x1339ab.hasAudio) || _0x2f9cdc.data.downloads[0];
      return {
        dlUrl: _0x411f1c.url,
        title: _0x2f9cdc.data.title || "video",
        quality: _0x411f1c.quality || "HD"
      };
    }
  } catch {}
  try {
    const _0x2ba433 = await casperGet("/api/downloader/yt-video", {
      url: _0x1d9e05
    });
    if (_0x2ba433.success && _0x2ba433.videos?.length) {
      const _0x28df04 = _0x2ba433.videos.find(_0x50fc34 => _0x50fc34.quality === "720p") || _0x2ba433.videos[0];
      return {
        dlUrl: _0x28df04.url,
        title: _0x2ba433.title || "video",
        quality: _0x28df04.quality || _0x28df04.label || "HD"
      };
    }
  } catch {}
  try {
    const _0x5bc3bd = await casperGet("/api/downloader/yt-dl3", {
      url: _0x1d9e05
    });
    if (_0x5bc3bd.success && _0x5bc3bd.download_url) {
      return {
        dlUrl: _0x5bc3bd.download_url,
        title: _0x5bc3bd.title || "video",
        quality: _0x5bc3bd.quality || "HD"
      };
    }
  } catch {}
  try {
    const _0x41734a = await casperGet("/api/downloader/yt-dl2", {
      url: _0x1d9e05
    });
    if (_0x41734a.success && _0x41734a.medias?.length) {
      const _0x542d3d = _0x41734a.medias.find(_0x234622 => _0x234622.type === "video" && _0x234622.original_url) || _0x41734a.medias[0];
      if (_0x542d3d?.original_url) {
        return {
          dlUrl: _0x542d3d.original_url,
          title: _0x41734a.title || "video",
          quality: _0x542d3d.quality || "HD"
        };
      }
    }
  } catch {}
  try {
    const _0x3c48fd = await casperGet("/api/downloader/yt-dl4", {
      url: _0x1d9e05
    });
    if (_0x3c48fd.success && _0x3c48fd.medias?.length) {
      const _0x45e7b9 = _0x3c48fd.medias.find(_0x19f1bb => _0x19f1bb.type === "video" && _0x19f1bb.original_url) || _0x3c48fd.medias[0];
      if (_0x45e7b9?.original_url) {
        return {
          dlUrl: _0x45e7b9.original_url,
          title: _0x3c48fd.title || "video",
          quality: _0x45e7b9.quality || "HD"
        };
      }
    }
  } catch {}
  try {
    const _0x3255f6 = await casperGet("/api/downloader/yt-dl5", {
      url: _0x1d9e05
    });
    if (_0x3255f6.success && _0x3255f6.medias?.length) {
      const _0x165ac2 = _0x3255f6.medias.find(_0x497594 => _0x497594.type === "video" && _0x497594.original_url) || _0x3255f6.medias[0];
      if (_0x165ac2?.original_url) {
        return {
          dlUrl: _0x165ac2.original_url,
          title: _0x3255f6.title || "video",
          quality: _0x165ac2.quality || "HD"
        };
      }
    }
  } catch {}
  return null;
}
async function ytDownload(_0x4ae613, _0x37f0a5, _0x468f83, _0x312f1c, _0x5c30d2, _0x135e96) {
  const _0x344bba = _0x37f0a5.key.remoteJid;
  const _0x546c10 = getBotName();
  const _0xf95edf = _0x468f83[0];
  if (!_0xf95edf) {
    return _0x4ae613.sendMessage(_0x344bba, {
      text: "╔═|〔  YOUTUBE " + _0x135e96.toUpperCase() + " 〕\n║\n║ ▸ *Usage* : " + _0x312f1c + "yt" + (_0x135e96 === "audio" ? "a" : "v") + " <url>\n║\n╚═|〔 " + _0x546c10 + " 〕"
    }, {
      quoted: _0x37f0a5
    });
  }
  try {
    if (_0x135e96 === "audio") {
      let _0x16293b;
      let _0x4bf884;
      let _0x39dc17;
      const _0x213d0f = await tryCasperAudio(_0xf95edf);
      if (_0x213d0f) {
        _0x16293b = await dlBuffer(_0x213d0f.dlUrl);
        _0x4bf884 = _0x213d0f.title;
        _0x39dc17 = _0x213d0f.quality;
      } else {
        const _0x27dcca = await keithTry(KEITH_AUDIO, {
          url: _0xf95edf
        });
        const _0x4c1d98 = extractUrl(_0x27dcca.result);
        if (!_0x4c1d98) {
          throw new Error("All audio APIs failed");
        }
        _0x16293b = await dlBuffer(_0x4c1d98);
        _0x16293b = await convertTo128kbps(_0x16293b);
        _0x4bf884 = "audio";
        _0x39dc17 = "128kbps";
      }
      const _0x3c54d8 = "╔═|〔  YOUTUBE AUDIO 〕\n║\n║ ▸ *Track*   : " + _0x4bf884 + "\n║ ▸ *Quality* : " + _0x39dc17 + "\n║ ▸ *Size*    : " + (_0x16293b.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x546c10 + " 〕";
      await _0x4ae613.sendMessage(_0x344bba, {
        document: _0x16293b,
        mimetype: "audio/mpeg",
        fileName: _0x4bf884 + ".mp3",
        caption: _0x3c54d8
      }, {
        quoted: _0x37f0a5
      });
    } else {
      let _0x12716a;
      let _0x258c65;
      let _0x5a3cbf;
      const _0x1a7b69 = await tryCasperVideo(_0xf95edf);
      if (_0x1a7b69) {
        _0x12716a = await dlBuffer(_0x1a7b69.dlUrl);
        _0x258c65 = _0x1a7b69.title;
        _0x5a3cbf = _0x1a7b69.quality;
      } else {
        const _0x47421c = await keithTry(KEITH_VIDEO, {
          url: _0xf95edf
        });
        const _0x539f73 = extractUrl(_0x47421c.result);
        if (!_0x539f73) {
          throw new Error("All video APIs failed");
        }
        _0x12716a = await dlBuffer(_0x539f73);
        _0x258c65 = "video";
        _0x5a3cbf = "HD";
      }
      const _0x27a1fe = "╔═|〔  YOUTUBE VIDEO 〕\n║\n║ ▸ *Title*   : " + _0x258c65 + "\n║ ▸ *Quality* : " + _0x5a3cbf + "\n║ ▸ *Size*    : " + (_0x12716a.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x546c10 + " 〕";
      await _0x4ae613.sendMessage(_0x344bba, {
        video: _0x12716a,
        caption: _0x27a1fe
      }, {
        quoted: _0x37f0a5
      });
    }
  } catch (_0x40ac35) {
    await _0x4ae613.sendMessage(_0x344bba, {
      text: "╔═|〔  YOUTUBE " + _0x135e96.toUpperCase() + " 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x40ac35.message + "\n║\n╚═|〔 " + _0x546c10 + " 〕"
    }, {
      quoted: _0x37f0a5
    });
  }
}
module.exports = [{
  name: "yta",
  aliases: ["ytaudio", "ytmp3", "youtubeaudio"],
  description: "Download YouTube audio (128kbps MP3)",
  category: "download",
  async execute(_0x4410fd, _0x3add98, _0x2c7c33, _0x5c8c63, _0x4e90d5) {
    return ytDownload(_0x4410fd, _0x3add98, _0x2c7c33, _0x5c8c63, _0x4e90d5, "audio");
  }
}, {
  name: "ytv",
  aliases: ["ytvideo", "ytmp4", "youtubevideo"],
  description: "Download YouTube video (MP4)",
  category: "download",
  async execute(_0xbad258, _0x26e804, _0x7b5ea6, _0xb2f4a2, _0x3b40b5) {
    return ytDownload(_0xbad258, _0x26e804, _0x7b5ea6, _0xb2f4a2, _0x3b40b5, "video");
  }
}];