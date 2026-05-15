'use strict';

const {
  getBotName
} = require("../../lib/botname");
const {
  dlBuffer
} = require("../../lib/keithapi");
const BASE = "https://apis.xcasper.space/api/ephoto-360/generate";
const EFFECTS = {
  neon: [{
    id: 68,
    name: "Neon Text"
  }, {
    id: 69,
    name: "Colorful Glow"
  }, {
    id: 78,
    name: "Neon Online"
  }, {
    id: 117,
    name: "Blue Neon"
  }, {
    id: 171,
    name: "Neon Classic"
  }, {
    id: 200,
    name: "Neon Light"
  }, {
    id: 395,
    name: "Green Neon"
  }, {
    id: 429,
    name: "Green Neon Logo"
  }, {
    id: 507,
    name: "Blue Neon Logo"
  }, {
    id: 521,
    name: "Galaxy Neon"
  }, {
    id: 538,
    name: "Retro Neon"
  }, {
    id: 591,
    name: "Multicolor Neon"
  }, {
    id: 677,
    name: "Hacker Cyan Neon"
  }, {
    id: 683,
    name: "Devil Wings Neon"
  }, {
    id: 706,
    name: "Glowing Text"
  }, {
    id: 710,
    name: "Blackpink Neon"
  }, {
    id: 768,
    name: "Neon Glitch"
  }, {
    id: 797,
    name: "Colorful Neon Light"
  }],
  "3d": [{
    id: 59,
    name: "Wooden 3D"
  }, {
    id: 88,
    name: "3D Cubic"
  }, {
    id: 104,
    name: "3D Wood"
  }, {
    id: 126,
    name: "Water 3D"
  }, {
    id: 143,
    name: "Zombie 3D"
  }, {
    id: 172,
    name: "3D Classic"
  }, {
    id: 208,
    name: "Graffiti 3D"
  }, {
    id: 273,
    name: "3D Silver"
  }, {
    id: 274,
    name: "3D Style"
  }, {
    id: 277,
    name: "Metal 3D"
  }, {
    id: 281,
    name: "Ruby Stone 3D"
  }, {
    id: 373,
    name: "Birthday 3D"
  }, {
    id: 374,
    name: "Metal Logo 3D"
  }, {
    id: 427,
    name: "Avengers 3D"
  }, {
    id: 441,
    name: "Hologram 3D"
  }, {
    id: 476,
    name: "Gradient Logo 3D"
  }, {
    id: 508,
    name: "Stone 3D"
  }, {
    id: 559,
    name: "Space 3D"
  }, {
    id: 580,
    name: "Sand 3D"
  }, {
    id: 600,
    name: "Gradient 3D"
  }, {
    id: 608,
    name: "Vintage Bulb 3D"
  }, {
    id: 621,
    name: "Snow 3D"
  }, {
    id: 658,
    name: "Paper Cut 3D"
  }, {
    id: 682,
    name: "Underwater 3D"
  }, {
    id: 685,
    name: "Metallic Shiny 3D"
  }, {
    id: 686,
    name: "Gradient 3D v2"
  }, {
    id: 688,
    name: "Beach 3D"
  }, {
    id: 704,
    name: "Crack 3D"
  }, {
    id: 705,
    name: "Wood 3D v2"
  }, {
    id: 725,
    name: "USA Flag 3D"
  }, {
    id: 727,
    name: "Christmas Sparkle 3D"
  }, {
    id: 793,
    name: "Christmas Snow 3D"
  }, {
    id: 794,
    name: "Gold Glitter 3D"
  }, {
    id: 798,
    name: "Decorative Metal 3D"
  }, {
    id: 801,
    name: "Paint 3D"
  }, {
    id: 802,
    name: "Glossy Silver 3D"
  }, {
    id: 803,
    name: "Foil Balloon 3D"
  }, {
    id: 817,
    name: "Comic 3D"
  }],
  gaming: [{
    id: 218,
    name: "League of Legends"
  }, {
    id: 221,
    name: "Overwatch Cover"
  }, {
    id: 231,
    name: "LOL Pentakill"
  }, {
    id: 233,
    name: "CS:GO"
  }, {
    id: 242,
    name: "LOL Avatar"
  }, {
    id: 292,
    name: "Overwatch Logo"
  }, {
    id: 293,
    name: "Overwatch Avatar"
  }, {
    id: 313,
    name: "Galaxy Class"
  }, {
    id: 320,
    name: "Polygon Logo"
  }, {
    id: 361,
    name: "Icon Logo"
  }, {
    id: 364,
    name: "Mascot Logo"
  }, {
    id: 366,
    name: "Wolf Galaxy"
  }, {
    id: 384,
    name: "Project Yasuo"
  }, {
    id: 401,
    name: "PUBG Cover"
  }, {
    id: 402,
    name: "PUBG Banner"
  }],
  metal: [{
    id: 108,
    name: "Metal Logo"
  }, {
    id: 156,
    name: "3D Wooden Logo"
  }, {
    id: 397,
    name: "Cute Pig 3D"
  }, {
    id: 685,
    name: "Metallic Shiny"
  }, {
    id: 798,
    name: "Decorative Metal"
  }, {
    id: 802,
    name: "Glossy Silver"
  }]
};
const ALL_EFFECTS = Object.values(EFFECTS).flat();
function randFrom(_0x3fe3dd) {
  return _0x3fe3dd[Math.floor(Math.random() * _0x3fe3dd.length)];
}
function randEffect(_0x526b41) {
  if (_0x526b41 && EFFECTS[_0x526b41]) {
    return randFrom(EFFECTS[_0x526b41]);
  }
  return randFrom(ALL_EFFECTS);
}
async function generateEphoto(_0x4d8366, _0x497fb9, _0x443fd3 = 30000) {
  const _0x3af49c = BASE + "?effectId=" + _0x4d8366 + "&text=" + encodeURIComponent(_0x497fb9);
  const _0x1e8259 = new AbortController();
  const _0x1c4cc6 = setTimeout(() => _0x1e8259.abort(), _0x443fd3);
  try {
    const _0x4920ab = await fetch(_0x3af49c, {
      signal: _0x1e8259.signal,
      headers: {
        "User-Agent": "Gaaju/1.0"
      }
    });
    if (!_0x4920ab.ok) {
      throw new Error("HTTP " + _0x4920ab.status);
    }
    const _0x43d188 = await _0x4920ab.json();
    if (!_0x43d188.success) {
      throw new Error(_0x43d188.message || "Generation failed");
    }
    return _0x43d188;
  } finally {
    clearTimeout(_0x1c4cc6);
  }
}
module.exports = {
  name: "ephoto",
  aliases: ["texteffect", "textart", "ep", "etext", "fancytext", "effect360"],
  description: "Generate stylish text effect images — .ephoto <text> [| category | effectId]",
  category: "image",
  async execute(_0x5b0733, _0x30921a, _0x1a6cb8, _0x5d7e97) {
    const _0x4473aa = _0x30921a.key.remoteJid;
    const _0x7547b8 = getBotName();
    const _0x2ca5be = "╔═|〔  🎨 EPHOTO 〕";
    const _0x81a69d = "╚═|〔 " + _0x7547b8 + " 〕";
    const _0x3d2da8 = "║";
    if (!_0x1a6cb8.length || _0x1a6cb8[0].toLowerCase() === "list") {
      const _0x902d3a = Object.entries(EFFECTS).map(([_0x2147ad, _0xe640c8]) => _0x3d2da8 + " ▸ *" + _0x2147ad + "* — " + _0xe640c8.length + " effects").join("\n");
      return _0x5b0733.sendMessage(_0x4473aa, {
        text: [_0x2ca5be, _0x3d2da8, _0x3d2da8 + " ▸ *Usage* : " + _0x5d7e97 + "ephoto <your text>", _0x3d2da8 + " ▸ *Category* : add | <category> for themed effects", _0x3d2da8 + " ▸ *Specific* : add | <effectId> for a specific effect", _0x3d2da8, _0x3d2da8 + " 📋 *Categories:*", _0x902d3a, _0x3d2da8, _0x3d2da8 + " 📌 *Examples:*", _0x3d2da8 + "  " + _0x5d7e97 + "ephoto Gaaju", _0x3d2da8 + "  " + _0x5d7e97 + "ephoto Gaaju | neon", _0x3d2da8 + "  " + _0x5d7e97 + "ephoto Gaaju | 3d", _0x3d2da8 + "  " + _0x5d7e97 + "ephoto Gaaju | gaming", _0x3d2da8 + "  " + _0x5d7e97 + "ephoto Gaaju | 68", _0x3d2da8, _0x81a69d].join("\n")
      }, {
        quoted: _0x30921a
      });
    }
    const _0x4ff914 = _0x1a6cb8.join(" ");
    const _0x44f233 = _0x4ff914.split("|").map(_0x373462 => _0x373462.trim()).filter(Boolean);
    const _0x2dff94 = _0x44f233[0];
    const _0x4e2572 = (_0x44f233[1] || "").toLowerCase().trim();
    if (!_0x2dff94) {
      return _0x5b0733.sendMessage(_0x4473aa, {
        text: _0x2ca5be + "\n" + _0x3d2da8 + "\n" + _0x3d2da8 + " ▸ *Usage* : " + _0x5d7e97 + "ephoto <your text>\n" + _0x3d2da8 + " ▸ *Help*  : " + _0x5d7e97 + "ephoto list\n" + _0x3d2da8 + "\n" + _0x81a69d
      }, {
        quoted: _0x30921a
      });
    }
    let _0x4088ef;
    if (_0x4e2572 && !isNaN(_0x4e2572)) {
      _0x4088ef = {
        id: parseInt(_0x4e2572),
        name: "Effect #" + _0x4e2572
      };
    } else if (_0x4e2572 && EFFECTS[_0x4e2572]) {
      _0x4088ef = randFrom(EFFECTS[_0x4e2572]);
    } else if (_0x4e2572) {
      _0x4088ef = {
        id: parseInt(_0x4e2572) || 68,
        name: "Effect #" + _0x4e2572
      };
    } else {
      _0x4088ef = randFrom(ALL_EFFECTS);
    }
    try {
      await _0x5b0733.sendMessage(_0x4473aa, {
        react: {
          text: "🎨",
          key: _0x30921a.key
        }
      });
      const _0x35fc84 = await generateEphoto(_0x4088ef.id, _0x2dff94);
      const _0x2508cb = await dlBuffer(_0x35fc84.imageUrl || _0x35fc84.downloadUrl);
      const _0x58e44e = [_0x2ca5be, _0x3d2da8, _0x3d2da8 + " ▸ *Text*   : " + (_0x2dff94.length > 50 ? _0x2dff94.substring(0, 50) + "..." : _0x2dff94), _0x3d2da8 + " ▸ *Effect* : " + (_0x35fc84.effect || _0x4088ef.name), _0x3d2da8 + " ▸ *ID*     : " + _0x4088ef.id, _0x3d2da8, _0x81a69d].join("\n");
      await _0x5b0733.sendMessage(_0x4473aa, {
        image: _0x2508cb,
        caption: _0x58e44e,
        mimetype: "image/jpeg"
      }, {
        quoted: _0x30921a
      });
    } catch (_0x1193fe) {
      await _0x5b0733.sendMessage(_0x4473aa, {
        text: _0x2ca5be + "\n" + _0x3d2da8 + "\n" + _0x3d2da8 + " ▸ *Status* : ❌ Failed\n" + _0x3d2da8 + " ▸ *Reason* : " + _0x1193fe.message + "\n" + _0x3d2da8 + " ▸ 💡 Try a different effect or shorter text\n" + _0x3d2da8 + "\n" + _0x81a69d
      }, {
        quoted: _0x30921a
      });
    }
  }
};