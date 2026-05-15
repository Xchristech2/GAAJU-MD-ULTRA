'use strict';

const diceGames = new Map();
const MAX_PLAYERS = 6;
const MAX_ROUNDS = 3;
const DICE_FACES = ["", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
function getSender(_0x429083) {
  return _0x429083.key.participant || _0x429083.key.remoteJid;
}
function shortNum(_0x504f92) {
  return _0x504f92.replace(/[^0-9]/g, "").slice(-6);
}
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}
module.exports = [{
  name: "dice",
  aliases: ["startdice", "dicegame"],
  description: "Start a Dice Game in the group",
  category: "games",
  async execute(_0x31bec4, _0x77ba3, _0x2f551c, _0x53d27c, _0x554488) {
    const _0x1534e1 = _0x77ba3.key.remoteJid;
    if (!_0x1534e1.endsWith("@g.us")) {
      return _0x31bec4.sendMessage(_0x1534e1, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x77ba3
      });
    }
    try {
      await _0x31bec4.sendMessage(_0x1534e1, {
        react: {
          text: "🎲",
          key: _0x77ba3.key
        }
      });
    } catch {}
    if (diceGames.has(_0x1534e1)) {
      return _0x31bec4.sendMessage(_0x1534e1, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ A game already exists\n║ ▸ Use *" + _0x53d27c + "diceend* to end it\n║\n╚═╝"
      }, {
        quoted: _0x77ba3
      });
    }
    const _0x597f8f = getSender(_0x77ba3);
    diceGames.set(_0x1534e1, {
      host: _0x597f8f,
      players: [_0x597f8f],
      scores: {
        [_0x597f8f]: 0
      },
      rollsThisRound: {},
      round: 1,
      started: false,
      timeout: setTimeout(() => {
        diceGames.delete(_0x1534e1);
        _0x31bec4.sendMessage(_0x1534e1, {
          text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Game expired (idle)\n║\n╚═╝"
        }).catch(() => {});
      }, 600000)
    });
    await _0x31bec4.sendMessage(_0x1534e1, {
      text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ 🎲 @" + shortNum(_0x597f8f) + " started a Dice Game!\n║\n║ ▸ Type *" + _0x53d27c + "dicejoin* to join\n║ ▸ Host: *" + _0x53d27c + "dicebegin* to start\n║ ▸ Rules: 3 rounds, highest total wins\n║\n╚═╝",
      mentions: [_0x597f8f]
    }, {
      quoted: _0x77ba3
    });
  }
}, {
  name: "dicejoin",
  aliases: ["joindice"],
  description: "Join a waiting Dice Game",
  category: "games",
  async execute(_0x5c99c7, _0x1f4a07, _0x283965, _0x224de4, _0x2b7567) {
    const _0x560cf8 = _0x1f4a07.key.remoteJid;
    const _0x2a431a = getSender(_0x1f4a07);
    const _0xe4cd9b = diceGames.get(_0x560cf8);
    if (!_0xe4cd9b) {
      return _0x5c99c7.sendMessage(_0x560cf8, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ No game waiting. Use *" + _0x224de4 + "dice*\n║\n╚═╝"
      }, {
        quoted: _0x1f4a07
      });
    }
    if (_0xe4cd9b.started) {
      return _0x5c99c7.sendMessage(_0x560cf8, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Game already started!\n║\n╚═╝"
      }, {
        quoted: _0x1f4a07
      });
    }
    if (_0xe4cd9b.players.includes(_0x2a431a)) {
      return _0x5c99c7.sendMessage(_0x560cf8, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ You already joined!\n║\n╚═╝"
      }, {
        quoted: _0x1f4a07
      });
    }
    if (_0xe4cd9b.players.length >= MAX_PLAYERS) {
      return _0x5c99c7.sendMessage(_0x560cf8, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Game is full (" + MAX_PLAYERS + " players max)\n║\n╚═╝"
      }, {
        quoted: _0x1f4a07
      });
    }
    _0xe4cd9b.players.push(_0x2a431a);
    _0xe4cd9b.scores[_0x2a431a] = 0;
    await _0x5c99c7.sendMessage(_0x560cf8, {
      text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ @" + shortNum(_0x2a431a) + " joined! (" + _0xe4cd9b.players.length + "/" + MAX_PLAYERS + ")\n║\n║ ▸ Players: " + _0xe4cd9b.players.map(_0x47363c => "@" + shortNum(_0x47363c)).join(", ") + "\n║\n╚═╝",
      mentions: _0xe4cd9b.players
    }, {
      quoted: _0x1f4a07
    });
  }
}, {
  name: "dicebegin",
  aliases: ["begindice", "startroll"],
  description: "Start the Dice Game (host only)",
  category: "games",
  async execute(_0x331485, _0x5b6507, _0x2cd885, _0x562743, _0x18d536) {
    const _0x3b8d25 = _0x5b6507.key.remoteJid;
    const _0x3d57ef = getSender(_0x5b6507);
    const _0x486426 = diceGames.get(_0x3b8d25);
    if (!_0x486426) {
      return _0x331485.sendMessage(_0x3b8d25, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ No game found. Use *" + _0x562743 + "dice*\n║\n╚═╝"
      }, {
        quoted: _0x5b6507
      });
    }
    if (_0x486426.started) {
      return _0x331485.sendMessage(_0x3b8d25, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Already started!\n║\n╚═╝"
      }, {
        quoted: _0x5b6507
      });
    }
    if (_0x3d57ef !== _0x486426.host) {
      return _0x331485.sendMessage(_0x3b8d25, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Only the host can start\n║\n╚═╝"
      }, {
        quoted: _0x5b6507
      });
    }
    if (_0x486426.players.length < 2) {
      return _0x331485.sendMessage(_0x3b8d25, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Need at least 2 players\n║\n╚═╝"
      }, {
        quoted: _0x5b6507
      });
    }
    _0x486426.started = true;
    _0x486426.rollsThisRound = {};
    await _0x331485.sendMessage(_0x3b8d25, {
      text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ 🎲 Game started! Round 1 of " + MAX_ROUNDS + "\n║\n║ ▸ Players: " + _0x486426.players.map(_0x2338cb => "@" + shortNum(_0x2338cb)).join(", ") + "\n║\n║ ▸ Everyone type *" + _0x562743 + "roll* to roll!\n║\n╚═╝",
      mentions: _0x486426.players
    }, {
      quoted: _0x5b6507
    });
  }
}, {
  name: "roll",
  aliases: ["rolldice", "throwdice"],
  description: "Roll the dice in an active Dice Game",
  category: "games",
  async execute(_0x1ad9e0, _0xbdb44c, _0x17d77b, _0x229644, _0x29bec7) {
    const _0x317296 = _0xbdb44c.key.remoteJid;
    const _0x2c8379 = getSender(_0xbdb44c);
    const _0xec51bd = diceGames.get(_0x317296);
    if (!_0xec51bd || !_0xec51bd.started) {
      return _0x1ad9e0.sendMessage(_0x317296, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ No active game. Use *" + _0x229644 + "dice*\n║\n╚═╝"
      }, {
        quoted: _0xbdb44c
      });
    }
    if (!_0xec51bd.players.includes(_0x2c8379)) {
      return _0x1ad9e0.sendMessage(_0x317296, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ You're not in this game\n║\n╚═╝"
      }, {
        quoted: _0xbdb44c
      });
    }
    if (_0xec51bd.rollsThisRound[_0x2c8379] !== undefined) {
      return _0x1ad9e0.sendMessage(_0x317296, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ You already rolled this round!\n║\n╚═╝"
      }, {
        quoted: _0xbdb44c
      });
    }
    const _0x59232c = rollDie();
    _0xec51bd.rollsThisRound[_0x2c8379] = _0x59232c;
    _0xec51bd.scores[_0x2c8379] += _0x59232c;
    await _0x1ad9e0.sendMessage(_0x317296, {
      text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ @" + shortNum(_0x2c8379) + " rolled " + DICE_FACES[_0x59232c] + " (" + _0x59232c + ")\n║ ▸ Total score: " + _0xec51bd.scores[_0x2c8379] + "\n║\n╚═╝",
      mentions: [_0x2c8379]
    }, {
      quoted: _0xbdb44c
    });
    const _0x5b8aa5 = Object.keys(_0xec51bd.rollsThisRound).length;
    if (_0x5b8aa5 < _0xec51bd.players.length) {
      return;
    }
    const _0x367152 = _0xec51bd.players.map(_0x4a227b => "║  @" + shortNum(_0x4a227b) + " — Round: " + DICE_FACES[_0xec51bd.rollsThisRound[_0x4a227b]] + " | Total: " + _0xec51bd.scores[_0x4a227b]).join("\n");
    if (_0xec51bd.round >= MAX_ROUNDS) {
      clearTimeout(_0xec51bd.timeout);
      const _0x2fc32f = [..._0xec51bd.players].sort((_0x5f4286, _0x52a834) => _0xec51bd.scores[_0x52a834] - _0xec51bd.scores[_0x5f4286]);
      const _0x4b42f7 = _0x2fc32f[0];
      const _0x4a3776 = _0xec51bd.scores[_0x4b42f7];
      const _0x5cc86c = _0x2fc32f.filter(_0x508b36 => _0xec51bd.scores[_0x508b36] === _0x4a3776);
      const _0xb422e = _0x5cc86c.length > 1 ? "║ ▸ 🤝 TIE between " + _0x5cc86c.map(_0x1ddfdf => "@" + shortNum(_0x1ddfdf)).join(" & ") + "!" : "║ ▸ 🏆 @" + shortNum(_0x4b42f7) + " WINS with " + _0x4a3776 + " points!";
      const _0x3b8035 = _0x2fc32f.map((_0x44e4c3, _0x87be6) => "║  " + (["🥇", "🥈", "🥉"][_0x87be6] || "▸") + " @" + shortNum(_0x44e4c3) + " — " + _0xec51bd.scores[_0x44e4c3] + " pts").join("\n");
      diceGames.delete(_0x317296);
      await _0x1ad9e0.sendMessage(_0x317296, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Round " + _0xec51bd.round + " results:\n" + _0x367152 + "\n║\n" + _0xb422e + "\n║\n║ ─ Final Scores ─\n" + _0x3b8035 + "\n║\n╚═╝",
        mentions: _0xec51bd.players
      });
    } else {
      _0xec51bd.round++;
      _0xec51bd.rollsThisRound = {};
      await _0x1ad9e0.sendMessage(_0x317296, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Round " + (_0xec51bd.round - 1) + " done!\n" + _0x367152 + "\n║\n║ ▸ Starting Round " + _0xec51bd.round + " of " + MAX_ROUNDS + "\n║ ▸ Everyone type *" + _0x229644 + "roll*!\n║\n╚═╝",
        mentions: _0xec51bd.players
      });
    }
  }
}, {
  name: "diceend",
  aliases: ["enddice", "stopdice"],
  description: "End the Dice Game",
  category: "games",
  async execute(_0x3b766c, _0x487f56, _0x2f61b5, _0x4e3bb4, _0x71332c) {
    const _0x31288a = _0x487f56.key.remoteJid;
    const _0x6e5f00 = getSender(_0x487f56);
    const _0x38dd8c = diceGames.get(_0x31288a);
    if (!_0x38dd8c) {
      return _0x3b766c.sendMessage(_0x31288a, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ No active game\n║\n╚═╝"
      }, {
        quoted: _0x487f56
      });
    }
    if (_0x6e5f00 !== _0x38dd8c.host && !_0x71332c?.isOwner?.()) {
      return _0x3b766c.sendMessage(_0x31288a, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Only the host or owner can end\n║\n╚═╝"
      }, {
        quoted: _0x487f56
      });
    }
    clearTimeout(_0x38dd8c.timeout);
    diceGames.delete(_0x31288a);
    await _0x3b766c.sendMessage(_0x31288a, {
      text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ 🎲 Game ended by @" + shortNum(_0x6e5f00) + "\n║\n╚═╝",
      mentions: [_0x6e5f00]
    }, {
      quoted: _0x487f56
    });
  }
}, {
  name: "dicescores",
  aliases: ["dicescore", "rollscores"],
  description: "Show current Dice Game scores",
  category: "games",
  async execute(_0x950bba, _0x205109, _0x5a5cfe, _0x260ba4, _0x23a990) {
    const _0x2037d8 = _0x205109.key.remoteJid;
    const _0x2b7f23 = diceGames.get(_0x2037d8);
    if (!_0x2b7f23) {
      return _0x950bba.sendMessage(_0x2037d8, {
        text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ No active game\n║\n╚═╝"
      }, {
        quoted: _0x205109
      });
    }
    const _0x340402 = [..._0x2b7f23.players].sort((_0x45e268, _0x22ccc3) => _0x2b7f23.scores[_0x22ccc3] - _0x2b7f23.scores[_0x45e268]);
    const _0x3ecb4c = _0x340402.map((_0x7a5990, _0x109552) => "║  " + (["🥇", "🥈", "🥉"][_0x109552] || _0x109552 + 1 + ".") + " @" + shortNum(_0x7a5990) + " — " + _0x2b7f23.scores[_0x7a5990] + " pts").join("\n");
    await _0x950bba.sendMessage(_0x2037d8, {
      text: "╔═|〔  DICE GAME 〕\n║\n║ ▸ Round " + _0x2b7f23.round + " of " + MAX_ROUNDS + "\n║\n" + _0x3ecb4c + "\n║\n╚═╝",
      mentions: _0x2b7f23.players
    }, {
      quoted: _0x205109
    });
  }
}];