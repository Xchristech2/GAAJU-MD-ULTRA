'use strict';

const {
  getBotName
} = require("../../lib/botname");
const MOVIE_API = "https://movieapi.xcasper.space";
const MOVIE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Origin: "https://movieapi.xcasper.space",
  Referer: "https://movieapi.xcasper.space/"
};
async function movieApi(_0x140086, _0x3aaf1a = {}, _0x500a62 = 15000) {
  const _0x1324cd = new URLSearchParams(_0x3aaf1a).toString();
  const _0x258097 = "" + MOVIE_API + _0x140086 + (_0x1324cd ? "?" + _0x1324cd : "");
  const _0x40d3ab = await fetch(_0x258097, {
    signal: AbortSignal.timeout(_0x500a62),
    headers: MOVIE_HEADERS
  });
  if (!_0x40d3ab.ok) {
    throw new Error("MovieAPI HTTP " + _0x40d3ab.status);
  }
  const _0x3f712a = await _0x40d3ab.json();
  if (!_0x3f712a.success) {
    throw new Error(_0x3f712a.error || "MovieAPI returned failure");
  }
  return _0x3f712a;
}
async function omdbFetch(_0x4bc3a5, _0x203db6 = 12000) {
  const _0x1f7e6f = Object.entries({
    apikey: "trilogy",
    ..._0x4bc3a5
  }).map(([_0x4773fc, _0x3f0486]) => _0x4773fc + "=" + encodeURIComponent(_0x3f0486)).join("&");
  const _0x33b9dc = await fetch("https://www.omdbapi.com/?" + _0x1f7e6f, {
    signal: AbortSignal.timeout(_0x203db6),
    headers: {
      "User-Agent": "Gaaju/1.0"
    }
  });
  if (!_0x33b9dc.ok) {
    throw new Error("OMDb HTTP " + _0x33b9dc.status);
  }
  return _0x33b9dc.json();
}
async function sbSearch(_0x21adbf, _0x33cd0d = "movie", _0x29854e = 5) {
  const _0x3f9e4a = await movieApi("/api/showbox/search", {
    keyword: _0x21adbf,
    type: _0x33cd0d,
    pagelimit: _0x29854e
  });
  if (Array.isArray(_0x3f9e4a.data)) {
    return _0x3f9e4a.data;
  } else {
    return [];
  }
}
async function sbMovie(_0x4accec) {
  const _0x547495 = await movieApi("/api/showbox/movie", {
    id: _0x4accec
  });
  return _0x547495.data || null;
}
async function getImageBuffer(_0xc169ab, _0x5130aa = 15000) {
  const _0x2819e6 = await fetch(_0xc169ab, {
    signal: AbortSignal.timeout(_0x5130aa),
    headers: {
      "User-Agent": "Mozilla/5.0 Chrome/120"
    }
  });
  if (!_0x2819e6.ok) {
    throw new Error("Image HTTP " + _0x2819e6.status);
  }
  const _0x5c3654 = await _0x2819e6.arrayBuffer();
  return Buffer.from(_0x5c3654);
}
function fmtRuntime(_0x38e520) {
  if (!_0x38e520) {
    return "N/A";
  }
  const _0x24ff3e = Math.floor(_0x38e520 / 60);
  const _0x4571b1 = _0x38e520 % 60;
  if (_0x24ff3e) {
    return _0x24ff3e + "h " + _0x4571b1 + "m";
  } else {
    return _0x4571b1 + "m";
  }
}
const movieCmd = {
  name: "movie",
  aliases: ["movieinfo", "movinfo", "film", "filminfo", "imdb"],
  description: "Full movie details with poster — .movie <title>",
  category: "movie",
  async execute(_0x2ac4ef, _0x18326d, _0x13c118, _0x4a7c80) {
    const _0x4ffd87 = _0x18326d.key.remoteJid;
    const _0x4a55cf = getBotName();
    const _0x4babbb = _0x13c118.join(" ").trim();
    if (!_0x4babbb) {
      return _0x2ac4ef.sendMessage(_0x4ffd87, {
        text: "╔═|〔  🎬 MOVIE INFO 〕\n║\n║ ▸ *Usage*   : " + _0x4a7c80 + "movie <title>\n║ ▸ *Example* : " + _0x4a7c80 + "movie avengers endgame\n║ ▸ *Tip*     : Use " + _0x4a7c80 + "trailer <title> for the trailer\n║\n╚═|〔 " + _0x4a55cf + " 〕"
      }, {
        quoted: _0x18326d
      });
    }
    try {
      await _0x2ac4ef.sendMessage(_0x4ffd87, {
        react: {
          text: "🎬",
          key: _0x18326d.key
        }
      });
      const _0x56a260 = await sbSearch(_0x4babbb, "movie", 3);
      if (!_0x56a260.length) {
        throw new Error("No movie found for that title");
      }
      const _0x58e638 = await sbMovie(_0x56a260[0].id);
      if (!_0x58e638) {
        throw new Error("Could not fetch movie details");
      }
      const _0x5d53e6 = (_0x58e638.cats || "").split(",").map(_0x5e9784 => _0x5e9784.trim()).filter(Boolean).map(_0x401e63 => _0x401e63[0].toUpperCase() + _0x401e63.slice(1)).join(", ") || "N/A";
      const _0x1bd9a0 = Array.isArray(_0x58e638.country_list) ? _0x58e638.country_list.join(", ") : _0x58e638.country_list || "N/A";
      const _0x3ea663 = typeof _0x58e638.audio_lang === "string" && _0x58e638.audio_lang ? _0x58e638.audio_lang.toUpperCase() : "N/A";
      const _0x2b4000 = "╔═|〔  🎬 MOVIE INFO 〕\n║\n" + ("║ ▸ *Title*   : " + _0x58e638.title + " (" + _0x58e638.year + ")\n") + ("║ ▸ *Rating*  : ⭐ " + (_0x58e638.imdb_rating || "N/A") + "/10\n") + ("║ ▸ *Runtime* : " + fmtRuntime(_0x58e638.runtime) + " | " + (_0x58e638.content_rating || "NR") + "\n") + ("║ ▸ *Genre*   : " + _0x5d53e6 + "\n") + ("║ ▸ *Director*: " + (_0x58e638.director || "N/A") + "\n") + ("║ ▸ *Cast*    : " + (_0x58e638.actors || "N/A").split(",").slice(0, 3).join(", ") + "\n") + ("║ ▸ *Country* : " + _0x1bd9a0 + " | 🗣 " + _0x3ea663 + "\n") + ("║\n║ 📝 *Plot*: " + (_0x58e638.description || "N/A").substring(0, 200) + "…\n║\n") + ("║ 🎬 " + _0x4a7c80 + "trailer " + _0x58e638.title + " — for trailer video\n║\n") + ("╚═|〔 " + _0x4a55cf + " 〕");
      const _0x2eedd = _0x58e638.banner || _0x58e638.poster_org;
      if (_0x2eedd) {
        try {
          const _0x3a4847 = await getImageBuffer(_0x2eedd);
          await _0x2ac4ef.sendMessage(_0x4ffd87, {
            image: _0x3a4847,
            caption: _0x2b4000
          }, {
            quoted: _0x18326d
          });
          return;
        } catch {}
      }
      await _0x2ac4ef.sendMessage(_0x4ffd87, {
        text: _0x2b4000
      }, {
        quoted: _0x18326d
      });
    } catch (_0xb51607) {
      await _0x2ac4ef.sendMessage(_0x4ffd87, {
        text: "╔═|〔  🎬 MOVIE INFO 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0xb51607.message + "\n║\n╚═|〔 " + _0x4a55cf + " 〕"
      }, {
        quoted: _0x18326d
      });
    }
  }
};
const mboxCmd = {
  name: "mbox",
  aliases: ["moviebox", "movbox", "moviesearch", "msearch", "searchmovie"],
  description: "Search for movies — .mbox <title>",
  category: "movie",
  async execute(_0x2888bd, _0x582176, _0x45f3d3, _0x5682bf) {
    const _0xe44b20 = _0x582176.key.remoteJid;
    const _0x483a49 = getBotName();
    const _0x4abfb2 = _0x45f3d3.join(" ").trim();
    if (!_0x4abfb2) {
      return _0x2888bd.sendMessage(_0xe44b20, {
        text: "╔═|〔  🎥 MOVIE SEARCH 〕\n║\n║ ▸ *Usage*   : " + _0x5682bf + "mbox <title>\n║ ▸ *Example* : " + _0x5682bf + "mbox avengers\n║ ▸ *Tip*     : " + _0x5682bf + "movie <title> for full details\n║\n╚═|〔 " + _0x483a49 + " 〕"
      }, {
        quoted: _0x582176
      });
    }
    try {
      await _0x2888bd.sendMessage(_0xe44b20, {
        react: {
          text: "🎥",
          key: _0x582176.key
        }
      });
      const _0x39cbab = await sbSearch(_0x4abfb2, "movie", 8);
      if (!_0x39cbab.length) {
        throw new Error("No movies found");
      }
      const _0x15a1f4 = _0x39cbab.slice(0, 6).map((_0x1ed97c, _0x586f59) => "║ ▸ [" + (_0x586f59 + 1) + "] *" + _0x1ed97c.title + "* (" + (_0x1ed97c.year || "?") + ")\n║      ⭐ " + (_0x1ed97c.imdb_rating || "N/A") + " | 👤 " + ((_0x1ed97c.actors || "").split(",")[0]?.trim() || "N/A")).join("\n║\n");
      await _0x2888bd.sendMessage(_0xe44b20, {
        text: "╔═|〔  🎥 MOVIE SEARCH 〕\n║\n║ 🔍 *" + _0x4abfb2 + "* — " + _0x39cbab.length + " results\n║\n" + _0x15a1f4 + "\n║\n║ 💡 " + _0x5682bf + "trailer <title> to get trailer video\n║\n╚═|〔 " + _0x483a49 + " 〕"
      }, {
        quoted: _0x582176
      });
    } catch (_0x4091c4) {
      await _0x2888bd.sendMessage(_0xe44b20, {
        text: "╔═|〔  🎥 MOVIE SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x4091c4.message + "\n║\n╚═|〔 " + _0x483a49 + " 〕"
      }, {
        quoted: _0x582176
      });
    }
  }
};
const trendingCmd = {
  name: "trending",
  aliases: ["trendingmovies", "movietrending", "topmovies"],
  description: "Trending movies right now — .trending",
  category: "movie",
  async execute(_0x3a4c22, _0x3d113d, _0x1990fc, _0x119058) {
    const _0x1727e9 = _0x3d113d.key.remoteJid;
    const _0x1d05c4 = getBotName();
    try {
      await _0x3a4c22.sendMessage(_0x1727e9, {
        react: {
          text: "📈",
          key: _0x3d113d.key
        }
      });
      const _0x1c6903 = await movieApi("/api/trending", {
        perPage: 8
      });
      const _0x7884f = (_0x1c6903.data?.subjectList || []).slice(0, 8).map((_0x3514ec, _0xeb476f) => "║ ▸ [" + (_0xeb476f + 1) + "] *" + _0x3514ec.title + "* (" + (_0x3514ec.releaseDate?.substring(0, 4) || "?") + ")\n║      🎭 " + (_0x3514ec.genre || "N/A")).join("\n║\n");
      if (!_0x7884f) {
        throw new Error("No trending data available");
      }
      await _0x3a4c22.sendMessage(_0x1727e9, {
        text: "╔═|〔  📈 TRENDING MOVIES 〕\n║\n" + _0x7884f + "\n║\n║ 💡 " + _0x119058 + "movie <title> for full details\n║\n╚═|〔 " + _0x1d05c4 + " 〕"
      }, {
        quoted: _0x3d113d
      });
    } catch (_0x5d34bc) {
      await _0x3a4c22.sendMessage(_0x1727e9, {
        text: "╔═|〔  📈 TRENDING MOVIES 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x5d34bc.message + "\n║\n╚═|〔 " + _0x1d05c4 + " 〕"
      }, {
        quoted: _0x3d113d
      });
    }
  }
};
const hotCmd = {
  name: "hotmovies",
  aliases: ["hot", "popularmovies", "moviehot"],
  description: "Hot & popular movies right now — .hotmovies",
  category: "movie",
  async execute(_0x178190, _0x1f3de9, _0xe22fe, _0x845040) {
    const _0x415def = _0x1f3de9.key.remoteJid;
    const _0x5759de = getBotName();
    try {
      await _0x178190.sendMessage(_0x415def, {
        react: {
          text: "🔥",
          key: _0x1f3de9.key
        }
      });
      const _0x562415 = await movieApi("/api/hot");
      const _0x2220a6 = (_0x562415.data?.movie || []).slice(0, 5);
      const _0x189ba9 = (_0x562415.data?.tv || []).slice(0, 3);
      if (!_0x2220a6.length && !_0x189ba9.length) {
        throw new Error("No hot data available");
      }
      const _0x3b8c86 = _0x294383 => _0x294383.map((_0x5af293, _0x5d63d7) => "║ ▸ [" + (_0x5d63d7 + 1) + "] *" + _0x5af293.title + "* (" + (_0x5af293.releaseDate?.substring(0, 4) || "?") + ") — 🎭 " + (_0x5af293.genre || "N/A")).join("\n");
      let _0x4ac61f = "╔═|〔  🔥 HOT & POPULAR 〕\n║\n║ 🎬 *Top Movies*\n" + _0x3b8c86(_0x2220a6);
      if (_0x189ba9.length) {
        _0x4ac61f += "\n║\n║ 📺 *Hot TV Shows*\n" + _0x3b8c86(_0x189ba9);
      }
      _0x4ac61f += "\n║\n║ 💡 " + _0x845040 + "movie <title> for details\n║\n╚═|〔 " + _0x5759de + " 〕";
      await _0x178190.sendMessage(_0x415def, {
        text: _0x4ac61f
      }, {
        quoted: _0x1f3de9
      });
    } catch (_0x5bfb51) {
      await _0x178190.sendMessage(_0x415def, {
        text: "╔═|〔  🔥 HOT MOVIES 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x5bfb51.message + "\n║\n╚═|〔 " + _0x5759de + " 〕"
      }, {
        quoted: _0x1f3de9
      });
    }
  }
};
const latestCmd = {
  name: "newmovies",
  aliases: ["latestmovies", "recentmovies", "moviesnew"],
  description: "Latest & newly released movies — .newmovies",
  category: "movie",
  async execute(_0x57b8b4, _0x1986f5, _0x3b5b45, _0x1e3302) {
    const _0x3bd147 = _0x1986f5.key.remoteJid;
    const _0x3a4faf = getBotName();
    try {
      await _0x57b8b4.sendMessage(_0x3bd147, {
        react: {
          text: "🆕",
          key: _0x1986f5.key
        }
      });
      const _0x3cacc7 = await movieApi("/api/newtoxic/latest", {
        page: 1
      });
      const _0x573778 = (_0x3cacc7.data || []).filter(_0x1e3b50 => _0x1e3b50.type === "movie").slice(0, 8);
      if (!_0x573778.length) {
        throw new Error("No new movies found");
      }
      const _0x9b1ae2 = _0x573778.map((_0x38ad32, _0x3ed925) => "║ ▸ [" + (_0x3ed925 + 1) + "] *" + _0x38ad32.title + "*").join("\n");
      await _0x57b8b4.sendMessage(_0x3bd147, {
        text: "╔═|〔  🆕 LATEST MOVIES 〕\n║\n" + _0x9b1ae2 + "\n║\n║ 💡 " + _0x1e3302 + "movie <title> for full details\n║ 💡 " + _0x1e3302 + "trailer <title> for trailer\n║\n╚═|〔 " + _0x3a4faf + " 〕"
      }, {
        quoted: _0x1986f5
      });
    } catch (_0x320674) {
      await _0x57b8b4.sendMessage(_0x3bd147, {
        text: "╔═|〔  🆕 LATEST MOVIES 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x320674.message + "\n║\n╚═|〔 " + _0x3a4faf + " 〕"
      }, {
        quoted: _0x1986f5
      });
    }
  }
};
const dramaCmd = {
  name: "drama",
  aliases: ["dramasearch", "tvshow", "tvsearch", "series"],
  description: "Search for TV shows & dramas — .drama <title>",
  category: "movie",
  async execute(_0x4ac09b, _0x47982e, _0x5ee3be, _0x2bcbdf) {
    const _0x333bfd = _0x47982e.key.remoteJid;
    const _0x206695 = getBotName();
    const _0x24c7ba = _0x5ee3be.join(" ").trim();
    if (!_0x24c7ba) {
      return _0x4ac09b.sendMessage(_0x333bfd, {
        text: "╔═|〔  🎭 TV / DRAMA SEARCH 〕\n║\n║ ▸ *Usage*   : " + _0x2bcbdf + "drama <title>\n║ ▸ *Example* : " + _0x2bcbdf + "drama game of thrones\n║\n╚═|〔 " + _0x206695 + " 〕"
      }, {
        quoted: _0x47982e
      });
    }
    try {
      await _0x4ac09b.sendMessage(_0x333bfd, {
        react: {
          text: "🎭",
          key: _0x47982e.key
        }
      });
      const _0xa70cf6 = await sbSearch(_0x24c7ba, "tv", 6);
      if (!_0xa70cf6.length) {
        throw new Error("No TV shows found for that title");
      }
      const _0x48d16b = _0xa70cf6.slice(0, 6).map((_0x104bee, _0x258ae7) => "║ ▸ [" + (_0x258ae7 + 1) + "] *" + _0x104bee.title + "* (" + (_0x104bee.year || "?") + ")\n║      ⭐ " + (_0x104bee.imdb_rating || "N/A")).join("\n║\n");
      await _0x4ac09b.sendMessage(_0x333bfd, {
        text: "╔═|〔  🎭 TV / DRAMA SEARCH 〕\n║\n║ 🔍 *" + _0x24c7ba + "*\n║\n" + _0x48d16b + "\n║\n╚═|〔 " + _0x206695 + " 〕"
      }, {
        quoted: _0x47982e
      });
    } catch (_0x46ffa1) {
      await _0x4ac09b.sendMessage(_0x333bfd, {
        text: "╔═|〔  🎭 TV / DRAMA SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x46ffa1.message + "\n║\n╚═|〔 " + _0x206695 + " 〕"
      }, {
        quoted: _0x47982e
      });
    }
  }
};
const actorCmd = {
  name: "actor",
  aliases: ["actress", "actorsearch", "celeb", "cast"],
  description: "Find movies starring an actor — .actor <name>",
  category: "movie",
  async execute(_0x1fcc68, _0x5bad86, _0x2dbe50, _0x5c89fd) {
    const _0x221190 = _0x5bad86.key.remoteJid;
    const _0x2b1021 = getBotName();
    const _0xce42b8 = _0x2dbe50.join(" ").trim();
    if (!_0xce42b8) {
      return _0x1fcc68.sendMessage(_0x221190, {
        text: "╔═|〔  🎬 ACTOR SEARCH 〕\n║\n║ ▸ *Usage* : " + _0x5c89fd + "actor <name>\n║ ▸ *Example* : " + _0x5c89fd + "actor will smith\n║\n╚═|〔 " + _0x2b1021 + " 〕"
      }, {
        quoted: _0x5bad86
      });
    }
    try {
      await _0x1fcc68.sendMessage(_0x221190, {
        react: {
          text: "🎬",
          key: _0x5bad86.key
        }
      });
      const _0x2463c3 = await omdbFetch({
        s: _0xce42b8
      });
      if (_0x2463c3.Response === "False") {
        throw new Error(_0x2463c3.Error || "Nothing found");
      }
      const _0x114a78 = (_0x2463c3.Search || []).slice(0, 6);
      const _0x843225 = _0x114a78.map((_0x383273, _0x2771a3) => "║ ▸ [" + (_0x2771a3 + 1) + "] *" + _0x383273.Title + "* [" + _0x383273.Type + "] (" + _0x383273.Year + ")").join("\n");
      await _0x1fcc68.sendMessage(_0x221190, {
        text: "╔═|〔  🎬 ACTOR SEARCH 〕\n║\n║ 🔍 *" + _0xce42b8 + "*\n║\n" + _0x843225 + "\n║\n║ 💡 " + _0x5c89fd + "movie <title> for full details\n║\n╚═|〔 " + _0x2b1021 + " 〕"
      }, {
        quoted: _0x5bad86
      });
    } catch (_0x564b80) {
      await _0x1fcc68.sendMessage(_0x221190, {
        text: "╔═|〔  🎬 ACTOR SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x564b80.message + "\n║\n╚═|〔 " + _0x2b1021 + " 〕"
      }, {
        quoted: _0x5bad86
      });
    }
  }
};
module.exports = [movieCmd, mboxCmd, trendingCmd, hotCmd, latestCmd, dramaCmd, actorCmd];