'use strict';

const games = new Map();
function emptyBoard() {
  return Array(9).fill(null);
}
function renderBoard(_0x9dfb57) {
  const _0x5d1235 = _0x5cc00a => _0x5cc00a === "X" ? "❌" : _0x5cc00a === "O" ? "⭕" : "⬜";
  return [_0x5d1235(_0x9dfb57[0]) + " " + _0x5d1235(_0x9dfb57[1]) + " " + _0x5d1235(_0x9dfb57[2]), _0x5d1235(_0x9dfb57[3]) + " " + _0x5d1235(_0x9dfb57[4]) + " " + _0x5d1235(_0x9dfb57[5]), _0x5d1235(_0x9dfb57[6]) + " " + _0x5d1235(_0x9dfb57[7]) + " " + _0x5d1235(_0x9dfb57[8])].join("\n");
}
function renderNumbered() {
  return "1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣";
}
const WINS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function checkWinner(_0x3079c4) {
  for (const [_0x147749, _0x536700, _0x3ed66b] of WINS) {
    if (_0x3079c4[_0x147749] && _0x3079c4[_0x147749] === _0x3079c4[_0x536700] && _0x3079c4[_0x147749] === _0x3079c4[_0x3ed66b]) {
      return _0x3079c4[_0x147749];
    }
  }
  if (_0x3079c4.every(Boolean)) {
    return "draw";
  } else {
    return null;
  }
}
function minimax(_0x43ffa9, _0x4ace74, _0x36be83 = -Infinity, _0x292452 = Infinity) {
  const _0x21e2a3 = checkWinner(_0x43ffa9);
  if (_0x21e2a3 === "O") {
    return 10;
  }
  if (_0x21e2a3 === "X") {
    return -10;
  }
  if (_0x21e2a3 === "draw") {
    return 0;
  }
  let _0x2133ba = _0x4ace74 ? -Infinity : Infinity;
  for (let _0x42e5e4 = 0; _0x42e5e4 < 9; _0x42e5e4++) {
    if (_0x43ffa9[_0x42e5e4]) {
      continue;
    }
    _0x43ffa9[_0x42e5e4] = _0x4ace74 ? "O" : "X";
    const _0x381a70 = minimax(_0x43ffa9, !_0x4ace74, _0x36be83, _0x292452);
    _0x43ffa9[_0x42e5e4] = null;
    if (_0x4ace74) {
      _0x2133ba = Math.max(_0x2133ba, _0x381a70);
      _0x36be83 = Math.max(_0x36be83, _0x2133ba);
    } else {
      _0x2133ba = Math.min(_0x2133ba, _0x381a70);
      _0x292452 = Math.min(_0x292452, _0x2133ba);
    }
    if (_0x292452 <= _0x36be83) {
      break;
    }
  }
  return _0x2133ba;
}
function getBestMove(_0x141cb5) {
  let _0x4f2677 = -Infinity;
  let _0x2feb51 = -1;
  for (let _0x18bf7d = 0; _0x18bf7d < 9; _0x18bf7d++) {
    if (_0x141cb5[_0x18bf7d]) {
      continue;
    }
    _0x141cb5[_0x18bf7d] = "O";
    const _0x31c582 = minimax(_0x141cb5, false);
    _0x141cb5[_0x18bf7d] = null;
    if (_0x31c582 > _0x4f2677) {
      _0x4f2677 = _0x31c582;
      _0x2feb51 = _0x18bf7d;
    }
  }
  return _0x2feb51;
}
function getSender(_0x39283c) {
  return _0x39283c.key.participant || _0x39283c.key.remoteJid;
}
function shortNum(_0xd7ade2) {
  return _0xd7ade2.replace(/[^0-9]/g, "").slice(-6);
}
const AI_JID = "AI@s.whatsapp.net";
module.exports = [{
  name: "tictactoe",
  aliases: ["ttt", "xo"],
  description: "Start a TicTacToe game. Mention a player or use \"ai\"",
  category: "games",
  async execute(_0xbe8ca8, _0x22fd47, _0x41e578, _0x1733de, _0x588563) {
    const _0x4c7c88 = _0x22fd47.key.remoteJid;
    if (!_0x4c7c88.endsWith("@g.us")) {
      return _0xbe8ca8.sendMessage(_0x4c7c88, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x22fd47
      });
    }
    try {
      await _0xbe8ca8.sendMessage(_0x4c7c88, {
        react: {
          text: "🎮",
          key: _0x22fd47.key
        }
      });
    } catch {}
    if (games.has(_0x4c7c88)) {
      return _0xbe8ca8.sendMessage(_0x4c7c88, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ A game is already running\n║ ▸ Use *" + _0x1733de + "tttend* to end it\n║\n╚═╝"
      }, {
        quoted: _0x22fd47
      });
    }
    const _0x17f649 = getSender(_0x22fd47);
    const _0x519a5f = _0x41e578.join(" ").toLowerCase().includes("ai");
    const _0x4b0d86 = _0x22fd47.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const _0x57bdc9 = _0x519a5f ? AI_JID : _0x4b0d86[0] || null;
    if (!_0x519a5f && !_0x57bdc9) {
      return _0xbe8ca8.sendMessage(_0x4c7c88, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ *Usage* : " + _0x1733de + "tictactoe @player\n║           " + _0x1733de + "tictactoe ai\n║\n╚═╝"
      }, {
        quoted: _0x22fd47
      });
    }
    if (!_0x519a5f && _0x57bdc9 === _0x17f649) {
      return _0xbe8ca8.sendMessage(_0x4c7c88, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ You can't play against yourself!\n║\n╚═╝"
      }, {
        quoted: _0x22fd47
      });
    }
    const _0x35efd3 = emptyBoard();
    const _0x33cdff = [_0x17f649, _0x57bdc9];
    games.set(_0x4c7c88, {
      board: _0x35efd3,
      players: _0x33cdff,
      currentTurn: 0,
      vsAI: _0x519a5f,
      waiting: !_0x519a5f,
      timeout: setTimeout(() => {
        games.delete(_0x4c7c88);
        _0xbe8ca8.sendMessage(_0x4c7c88, {
          text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ Game expired (10 min idle)\n║\n╚═╝"
        }).catch(() => {});
      }, 600000)
    });
    const _0x794952 = _0x519a5f ? [_0x17f649] : [_0x17f649, _0x57bdc9];
    const _0x3eb318 = _0x519a5f ? "🤖 AI" : "@" + shortNum(_0x57bdc9);
    const _0xac61e = _0x519a5f ? "╔═|〔  TICTACTOE 〕\n║\n║ ❌ *You* (@" + shortNum(_0x17f649) + ") vs ⭕ *AI* 🤖\n║\n║ " + renderBoard(_0x35efd3).split("\n").join("\n║ ") + "\n║\n║ ▸ Numbers guide:\n║ " + renderNumbered().split("\n").join("\n║ ") + "\n║\n║ ▸ Your turn! Reply with 1–9\n║\n╚═╝" : "╔═|〔  TICTACTOE 〕\n║\n║ ❌ @" + shortNum(_0x17f649) + " vs ⭕ " + _0x3eb318 + "\n║\n║ " + renderBoard(_0x35efd3).split("\n").join("\n║ ") + "\n║\n║ ▸ Numbers guide:\n║ " + renderNumbered().split("\n").join("\n║ ") + "\n║\n║ ▸ @" + shortNum(_0x57bdc9) + ", type *" + _0x1733de + "tttjoin* to accept!\n║\n╚═╝";
    await _0xbe8ca8.sendMessage(_0x4c7c88, {
      text: _0xac61e,
      mentions: _0x794952
    }, {
      quoted: _0x22fd47
    });
    if (_0x519a5f) {
      const _0x558867 = games.get(_0x4c7c88);
      _0x558867.waiting = false;
    }
  }
}, {
  name: "tttjoin",
  aliases: ["jointt", "jointtt"],
  description: "Join a waiting TicTacToe game",
  category: "games",
  async execute(_0x20d8cb, _0x524ccf, _0x5021db, _0x7a716e, _0x45b77b) {
    const _0x16e9d7 = _0x524ccf.key.remoteJid;
    const _0x139ad2 = getSender(_0x524ccf);
    const _0x3578ee = games.get(_0x16e9d7);
    if (!_0x3578ee) {
      return _0x20d8cb.sendMessage(_0x16e9d7, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ No game waiting. Use *" + _0x7a716e + "tictactoe @player*\n║\n╚═╝"
      }, {
        quoted: _0x524ccf
      });
    }
    if (!_0x3578ee.waiting) {
      return _0x20d8cb.sendMessage(_0x16e9d7, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ Game already started!\n║\n╚═╝"
      }, {
        quoted: _0x524ccf
      });
    }
    if (_0x139ad2 !== _0x3578ee.players[1]) {
      return _0x20d8cb.sendMessage(_0x16e9d7, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ You weren't invited to this game\n║\n╚═╝"
      }, {
        quoted: _0x524ccf
      });
    }
    _0x3578ee.waiting = false;
    const _0x230de5 = "╔═|〔  TICTACTOE 〕\n║\n║ ❌ @" + shortNum(_0x3578ee.players[0]) + " vs ⭕ @" + shortNum(_0x3578ee.players[1]) + "\n║\n║ " + renderBoard(_0x3578ee.board).split("\n").join("\n║ ") + "\n║\n║ ▸ Numbers guide:\n║ " + renderNumbered().split("\n").join("\n║ ") + "\n║\n║ ▸ @" + shortNum(_0x3578ee.players[0]) + "'s turn! Reply with 1–9\n║\n╚═╝";
    await _0x20d8cb.sendMessage(_0x16e9d7, {
      text: _0x230de5,
      mentions: _0x3578ee.players
    }, {
      quoted: _0x524ccf
    });
  }
}, {
  name: "tttboard",
  aliases: ["tttshow", "showboard"],
  description: "Show the current TicTacToe board",
  category: "games",
  async execute(_0x1570e5, _0x3d2e3b, _0x382be2, _0x90ba6a, _0x5a52f6) {
    const _0x3b462f = _0x3d2e3b.key.remoteJid;
    const _0x47edd5 = games.get(_0x3b462f);
    if (!_0x47edd5) {
      return _0x1570e5.sendMessage(_0x3b462f, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ No active game\n║\n╚═╝"
      }, {
        quoted: _0x3d2e3b
      });
    }
    const _0x142d69 = _0x47edd5.players[_0x47edd5.currentTurn];
    const _0x5bac08 = _0x47edd5.currentTurn === 0 ? "❌" : "⭕";
    const _0x5f1392 = "╔═|〔  TICTACTOE 〕\n║\n║ " + renderBoard(_0x47edd5.board).split("\n").join("\n║ ") + "\n║\n║ ▸ " + _0x5bac08 + " " + (_0x142d69 === AI_JID ? "AI" : "@" + shortNum(_0x142d69)) + "'s turn\n║\n╚═╝";
    await _0x1570e5.sendMessage(_0x3b462f, {
      text: _0x5f1392,
      mentions: _0x47edd5.players.filter(_0xdae2b5 => _0xdae2b5 !== AI_JID)
    }, {
      quoted: _0x3d2e3b
    });
  }
}, {
  name: "tttend",
  aliases: ["endttt", "endgame"],
  description: "End the current TicTacToe game",
  category: "games",
  async execute(_0x3d42db, _0x5c06b3, _0x4d8380, _0x57369a, _0x4661f3) {
    const _0x381a2c = _0x5c06b3.key.remoteJid;
    const _0x252dc0 = getSender(_0x5c06b3);
    const _0x13d80b = games.get(_0x381a2c);
    if (!_0x13d80b) {
      return _0x3d42db.sendMessage(_0x381a2c, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ No active game\n║\n╚═╝"
      }, {
        quoted: _0x5c06b3
      });
    }
    if (!_0x13d80b.players.includes(_0x252dc0) && !_0x4661f3?.isOwner?.()) {
      return _0x3d42db.sendMessage(_0x381a2c, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ Only a player or owner can end the game\n║\n╚═╝"
      }, {
        quoted: _0x5c06b3
      });
    }
    clearTimeout(_0x13d80b.timeout);
    games.delete(_0x381a2c);
    await _0x3d42db.sendMessage(_0x381a2c, {
      text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ Game ended by @" + shortNum(_0x252dc0) + "\n║\n╚═╝",
      mentions: [_0x252dc0]
    }, {
      quoted: _0x5c06b3
    });
  }
}, {
  name: "_tttmove",
  hidden: true,
  category: "games",
  async handleMove(_0x22032b, _0x19c8a0) {
    const _0x203283 = _0x19c8a0.key.remoteJid;
    if (!_0x203283.endsWith("@g.us")) {
      return false;
    }
    const _0x1c774e = games.get(_0x203283);
    if (!_0x1c774e || _0x1c774e.waiting) {
      return false;
    }
    const _0x368b86 = (_0x19c8a0.message?.conversation || _0x19c8a0.message?.extendedTextMessage?.text || "").trim();
    const _0x3fdfec = parseInt(_0x368b86);
    if (isNaN(_0x3fdfec) || _0x3fdfec < 1 || _0x3fdfec > 9) {
      return false;
    }
    const _0x46db46 = getSender(_0x19c8a0);
    if (_0x46db46 !== _0x1c774e.players[_0x1c774e.currentTurn]) {
      return false;
    }
    const _0x443061 = _0x3fdfec - 1;
    if (_0x1c774e.board[_0x443061]) {
      await _0x22032b.sendMessage(_0x203283, {
        text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ Cell " + _0x3fdfec + " is already taken! Pick another.\n║\n╚═╝"
      }, {
        quoted: _0x19c8a0
      });
      return true;
    }
    _0x1c774e.board[_0x443061] = _0x1c774e.currentTurn === 0 ? "X" : "O";
    const _0x1aaa4a = checkWinner(_0x1c774e.board);
    if (_0x1aaa4a) {
      clearTimeout(_0x1c774e.timeout);
      games.delete(_0x203283);
      const _0x44443e = _0x1aaa4a === "draw" ? null : _0x1c774e.players[_0x1aaa4a === "X" ? 0 : 1];
      const _0xc4cf0 = "║ " + renderBoard(_0x1c774e.board).split("\n").join("\n║ ");
      const _0x17a865 = _0x1aaa4a === "draw" ? "║ ▸ 🤝 It's a *DRAW*!" : _0x44443e === AI_JID ? "║ ▸ 🤖 *AI WINS!* Better luck next time." : "║ ▸ 🏆 @" + shortNum(_0x44443e) + " *WINS!*";
      await _0x22032b.sendMessage(_0x203283, {
        text: "╔═|〔  TICTACTOE 〕\n║\n" + _0xc4cf0 + "\n║\n" + _0x17a865 + "\n║\n╚═╝",
        mentions: _0x1c774e.players.filter(_0x760ec0 => _0x760ec0 !== AI_JID)
      }, {
        quoted: _0x19c8a0
      });
      return true;
    }
    _0x1c774e.currentTurn = 1 - _0x1c774e.currentTurn;
    if (_0x1c774e.vsAI && _0x1c774e.currentTurn === 1) {
      const _0x105593 = getBestMove(_0x1c774e.board);
      _0x1c774e.board[_0x105593] = "O";
      const _0x595645 = checkWinner(_0x1c774e.board);
      if (_0x595645) {
        clearTimeout(_0x1c774e.timeout);
        games.delete(_0x203283);
        const _0x5de87a = "║ " + renderBoard(_0x1c774e.board).split("\n").join("\n║ ");
        const _0x27da1d = _0x595645 === "draw" ? "║ ▸ 🤝 It's a *DRAW*!" : "║ ▸ 🤖 *AI WINS!* Better luck next time.";
        await _0x22032b.sendMessage(_0x203283, {
          text: "╔═|〔  TICTACTOE 〕\n║\n" + _0x5de87a + "\n║\n" + _0x27da1d + "\n║\n╚═╝",
          mentions: [_0x1c774e.players[0]]
        });
        return true;
      }
      _0x1c774e.currentTurn = 0;
      const _0x1e940f = "║ " + renderBoard(_0x1c774e.board).split("\n").join("\n║ ");
      await _0x22032b.sendMessage(_0x203283, {
        text: "╔═|〔  TICTACTOE 〕\n║\n" + _0x1e940f + "\n║\n║ ▸ 🤖 AI played. Your turn! (1–9)\n║\n╚═╝",
        mentions: [_0x1c774e.players[0]]
      });
      return true;
    }
    const _0x409e06 = _0x1c774e.players[_0x1c774e.currentTurn];
    const _0x37650f = _0x1c774e.currentTurn === 0 ? "❌" : "⭕";
    const _0x1a6dfc = "║ " + renderBoard(_0x1c774e.board).split("\n").join("\n║ ");
    await _0x22032b.sendMessage(_0x203283, {
      text: "╔═|〔  TICTACTOE 〕\n║\n" + _0x1a6dfc + "\n║\n║ ▸ " + _0x37650f + " @" + shortNum(_0x409e06) + "'s turn (1–9)\n║\n╚═╝",
      mentions: [_0x409e06]
    });
    return true;
  }
}];
module.exports.push({
  name: "move",
  aliases: ["tttmove", "mv"],
  description: "Make a move in TicTacToe (1-9)",
  category: "games",
  async execute(_0xb3076f, _0x349641, _0x2644bf, _0x2f177a, _0x339472) {
    const _0x4a2b13 = module.exports.find(_0x321c9c => _0x321c9c.name === "_tttmove");
    if (_0x4a2b13) {
      const _0x2f7e73 = _0x2644bf[0];
      if (!_0x2f7e73) {
        return _0xb3076f.sendMessage(_0x349641.key.remoteJid, {
          text: "╔═|〔  TICTACTOE 〕\n║\n║ ▸ *Usage* : " + _0x2f177a + "move <1-9>\n║\n╚═╝"
        }, {
          quoted: _0x349641
        });
      }
      const _0x2d040d = Object.assign({}, _0x349641, {
        message: {
          conversation: _0x2f7e73
        }
      });
      await _0x4a2b13.handleMove(_0xb3076f, _0x2d040d);
    }
  }
});