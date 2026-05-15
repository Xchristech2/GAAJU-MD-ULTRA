'use strict';

const {
  getBotName
} = require("../../lib/botname");
const NORMAL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAPS = {
  bold: {
    label: "Bold",
    map: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"
  },
  italic: {
    label: "Italic",
    map: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789"
  },
  bolditalic: {
    label: "Bold Italic",
    map: "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛0123456789"
  },
  script: {
    label: "Script",
    map: "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789"
  },
  fraktur: {
    label: "Fraktur",
    map: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789"
  },
  double: {
    label: "Double-struck",
    map: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"
  },
  monospace: {
    label: "Monospace",
    map: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"
  },
  sans: {
    label: "Sans-serif",
    map: "𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫"
  },
  sansbold: {
    label: "Sans Bold",
    map: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"
  },
  circle: {
    label: "Circled",
    map: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨"
  },
  square: {
    label: "Squared",
    map: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789"
  },
  fullwidth: {
    label: "Full Width",
    map: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９"
  },
  flip: {
    label: "Flipped",
    map: "ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎzɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎz0123456789",
    upper: "ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎz"
  }
};
const FONT_TABLES = {};
for (const [key, {
  map
}] of Object.entries(MAPS)) {
  FONT_TABLES[key] = {};
  const chars = [...map];
  [...NORMAL].forEach((_0x44b254, _0x120b2e) => {
    if (chars[_0x120b2e]) {
      FONT_TABLES[key][_0x44b254] = chars[_0x120b2e];
    }
  });
}
function convert(_0x17d53e, _0x38a3be) {
  const _0x58c09c = FONT_TABLES[_0x38a3be] || {};
  return [..._0x17d53e].map(_0x80ab8f => _0x58c09c[_0x80ab8f] || _0x80ab8f).join("");
}
const STYLE_NAMES = Object.keys(MAPS);
module.exports = [{
  name: "font",
  aliases: ["fonts", "textfont", "stylefont", "fancyfont", "fontstyle"],
  description: "Convert text to a fancy Unicode font — .font <style> <text>",
  category: "utility",
  async execute(_0x224341, _0x3429b3, _0x5752f8, _0x222924) {
    const _0x54ce01 = _0x3429b3.key.remoteJid;
    const _0x551bec = getBotName();
    const _0x2ec2e5 = (_0x5752f8[0] || "").toLowerCase();
    const _0x4ad7c8 = _0x5752f8.slice(1).join(" ").trim();
    if (!_0x2ec2e5 || !MAPS[_0x2ec2e5] || !_0x4ad7c8) {
      const _0x19c3ad = STYLE_NAMES.map(_0x4010ba => "║ ▸ *" + _0x4010ba + "* — " + convert("Hello", _0x4010ba)).join("\n");
      return _0x224341.sendMessage(_0x54ce01, {
        text: ["╔═|〔  FONT STYLES ✍️ 〕", "║", _0x19c3ad, "║", "║ 💡 *Usage* : " + _0x222924 + "font <style> <text>", "║ 💡 *Example*: " + _0x222924 + "font bold Hello World", "║", "╚═|〔 " + _0x551bec + " 〕"].join("\n")
      }, {
        quoted: _0x3429b3
      });
    }
    const _0x16ef5e = convert(_0x4ad7c8, _0x2ec2e5);
    await _0x224341.sendMessage(_0x54ce01, {
      text: ["╔═|〔  FONT — " + MAPS[_0x2ec2e5].label + " ✍️ 〕", "║", "║ " + _0x16ef5e, "║", "╚═|〔 " + _0x551bec + " 〕"].join("\n")
    }, {
      quoted: _0x3429b3
    });
  }
}, {
  name: "allfont",
  aliases: ["allfonts", "fontall", "showfonts", "fontpreview"],
  description: "Show text in all font styles at once — .allfont <text>",
  category: "utility",
  async execute(_0x5dccd3, _0x12ee63, _0x5688d0, _0x484f3c) {
    const _0x179daf = _0x12ee63.key.remoteJid;
    const _0x250b41 = getBotName();
    const _0x1c40bb = _0x5688d0.join(" ").trim() || "Hello";
    const _0x323c10 = STYLE_NAMES.map(_0x6a89b3 => "║ *" + MAPS[_0x6a89b3].label + "*\n║ " + convert(_0x1c40bb, _0x6a89b3)).join("\n║\n");
    await _0x5dccd3.sendMessage(_0x179daf, {
      text: ["╔═|〔  ALL FONTS ✍️ 〕", "║", "║ Text: *" + _0x1c40bb + "*", "║", _0x323c10, "║", "╚═|〔 " + _0x250b41 + " 〕"].join("\n")
    }, {
      quoted: _0x12ee63
    });
  }
}, {
  name: "reverse",
  aliases: ["reversetext", "flip text", "textreverse", "backwards"],
  description: "Reverse any text — .reverse <text>",
  category: "utility",
  async execute(_0x343624, _0x4a7b9b, _0x3b0276, _0x4cde61) {
    const _0x39e883 = _0x4a7b9b.key.remoteJid;
    const _0x4fa561 = getBotName();
    const _0x25b4a1 = _0x3b0276.join(" ").trim();
    if (!_0x25b4a1) {
      return _0x343624.sendMessage(_0x39e883, {
        text: "╔═|〔  REVERSE ↩️ 〕\n║\n║ ▸ *Usage* : " + _0x4cde61 + "reverse <text>\n║\n╚═|〔 " + _0x4fa561 + " 〕"
      }, {
        quoted: _0x4a7b9b
      });
    }
    const _0x4c9643 = [..._0x25b4a1].reverse().join("");
    await _0x343624.sendMessage(_0x39e883, {
      text: "╔═|〔  REVERSE ↩️ 〕\n║\n║ *Input*  : " + _0x25b4a1 + "\n║ *Output* : " + _0x4c9643 + "\n║\n╚═|〔 " + _0x4fa561 + " 〕"
    }, {
      quoted: _0x4a7b9b
    });
  }
}];