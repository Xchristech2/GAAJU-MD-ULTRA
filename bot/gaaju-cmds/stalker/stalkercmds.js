'use strict';

const {
  getBotName
} = require("../../lib/botname");
function trunc(_0x3903e9, _0x48d3c1 = 80) {
  if (!_0x3903e9) {
    return "N/A";
  }
  if (String(_0x3903e9).length > _0x48d3c1) {
    return String(_0x3903e9).substring(0, _0x48d3c1) + "…";
  } else {
    return String(_0x3903e9);
  }
}
function num(_0x596f8c) {
  if (_0x596f8c == null) {
    return "N/A";
  }
  return Number(_0x596f8c).toLocaleString();
}
function fmtDate(_0x58c4e5) {
  if (!_0x58c4e5) {
    return "N/A";
  }
  try {
    return new Date(_0x58c4e5).toDateString();
  } catch {
    return _0x58c4e5;
  }
}
function wrap(_0x235e1d, _0x29be6d, _0x2484e8) {
  const _0x4d2321 = getBotName();
  return "╔═|〔  " + _0x29be6d + " " + _0x235e1d + " 〕\n║\n" + _0x2484e8.join("\n") + "\n║\n╚═|〔 " + _0x4d2321 + " 〕";
}
function errMsg(_0x19e5f3, _0x444284, _0x13a657) {
  const _0x29740a = getBotName();
  return "╔═|〔  " + _0x444284 + " " + _0x19e5f3 + " 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x13a657 + "\n║\n╚═|〔 " + _0x29740a + " 〕";
}
async function ghFetch(_0x47c0a1) {
  const _0x32e950 = new AbortController();
  const _0x189540 = setTimeout(() => _0x32e950.abort(), 12000);
  const _0x4e02b4 = {
    "User-Agent": "Gaaju/1.0",
    Accept: "application/vnd.github.v3+json"
  };
  const _0x327e19 = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (_0x327e19) {
    _0x4e02b4.Authorization = "token " + _0x327e19;
  }
  try {
    const _0x16e452 = await fetch("https://api.github.com" + _0x47c0a1, {
      signal: _0x32e950.signal,
      headers: _0x4e02b4
    });
    if (!_0x16e452.ok) {
      throw new Error("GitHub HTTP " + _0x16e452.status);
    }
    return _0x16e452.json();
  } finally {
    clearTimeout(_0x189540);
  }
}
async function apiFetch(_0x1d7e0e) {
  const _0xb95a00 = new AbortController();
  const _0x157df1 = setTimeout(() => _0xb95a00.abort(), 12000);
  try {
    const _0x5efcc9 = await fetch(_0x1d7e0e, {
      signal: _0xb95a00.signal,
      headers: {
        "User-Agent": "Gaaju/1.0"
      }
    });
    if (!_0x5efcc9.ok) {
      throw new Error("HTTP " + _0x5efcc9.status);
    }
    return _0x5efcc9.json();
  } finally {
    clearTimeout(_0x157df1);
  }
}
const ghTrendCmd = {
  name: "ghtrend",
  aliases: ["gittrend", "githubtrend", "trending"],
  description: "Get trending GitHub repositories",
  category: "stalker",
  async execute(_0x2248ab, _0x47341b, _0x590817, _0x29d068) {
    const _0x13a721 = _0x47341b.key.remoteJid;
    const _0x2345ad = _0x590817[0] ? "+language:" + encodeURIComponent(_0x590817[0]) : "";
    try {
      await _0x2248ab.sendMessage(_0x13a721, {
        react: {
          text: "⭐",
          key: _0x47341b.key
        }
      });
      const _0x2d30ef = await ghFetch("/search/repositories?q=stars:>1000" + _0x2345ad + "&sort=stars&order=desc&per_page=8");
      if (!_0x2d30ef.items?.length) {
        throw new Error("No trending repos found");
      }
      const _0x467794 = _0x2d30ef.items.slice(0, 8).map((_0x111d43, _0x524972) => ["║ ▸ [" + (_0x524972 + 1) + "] *" + _0x111d43.full_name + "*", "║      ⭐ " + num(_0x111d43.stargazers_count) + " stars | 🍴 " + num(_0x111d43.forks_count) + " forks | " + (_0x111d43.language || "N/A"), "║      📝 " + trunc(_0x111d43.description, 70), "║      🔗 " + _0x111d43.html_url].join("\n")).join("\n║\n");
      const _0x1c2da2 = _0x590817[0] ? " · " + _0x590817[0] : "";
      await _0x2248ab.sendMessage(_0x13a721, {
        text: wrap("GITHUB TRENDING" + _0x1c2da2, "⭐", [_0x467794])
      }, {
        quoted: _0x47341b
      });
    } catch (_0x423dc1) {
      await _0x2248ab.sendMessage(_0x13a721, {
        text: errMsg("GITHUB TRENDING", "⭐", _0x423dc1.message)
      }, {
        quoted: _0x47341b
      });
    }
  }
};
const ghStalkCmd = {
  name: "ghstalk",
  aliases: ["gitrepo", "ghrepo", "githubstalk"],
  description: "Get info about a GitHub repo — .ghstalk <user/repo>",
  category: "stalker",
  async execute(_0x46f1ec, _0xfe07fa, _0x32038f, _0x48e51f) {
    const _0x42660d = _0xfe07fa.key.remoteJid;
    const _0x1f5e6f = _0x32038f.join("").trim();
    const _0x53eddc = _0x1f5e6f.match(/github\.com\/([^/?#]+\/[^/?#]+)/i);
    const _0x4a1480 = _0x53eddc ? _0x53eddc[1].replace(/\.git$/, "") : _0x1f5e6f;
    if (!_0x4a1480 || !_0x4a1480.includes("/")) {
      return _0x46f1ec.sendMessage(_0x42660d, {
        text: errMsg("GITHUB STALK", "🐙", "Usage: " + _0x48e51f + "ghstalk <user/repo> or full GitHub URL")
      }, {
        quoted: _0xfe07fa
      });
    }
    try {
      await _0x46f1ec.sendMessage(_0x42660d, {
        react: {
          text: "🐙",
          key: _0xfe07fa.key
        }
      });
      const _0x3112aa = await ghFetch("/repos/" + _0x4a1480);
      if (!_0x3112aa?.full_name) {
        throw new Error("Repo not found");
      }
      await _0x46f1ec.sendMessage(_0x42660d, {
        text: wrap("GITHUB REPO", "🐙", ["║ ▸ *Repo*        : " + _0x3112aa.full_name, "║ ▸ *Description* : " + trunc(_0x3112aa.description, 80), "║ ▸ *Language*    : " + (_0x3112aa.language || "N/A"), "║ ▸ *Stars*       : ⭐ " + num(_0x3112aa.stargazers_count), "║ ▸ *Forks*       : 🍴 " + num(_0x3112aa.forks_count), "║ ▸ *Watchers*    : 👁️ " + num(_0x3112aa.watchers_count), "║ ▸ *Issues*      : 🐛 " + num(_0x3112aa.open_issues_count) + " open", "║ ▸ *License*     : " + (_0x3112aa.license?.name || "None"), "║ ▸ *Created*     : " + fmtDate(_0x3112aa.created_at), "║ ▸ *Updated*     : " + fmtDate(_0x3112aa.updated_at), "║ ▸ *Topics*      : " + ((_0x3112aa.topics || []).slice(0, 5).join(", ") || "N/A"), "║ ▸ 🔗 " + _0x3112aa.html_url])
      }, {
        quoted: _0xfe07fa
      });
    } catch (_0x4fa30c) {
      await _0x46f1ec.sendMessage(_0x42660d, {
        text: errMsg("GITHUB STALK", "🐙", _0x4fa30c.message)
      }, {
        quoted: _0xfe07fa
      });
    }
  }
};
const countryCmd = {
  name: "countryinfo",
  aliases: ["country", "countrydata", "countrycheck"],
  description: "Get information about any country",
  category: "stalker",
  async execute(_0x259016, _0x5d7ff7, _0x267aeb, _0x5b45f7) {
    const _0x47a1cc = _0x5d7ff7.key.remoteJid;
    const _0x17ca33 = _0x267aeb.join(" ").trim();
    if (!_0x17ca33) {
      return _0x259016.sendMessage(_0x47a1cc, {
        text: errMsg("COUNTRY INFO", "🌍", "Usage: " + _0x5b45f7 + "countryinfo <country name>")
      }, {
        quoted: _0x5d7ff7
      });
    }
    try {
      await _0x259016.sendMessage(_0x47a1cc, {
        react: {
          text: "🌍",
          key: _0x5d7ff7.key
        }
      });
      const _0x28ae33 = await apiFetch("https://restcountries.com/v3.1/name/" + encodeURIComponent(_0x17ca33) + "?fullText=false");
      if (!Array.isArray(_0x28ae33) || !_0x28ae33.length) {
        throw new Error("Country not found");
      }
      const _0x39f6ed = _0x28ae33[0];
      const _0x3067fc = (_0x39f6ed.capital || ["N/A"]).join(", ");
      const _0x121afa = Object.values(_0x39f6ed.currencies || {}).map(_0x13e3b8 => _0x13e3b8.name + " (" + (_0x13e3b8.symbol || "?") + ")").join(", ") || "N/A";
      const _0x4c0a77 = Object.values(_0x39f6ed.languages || {}).slice(0, 3).join(", ") || "N/A";
      const _0x15493d = [_0x39f6ed.region, _0x39f6ed.subregion].filter(Boolean).join(" › ");
      const _0x252669 = (_0x39f6ed.borders || []).slice(0, 5).join(", ") || "None";
      await _0x259016.sendMessage(_0x47a1cc, {
        text: wrap("COUNTRY INFO", "🌍", ["║ ▸ *Country*     : " + _0x39f6ed.name?.common + " " + (_0x39f6ed.flag || ""), "║ ▸ *Official*    : " + _0x39f6ed.name?.official, "║ ▸ *Capital*     : " + _0x3067fc, "║ ▸ *Region*      : " + _0x15493d, "║ ▸ *Population*  : " + num(_0x39f6ed.population), "║ ▸ *Area*        : " + num(_0x39f6ed.area) + " km²", "║ ▸ *Currencies*  : " + _0x121afa, "║ ▸ *Languages*   : " + _0x4c0a77, "║ ▸ *Borders*     : " + _0x252669, "║ ▸ *Calling*     : " + ((_0x39f6ed.idd?.root || "") + (_0x39f6ed.idd?.suffixes?.[0] || "")), "║ ▸ *TLD*         : " + ((_0x39f6ed.tld || []).join(", ") || "N/A"), "║ ▸ *UN Member*   : " + (_0x39f6ed.unMember ? "Yes" : "No")])
      }, {
        quoted: _0x5d7ff7
      });
    } catch (_0x1d0e99) {
      await _0x259016.sendMessage(_0x47a1cc, {
        text: errMsg("COUNTRY INFO", "🌍", _0x1d0e99.message)
      }, {
        quoted: _0x5d7ff7
      });
    }
  }
};
const npmStalkCmd = {
  name: "npmstalk",
  aliases: ["npminfo", "npm", "npmlookup"],
  description: "Look up an NPM package — .npmstalk <package>",
  category: "stalker",
  async execute(_0x34c8d5, _0x619151, _0x5838b6, _0x5a28e1) {
    const _0x4b714b = _0x619151.key.remoteJid;
    const _0xbbdf73 = _0x5838b6.join(" ").trim().toLowerCase();
    if (!_0xbbdf73) {
      return _0x34c8d5.sendMessage(_0x4b714b, {
        text: errMsg("NPM STALK", "📦", "Usage: " + _0x5a28e1 + "npmstalk <package-name>")
      }, {
        quoted: _0x619151
      });
    }
    try {
      await _0x34c8d5.sendMessage(_0x4b714b, {
        react: {
          text: "📦",
          key: _0x619151.key
        }
      });
      const _0x2a8ace = await apiFetch("https://registry.npmjs.org/" + encodeURIComponent(_0xbbdf73));
      if (!_0x2a8ace?.name) {
        throw new Error("Package not found");
      }
      const _0x1271e2 = _0x2a8ace["dist-tags"]?.latest || "N/A";
      const _0x59fdbd = _0x2a8ace.versions?.[_0x1271e2] || {};
      const _0x494645 = Object.keys(_0x59fdbd.dependencies || {}).length;
      const _0x573e3e = Object.keys(_0x59fdbd.devDependencies || {}).length;
      await _0x34c8d5.sendMessage(_0x4b714b, {
        text: wrap("NPM STALK", "📦", ["║ ▸ *Name*        : " + _0x2a8ace.name, "║ ▸ *Version*     : " + _0x1271e2, "║ ▸ *Description* : " + trunc(_0x2a8ace.description, 80), "║ ▸ *Author*      : " + (typeof _0x2a8ace.author === "string" ? _0x2a8ace.author : _0x2a8ace.author?.name || "N/A"), "║ ▸ *License*     : " + (_0x59fdbd.license || _0x2a8ace.license || "N/A"), "║ ▸ *Homepage*    : " + (_0x59fdbd.homepage || _0x2a8ace.homepage || "N/A"), "║ ▸ *Keywords*    : " + ((_0x2a8ace.keywords || []).slice(0, 5).join(", ") || "N/A"), "║ ▸ *Deps*        : " + _0x494645 + " dependencies | " + _0x573e3e + " devDeps", "║ ▸ *Published*   : " + fmtDate(_0x2a8ace.time?.[_0x1271e2]), "║ ▸ 🔗 https://npmjs.com/package/" + _0x2a8ace.name])
      }, {
        quoted: _0x619151
      });
    } catch (_0x2354c4) {
      await _0x34c8d5.sendMessage(_0x4b714b, {
        text: errMsg("NPM STALK", "📦", _0x2354c4.message)
      }, {
        quoted: _0x619151
      });
    }
  }
};
module.exports = [ghTrendCmd, ghStalkCmd, countryCmd, npmStalkCmd];