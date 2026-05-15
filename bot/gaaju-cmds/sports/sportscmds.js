'use strict';

const BASE = "https://www.thesportsdb.com/api/v1/json/3";
async function fetchJson(_0x400ec6) {
  const _0x45ef1c = await fetch(_0x400ec6, {
    signal: AbortSignal.timeout(15000)
  });
  if (!_0x45ef1c.ok) {
    throw new Error("HTTP " + _0x45ef1c.status);
  }
  return _0x45ef1c.json();
}
function flag(_0x314f23) {
  if (!_0x314f23) {
    return "";
  }
  try {
    return _0x314f23.toUpperCase().replace(/./g, _0x707b92 => String.fromCodePoint(127397 + _0x707b92.codePointAt(0)));
  } catch {
    return "";
  }
}
const playerSearch = {
  name: "playersearch",
  aliases: ["player", "findplayer", "playerinfo"],
  description: "Search for a sports player profile",
  category: "sports",
  async execute(_0x13d109, _0xbaac0, _0x35f043, _0x27d8be, _0x592d39) {
    const _0x30113b = _0xbaac0.key.remoteJid;
    if (!_0x35f043.length) {
      return _0x13d109.sendMessage(_0x30113b, {
        text: "╔═|〔  PLAYER SEARCH 〕\n║\n║ ▸ Usage: " + _0x27d8be + "playersearch <name>\n║\n╚═╝"
      }, {
        quoted: _0xbaac0
      });
    }
    const _0x582e64 = _0x35f043.join(" ");
    try {
      const _0x25f951 = await fetchJson(BASE + "/searchplayers.php?p=" + encodeURIComponent(_0x582e64));
      const _0xf3362b = _0x25f951?.player?.[0];
      if (!_0xf3362b) {
        return _0x13d109.sendMessage(_0x30113b, {
          text: "╔═|〔  PLAYER SEARCH 〕\n║\n║ ▸ ❌ No player found for \"" + _0x582e64 + "\"\n║\n╚═╝"
        }, {
          quoted: _0xbaac0
        });
      }
      const _0x145bdf = ["╔═|〔  PLAYER INFO 〕", "║", "║ ▸ *Name*      : " + (_0xf3362b.strPlayer || "-"), "║ ▸ *Sport*     : " + (_0xf3362b.strSport || "-"), "║ ▸ *Team*      : " + (_0xf3362b.strTeam || "-"), "║ ▸ *Nationality*: " + (_0xf3362b.strNationality || "-") + " " + flag(_0xf3362b.strNationality), "║ ▸ *Position*  : " + (_0xf3362b.strPosition || "-"), "║ ▸ *Height*    : " + (_0xf3362b.strHeight || "-"), "║ ▸ *Weight*    : " + (_0xf3362b.strWeight || "-"), "║ ▸ *Born*      : " + (_0xf3362b.dateBorn || "-"), "║ ▸ *Status*    : " + (_0xf3362b.strStatus || "-"), "║", "╚═╝"].join("\n");
      if (_0xf3362b.strThumb) {
        const _0x111c71 = await fetch(_0xf3362b.strThumb, {
          signal: AbortSignal.timeout(10000)
        }).then(_0x4f9151 => _0x4f9151.ok ? _0x4f9151.arrayBuffer() : null).catch(() => null);
        if (_0x111c71) {
          return _0x13d109.sendMessage(_0x30113b, {
            image: Buffer.from(_0x111c71),
            caption: _0x145bdf
          }, {
            quoted: _0xbaac0
          });
        }
      }
      return _0x13d109.sendMessage(_0x30113b, {
        text: _0x145bdf
      }, {
        quoted: _0xbaac0
      });
    } catch {
      return _0x13d109.sendMessage(_0x30113b, {
        text: "╔═|〔  PLAYER SEARCH 〕\n║\n║ ▸ ❌ Search failed. Try again\n║\n╚═╝"
      }, {
        quoted: _0xbaac0
      });
    }
  }
};
const teamSearch = {
  name: "teamsearch",
  aliases: ["team", "findteam", "teaminfo", "club"],
  description: "Search for a sports team/club profile",
  category: "sports",
  async execute(_0x1e3b83, _0x3e99b4, _0x41f565, _0x42ae27, _0xd6fe9c) {
    const _0x41f8ee = _0x3e99b4.key.remoteJid;
    if (!_0x41f565.length) {
      return _0x1e3b83.sendMessage(_0x41f8ee, {
        text: "╔═|〔  TEAM SEARCH 〕\n║\n║ ▸ Usage: " + _0x42ae27 + "teamsearch <name>\n║\n╚═╝"
      }, {
        quoted: _0x3e99b4
      });
    }
    const _0x285ba9 = _0x41f565.join(" ");
    try {
      const _0x22a47f = await fetchJson(BASE + "/searchteams.php?t=" + encodeURIComponent(_0x285ba9));
      const _0x50a0c2 = _0x22a47f?.teams?.[0];
      if (!_0x50a0c2) {
        return _0x1e3b83.sendMessage(_0x41f8ee, {
          text: "╔═|〔  TEAM SEARCH 〕\n║\n║ ▸ ❌ No team found for \"" + _0x285ba9 + "\"\n║\n╚═╝"
        }, {
          quoted: _0x3e99b4
        });
      }
      const _0x407a55 = ["╔═|〔  TEAM INFO 〕", "║", "║ ▸ *Team*      : " + (_0x50a0c2.strTeam || "-"), "║ ▸ *Sport*     : " + (_0x50a0c2.strSport || "-"), "║ ▸ *League*    : " + (_0x50a0c2.strLeague || "-"), "║ ▸ *Country*   : " + (_0x50a0c2.strCountry || "-"), "║ ▸ *Stadium*   : " + (_0x50a0c2.strStadium || "-"), "║ ▸ *Capacity*  : " + (_0x50a0c2.intStadiumCapacity || "-"), "║ ▸ *Founded*   : " + (_0x50a0c2.intFormedYear || "-"), "║ ▸ *Website*   : " + (_0x50a0c2.strWebsite ? "https://" + _0x50a0c2.strWebsite : "-"), "║", "╚═╝"].join("\n");
      if (_0x50a0c2.strBadge || _0x50a0c2.strLogo) {
        const _0x49f169 = _0x50a0c2.strBadge || _0x50a0c2.strLogo;
        const _0x4d4e51 = await fetch(_0x49f169, {
          signal: AbortSignal.timeout(10000)
        }).then(_0xc8dc23 => _0xc8dc23.ok ? _0xc8dc23.arrayBuffer() : null).catch(() => null);
        if (_0x4d4e51) {
          return _0x1e3b83.sendMessage(_0x41f8ee, {
            image: Buffer.from(_0x4d4e51),
            caption: _0x407a55
          }, {
            quoted: _0x3e99b4
          });
        }
      }
      return _0x1e3b83.sendMessage(_0x41f8ee, {
        text: _0x407a55
      }, {
        quoted: _0x3e99b4
      });
    } catch {
      return _0x1e3b83.sendMessage(_0x41f8ee, {
        text: "╔═|〔  TEAM SEARCH 〕\n║\n║ ▸ ❌ Search failed. Try again\n║\n╚═╝"
      }, {
        quoted: _0x3e99b4
      });
    }
  }
};
module.exports = [playerSearch, teamSearch];