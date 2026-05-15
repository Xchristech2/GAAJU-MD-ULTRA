'use strict';

const fs = require("fs");
const path = require("path");
const NOTES_FILE = path.join(__dirname, "../../data/notes.json");
function loadNotes() {
  try {
    return JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));
  } catch {
    return {};
  }
}
function saveNotes(_0x40c2c8) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(_0x40c2c8, null, 2), "utf-8");
}
function normJid(_0x5e4909) {
  return _0x5e4909.replace(/:\d+@/, "@").split("@")[0] + "@s.whatsapp.net";
}
function getSender(_0x510d14) {
  const _0x5f28d5 = _0x510d14.key.participant || _0x510d14.key.remoteJid;
  return normJid(_0x5f28d5);
}
function getQuotedText(_0x4c245d) {
  const _0x135722 = _0x4c245d.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!_0x135722) {
    return "";
  }
  return _0x135722.conversation || _0x135722.extendedTextMessage?.text || _0x135722.imageMessage?.caption || _0x135722.videoMessage?.caption || "";
}
module.exports = [{
  name: "notes",
  aliases: ["notehelp", "notesmenu"],
  description: "Show all notes commands",
  category: "utility",
  async execute(_0x307789, _0x26be5e, _0x4997c8, _0x366e0e, _0x30d701) {
    const _0x4c8ec8 = _0x26be5e.key.remoteJid;
    try {
      await _0x307789.sendMessage(_0x4c8ec8, {
        react: {
          text: "📝",
          key: _0x26be5e.key
        }
      });
    } catch {}
    await _0x307789.sendMessage(_0x4c8ec8, {
      text: "╔═|〔  📝 NOTES 〕\n║\n║ ▸ *" + _0x366e0e + "addnote* <text>    — Add a note\n║ ▸ *" + _0x366e0e + "getnote* <#>       — View a note\n║ ▸ *" + _0x366e0e + "getnotes*          — List all notes\n║ ▸ *" + _0x366e0e + "updatenote* <#> <text> — Edit\n║ ▸ *" + _0x366e0e + "delnote* <#>       — Delete one\n║ ▸ *" + _0x366e0e + "delallnotes*       — Delete all\n║\n║ ▸ Notes are private — only you can see them\n║ ▸ You can also reply to any message with\n║   *" + _0x366e0e + "addnote* to save it\n║\n╚═╝"
    }, {
      quoted: _0x26be5e
    });
  }
}, {
  name: "addnote",
  aliases: ["newnote", "makenote", "savenote"],
  description: "Add a new personal note",
  category: "utility",
  async execute(_0x130d56, _0xbfd899, _0x31c18c, _0x50aebd, _0x88055b) {
    const _0x161099 = _0xbfd899.key.remoteJid;
    const _0x1b65a3 = getSender(_0xbfd899);
    try {
      await _0x130d56.sendMessage(_0x161099, {
        react: {
          text: "📝",
          key: _0xbfd899.key
        }
      });
    } catch {}
    let _0x2a1779 = _0x31c18c.join(" ").trim();
    if (!_0x2a1779) {
      _0x2a1779 = getQuotedText(_0xbfd899);
    }
    if (!_0x2a1779) {
      return _0x130d56.sendMessage(_0x161099, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ *Usage* : " + _0x50aebd + "addnote <text>\n║           or reply to a message\n║\n╚═╝"
      }, {
        quoted: _0xbfd899
      });
    }
    const _0x5ba046 = loadNotes();
    if (!_0x5ba046[_0x1b65a3]) {
      _0x5ba046[_0x1b65a3] = [];
    }
    const _0x2bab59 = (_0x5ba046[_0x1b65a3].length > 0 ? Math.max(..._0x5ba046[_0x1b65a3].map(_0x2df3f6 => _0x2df3f6.id)) : 0) + 1;
    const _0x32330d = {
      id: _0x2bab59,
      content: _0x2a1779,
      createdAt: new Date().toISOString()
    };
    _0x5ba046[_0x1b65a3].push(_0x32330d);
    saveNotes(_0x5ba046);
    const _0x3a0a3d = _0x2a1779.length > 40 ? _0x2a1779.slice(0, 40) + "..." : _0x2a1779;
    await _0x130d56.sendMessage(_0x161099, {
      text: "╔═|〔  NOTES 〕\n║\n║ ▸ ✅ Note #" + _0x2bab59 + " saved!\n║ ▸ \"" + _0x3a0a3d + "\"\n║\n╚═╝"
    }, {
      quoted: _0xbfd899
    });
  }
}, {
  name: "getnote",
  aliases: ["viewnote", "shownote", "readnote"],
  description: "Get a specific note by number",
  category: "utility",
  async execute(_0x9e4b04, _0x1841cb, _0x666e86, _0x24aac7, _0x54ab51) {
    const _0x5f2ef4 = _0x1841cb.key.remoteJid;
    const _0xcf2025 = getSender(_0x1841cb);
    const _0x359aa2 = parseInt(_0x666e86[0]);
    if (isNaN(_0x359aa2)) {
      return _0x9e4b04.sendMessage(_0x5f2ef4, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ *Usage* : " + _0x24aac7 + "getnote <number>\n║\n╚═╝"
      }, {
        quoted: _0x1841cb
      });
    }
    const _0x464456 = loadNotes();
    const _0x4adadb = _0x464456[_0xcf2025] || [];
    const _0x37832b = _0x4adadb.find(_0xb2f7bb => _0xb2f7bb.id === _0x359aa2);
    if (!_0x37832b) {
      return _0x9e4b04.sendMessage(_0x5f2ef4, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ Note #" + _0x359aa2 + " not found\n║ ▸ Use *" + _0x24aac7 + "getnotes* to see all\n║\n╚═╝"
      }, {
        quoted: _0x1841cb
      });
    }
    const _0x1ea19a = new Date(_0x37832b.createdAt).toLocaleString("en-GB", {
      timeZone: process.env.TIME_ZONE || "Africa/Nairobi"
    });
    await _0x9e4b04.sendMessage(_0x5f2ef4, {
      text: "╔═|〔  📝 NOTE #" + _0x37832b.id + " 〕\n║\n" + _0x37832b.content.split("\n").map(_0x22e5c5 => "║  " + _0x22e5c5).join("\n") + "\n║\n║ ▸ Saved: " + _0x1ea19a + "\n║\n╚═╝"
    }, {
      quoted: _0x1841cb
    });
  }
}, {
  name: "getnotes",
  aliases: ["listnotes", "allnotes", "mynotes"],
  description: "List all your personal notes",
  category: "utility",
  async execute(_0x4c62cf, _0x4d31f3, _0x8022ca, _0xcf8738, _0x4a146c) {
    const _0x2f26b3 = _0x4d31f3.key.remoteJid;
    const _0x342183 = getSender(_0x4d31f3);
    const _0x4010ac = loadNotes();
    const _0x58f33f = _0x4010ac[_0x342183] || [];
    if (_0x58f33f.length === 0) {
      return _0x4c62cf.sendMessage(_0x2f26b3, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ You have no notes yet\n║ ▸ Use *" + _0xcf8738 + "addnote* to create one\n║\n╚═╝"
      }, {
        quoted: _0x4d31f3
      });
    }
    const _0x155b5c = _0x58f33f.map(_0x1385f1 => {
      const _0x2a9dfa = _0x1385f1.content.length > 45 ? _0x1385f1.content.slice(0, 45) + "..." : _0x1385f1.content;
      return "║  #" + _0x1385f1.id + " — " + _0x2a9dfa;
    }).join("\n");
    await _0x4c62cf.sendMessage(_0x2f26b3, {
      text: "╔═|〔  📝 YOUR NOTES (" + _0x58f33f.length + ") 〕\n║\n" + _0x155b5c + "\n║\n║ ▸ *" + _0xcf8738 + "getnote* <#> to read one\n║\n╚═╝"
    }, {
      quoted: _0x4d31f3
    });
  }
}, {
  name: "updatenote",
  aliases: ["editnote", "modifynote"],
  description: "Update an existing note",
  category: "utility",
  async execute(_0x350938, _0xb5e621, _0x305a7f, _0x58a54b, _0x22ff76) {
    const _0x17260a = _0xb5e621.key.remoteJid;
    const _0x27cc84 = getSender(_0xb5e621);
    const _0x19adc5 = parseInt(_0x305a7f[0]);
    const _0xab66a5 = _0x305a7f.slice(1).join(" ").trim();
    if (isNaN(_0x19adc5) || !_0xab66a5) {
      return _0x350938.sendMessage(_0x17260a, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ *Usage* : " + _0x58a54b + "updatenote <#> <new text>\n║\n╚═╝"
      }, {
        quoted: _0xb5e621
      });
    }
    const _0x1b7e1f = loadNotes();
    const _0x43fd2f = _0x1b7e1f[_0x27cc84] || [];
    const _0x107913 = _0x43fd2f.findIndex(_0x43f3f8 => _0x43f3f8.id === _0x19adc5);
    if (_0x107913 === -1) {
      return _0x350938.sendMessage(_0x17260a, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ Note #" + _0x19adc5 + " not found\n║\n╚═╝"
      }, {
        quoted: _0xb5e621
      });
    }
    _0x43fd2f[_0x107913].content = _0xab66a5;
    _0x43fd2f[_0x107913].updatedAt = new Date().toISOString();
    _0x1b7e1f[_0x27cc84] = _0x43fd2f;
    saveNotes(_0x1b7e1f);
    const _0x4fbddb = _0xab66a5.length > 40 ? _0xab66a5.slice(0, 40) + "..." : _0xab66a5;
    await _0x350938.sendMessage(_0x17260a, {
      text: "╔═|〔  NOTES 〕\n║\n║ ▸ ✅ Note #" + _0x19adc5 + " updated!\n║ ▸ \"" + _0x4fbddb + "\"\n║\n╚═╝"
    }, {
      quoted: _0xb5e621
    });
  }
}, {
  name: "delnote",
  aliases: ["deletenote", "removenote"],
  description: "Delete a specific note",
  category: "utility",
  async execute(_0x410ace, _0x2f7743, _0x2c6d32, _0x19e360, _0x1aaafe) {
    const _0x3100eb = _0x2f7743.key.remoteJid;
    const _0x5c6f55 = getSender(_0x2f7743);
    const _0x2d501a = parseInt(_0x2c6d32[0]);
    if (isNaN(_0x2d501a)) {
      return _0x410ace.sendMessage(_0x3100eb, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ *Usage* : " + _0x19e360 + "delnote <number>\n║\n╚═╝"
      }, {
        quoted: _0x2f7743
      });
    }
    const _0x44ca3e = loadNotes();
    const _0x3381c6 = _0x44ca3e[_0x5c6f55] || [];
    const _0x1e7e18 = _0x3381c6.findIndex(_0xbbde6 => _0xbbde6.id === _0x2d501a);
    if (_0x1e7e18 === -1) {
      return _0x410ace.sendMessage(_0x3100eb, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ Note #" + _0x2d501a + " not found\n║\n╚═╝"
      }, {
        quoted: _0x2f7743
      });
    }
    _0x3381c6.splice(_0x1e7e18, 1);
    _0x44ca3e[_0x5c6f55] = _0x3381c6;
    saveNotes(_0x44ca3e);
    await _0x410ace.sendMessage(_0x3100eb, {
      text: "╔═|〔  NOTES 〕\n║\n║ ▸ ✅ Note #" + _0x2d501a + " deleted\n║\n╚═╝"
    }, {
      quoted: _0x2f7743
    });
  }
}, {
  name: "delallnotes",
  aliases: ["clearnotes", "deleteallnotes"],
  description: "Delete all your notes",
  category: "utility",
  async execute(_0x182795, _0x3bff2a, _0x4e934b, _0x37d458, _0x57e5c7) {
    const _0x45d9c1 = _0x3bff2a.key.remoteJid;
    const _0x5cbf98 = getSender(_0x3bff2a);
    const _0x1fc27f = loadNotes();
    const _0x213177 = (_0x1fc27f[_0x5cbf98] || []).length;
    if (_0x213177 === 0) {
      return _0x182795.sendMessage(_0x45d9c1, {
        text: "╔═|〔  NOTES 〕\n║\n║ ▸ You have no notes to delete\n║\n╚═╝"
      }, {
        quoted: _0x3bff2a
      });
    }
    delete _0x1fc27f[_0x5cbf98];
    saveNotes(_0x1fc27f);
    await _0x182795.sendMessage(_0x45d9c1, {
      text: "╔═|〔  NOTES 〕\n║\n║ ▸ ✅ All " + _0x213177 + " note" + (_0x213177 > 1 ? "s" : "") + " deleted\n║\n╚═╝"
    }, {
      quoted: _0x3bff2a
    });
  }
}];