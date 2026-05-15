const https = require("https");
const {
  execSync
} = require("child_process");
const {
  getBotName
} = require("../../lib/botname");
const OWN_REPO = "Xchristech2/GAAJU-MD-ULTRA";
const OWN_BRANCH = "main";
function run(_0x4534a4) {
  try {
    return execSync(_0x4534a4, {
      encoding: "utf8",
      stdio: "pipe",
      timeout: 8000
    }).trim();
  } catch {
    return null;
  }
}
function fmtDate(_0x1993c1) {
  if (!_0x1993c1) {
    return "N/A";
  }
  try {
    return new Date(_0x1993c1).toDateString();
  } catch {
    return _0x1993c1;
  }
}
function num(_0x4e4360) {
  if (_0x4e4360 == null) {
    return "N/A";
  }
  return Number(_0x4e4360).toLocaleString();
}
function trunc(_0x1bb142, _0x1f5167 = 70) {
  if (!_0x1bb142) {
    return "N/A";
  }
  if (String(_0x1bb142).length > _0x1f5167) {
    return String(_0x1bb142).substring(0, _0x1f5167) + "…";
  } else {
    return String(_0x1bb142);
  }
}
function ghGet(_0x933e25) {
  return new Promise((_0x4e63e6, _0x3e62ee) => {
    const _0x36d1f0 = "https://api.github.com" + _0x933e25;
    https.get(_0x36d1f0, {
      headers: {
        "User-Agent": "GAAJU-MD-Bot",
        Accept: "application/vnd.github+json"
      }
    }, _0x582a0b => {
      let _0x3836d3 = "";
      _0x582a0b.on("data", _0x164943 => _0x3836d3 += _0x164943);
      _0x582a0b.on("end", () => {
        try {
          _0x4e63e6({
            status: _0x582a0b.statusCode,
            data: JSON.parse(_0x3836d3)
          });
        } catch {
          _0x3e62ee(new Error("Parse error"));
        }
      });
    }).on("error", _0x3e62ee);
  });
}
function parseRepo(_0x5d69c2) {
  if (!_0x5d69c2) {
    return OWN_REPO;
  }
  const _0x2e18cd = _0x5d69c2.match(/github\.com\/([^\/\s]+\/[^\/\s?#]+)/i);
  if (_0x2e18cd) {
    return _0x2e18cd[1].replace(/\.git$/, "");
  }
  if (/^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(_0x5d69c2)) {
    return _0x5d69c2;
  }
  return null;
}
function localGitInfo() {
  const _0x220786 = run("git rev-parse HEAD")?.slice(0, 7) || "unknown";
  const _0x2880e2 = run("git branch --show-current") || OWN_BRANCH;
  const _0x5d478e = run("git rev-list --count HEAD") || "?";
  const _0x45e579 = run("git log --oneline -5") || "";
  const _0x2e28ea = _0x45e579.split("\n").filter(Boolean).map(_0xaf0712 => {
    const [_0x51a229, ..._0x1b4aed] = _0xaf0712.split(" ");
    return {
      hash: _0x51a229,
      msg: _0x1b4aed.join(" ")
    };
  });
  return {
    sha: _0x220786,
    branch: _0x2880e2,
    count: _0x5d478e,
    commits: _0x2e28ea
  };
}
module.exports = {
  name: "repo",
  aliases: ["botrepo", "repository", "gitinfo", "repostats"],
  description: "Show GitHub repo info — .repo [owner/name or url] (default: bot repo)",
  category: "owner",
  async execute(_0x31447d, _0x566039, _0x2a4c5f, _0x33669c, _0x51271c) {
    const _0x55f266 = _0x566039.key.remoteJid;
    const _0x2cc7b5 = getBotName();
    const _0x5b9374 = "╚═|〔 " + _0x2cc7b5 + " 〕";
    const _0xe7bf = _0x2a4c5f[0] || null;
    const _0x5afabf = parseRepo(_0xe7bf);
    if (_0xe7bf && !_0x5afabf) {
      return _0x31447d.sendMessage(_0x55f266, {
        text: "╔═|〔  🐙 REPO INFO 〕\n║\n║ ▸ *Usage*  : " + _0x33669c + "repo [owner/name or github-url]\n║ ▸ *Tip*    : leave blank to show the bot's own repo\n║\n" + _0x5b9374
      }, {
        quoted: _0x566039
      });
    }
    try {
      await _0x31447d.sendMessage(_0x55f266, {
        react: {
          text: "🐙",
          key: _0x566039.key
        }
      });
      const _0xf45edd = _0x5afabf === OWN_REPO;
      const [_0x27a8d4, _0x1984b8] = await Promise.all([ghGet("/repos/" + _0x5afabf), ghGet("/repos/" + _0x5afabf + "/commits?per_page=5")]);
      const _0x361e20 = _0x27a8d4.status === 200;
      const _0x48d7db = _0x361e20 ? _0x27a8d4.data : null;
      const _0x47ca7e = _0x1984b8.status === 200 && Array.isArray(_0x1984b8.data) ? _0x1984b8.data : [];
      const _0x5e3046 = _0x47ca7e.slice(0, 5).map(_0x2a5113 => ({
        hash: _0x2a5113.sha?.slice(0, 7),
        msg: trunc(_0x2a5113.commit?.message?.split("\n")[0], 55),
        by: _0x2a5113.commit?.author?.name,
        date: fmtDate(_0x2a5113.commit?.author?.date)
      }));
      const _0x38e3e9 = _0xf45edd ? localGitInfo() : null;
      let _0x515b7c = [];
      if (_0xf45edd) {
        const _0x10973c = _0x361e20 ? num(_0x48d7db.stargazers_count) : "—";
        const _0x330f67 = _0x361e20 ? num(_0x48d7db.forks_count) : "—";
        _0x515b7c = ["╔═|〔  🤖 GAAJU-MD ULTRA 〕", "║", "║ ⭐ *Stars* : " + _0x10973c, "║ 🍴 *Forks* : " + _0x330f67, "║", "║ 🔗 *Repo*    : https://github.com/" + OWN_REPO, "║ 🔑 *Session* : https://toosiitechdevelopertools.zone.id/session", "║", "║ ⭐ *Star the repo if you love this bot!*", "║ 🍴 *Fork & deploy your own instance*", "║ 📲 *Share with friends — it's free!*", "║", _0x5b9374];
      } else if (_0x361e20 && _0x48d7db) {
        const _0xb0f0c2 = Array.isArray(_0x48d7db.topics) && _0x48d7db.topics.length ? _0x48d7db.topics.slice(0, 5).join(", ") : "N/A";
        _0x515b7c = ["╔═|〔  🐙 REPO INFO 〕", "║", "║ ▸ *Repo*    : " + _0x48d7db.full_name, "║ ▸ *About*   : " + trunc(_0x48d7db.description, 75), "║ ▸ *Language*: " + (_0x48d7db.language || "N/A"), "║ ▸ *License* : " + (_0x48d7db.license?.name || "N/A"), "║ ▸ *Topics*  : " + _0xb0f0c2, "║", "║ 📊 *Stats*", "║ ▸ ⭐ Stars    : " + num(_0x48d7db.stargazers_count), "║ ▸ 🍴 Forks    : " + num(_0x48d7db.forks_count), "║ ▸ 👁️  Watchers : " + num(_0x48d7db.subscribers_count), "║ ▸ 🐛 Issues   : " + num(_0x48d7db.open_issues_count), "║", "║ 📅 *Activity*", "║ ▸ Created : " + fmtDate(_0x48d7db.created_at), "║ ▸ Updated : " + fmtDate(_0x48d7db.updated_at), "║", "║ 🔗 https://github.com/" + _0x5afabf, "║", _0x5b9374];
      } else {
        throw new Error("Repo \"" + _0x5afabf + "\" not found or is private");
      }
      await _0x31447d.sendMessage(_0x55f266, {
        text: _0x515b7c.join("\n")
      }, {
        quoted: _0x566039
      });
    } catch (_0x35c026) {
      await _0x31447d.sendMessage(_0x55f266, {
        text: "╔═|〔  🐙 REPO INFO 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x35c026.message + "\n║\n" + _0x5b9374
      }, {
        quoted: _0x566039
      });
    }
  }
};