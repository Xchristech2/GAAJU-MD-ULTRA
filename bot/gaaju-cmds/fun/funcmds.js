'use strict';

const {
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
function box(_0x3ae538, _0x42ecea, _0xd7f94c) {
  const _0x34df02 = getBotName();
  return "╔═|〔  " + _0x42ecea + " " + _0x3ae538 + " 〕\n║\n" + _0xd7f94c.filter(Boolean).join("\n") + "\n║\n╚═╝";
}
function err(_0x499e89, _0x2587e5, _0x333f0a) {
  const _0x59e7cd = getBotName();
  return "╔═|〔  " + _0x2587e5 + " " + _0x499e89 + " 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x333f0a + "\n║\n╚═╝";
}
function decode(_0x1ca894) {
  return String(_0x1ca894 || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#039;/g, "'");
}
async function todGet(_0x1faf96) {
  const _0x2ba0b4 = new AbortController();
  const _0x3a9d99 = setTimeout(() => _0x2ba0b4.abort(), 12000);
  try {
    const _0x200dd3 = await fetch("https://api.truthordarebot.xyz/v1/" + _0x1faf96, {
      signal: _0x2ba0b4.signal
    });
    if (!_0x200dd3.ok) {
      throw new Error("HTTP " + _0x200dd3.status);
    }
    const _0xad1e90 = await _0x200dd3.json();
    return _0xad1e90?.translations?.en || _0xad1e90?.question || "";
  } finally {
    clearTimeout(_0x3a9d99);
  }
}
function makeTodCmd({
  name: _0x588767,
  aliases: _0x1c7d9c,
  endpoint: _0x57f16e,
  title: _0x2fa6b7,
  icon: _0x5aeb0c
}) {
  return {
    name: _0x588767,
    aliases: _0x1c7d9c,
    description: "Get a random " + _0x2fa6b7.toLowerCase(),
    category: "fun",
    async execute(_0xc998c3, _0x1ad36e) {
      const _0x389dbc = _0x1ad36e.key.remoteJid;
      try {
        await _0xc998c3.sendMessage(_0x389dbc, {
          react: {
            text: _0x5aeb0c,
            key: _0x1ad36e.key
          }
        });
        const _0x209ff3 = await todGet(_0x57f16e);
        if (!_0x209ff3) {
          throw new Error("No data");
        }
        await _0xc998c3.sendMessage(_0x389dbc, {
          text: box(_0x2fa6b7, _0x5aeb0c, ["║ " + _0x209ff3])
        }, {
          quoted: _0x1ad36e
        });
      } catch (_0x2df5c6) {
        await _0xc998c3.sendMessage(_0x389dbc, {
          text: err(_0x2fa6b7, _0x5aeb0c, _0x2df5c6.message)
        }, {
          quoted: _0x1ad36e
        });
      }
    }
  };
}
const truthCmd = makeTodCmd({
  name: "truth",
  aliases: ["truthquestion", "truthordare", "asktruth"],
  endpoint: "truth",
  title: "TRUTH",
  icon: "🙊"
});
const dareCmd = makeTodCmd({
  name: "dare",
  aliases: ["darechallenge", "doit", "dareq"],
  endpoint: "dare",
  title: "DARE",
  icon: "🔥"
});
const wyrCmd = makeTodCmd({
  name: "wyr",
  aliases: ["wouldyourather", "rathergame", "rather"],
  endpoint: "wyr",
  title: "WOULD YOU RATHER",
  icon: "🤔"
});
const paranoiaCmd = makeTodCmd({
  name: "paranoia",
  aliases: ["paranoiagame", "paraq"],
  endpoint: "paranoia",
  title: "PARANOIA",
  icon: "👀"
});
const nhieCmd = makeTodCmd({
  name: "nhie",
  aliases: ["neverhaviever", "neverihave", "neverhave"],
  endpoint: "nhie",
  title: "NEVER HAVE I EVER",
  icon: "🤫"
});
const pickuplineCmd = {
  name: "pickupline",
  aliases: ["pickup", "flirt", "rizz", "line"],
  description: "Get a random pickup line",
  category: "fun",
  async execute(_0x5182f4, _0x542131) {
    const _0x426fc0 = _0x542131.key.remoteJid;
    try {
      await _0x5182f4.sendMessage(_0x426fc0, {
        react: {
          text: "😏",
          key: _0x542131.key
        }
      });
      const _0x93dedd = new AbortController();
      const _0x155e53 = setTimeout(() => _0x93dedd.abort(), 12000);
      const _0x52e42c = await fetch("https://rizzapi.vercel.app/random", {
        signal: _0x93dedd.signal
      });
      clearTimeout(_0x155e53);
      const _0x1132b0 = await _0x52e42c.json();
      const _0x47c552 = _0x1132b0?.text || _0x1132b0?.line;
      if (!_0x47c552) {
        throw new Error("No pickup line");
      }
      await _0x5182f4.sendMessage(_0x426fc0, {
        text: box("PICKUP LINE", "😏", ["║ 😉 " + _0x47c552])
      }, {
        quoted: _0x542131
      });
    } catch (_0x2bf552) {
      await _0x5182f4.sendMessage(_0x426fc0, {
        text: err("PICKUP LINE", "😏", _0x2bf552.message)
      }, {
        quoted: _0x542131
      });
    }
  }
};
const factCmd = {
  name: "fact",
  aliases: ["randomfact", "funfact", "didyouknow"],
  description: "Get a random fun fact",
  category: "fun",
  async execute(_0x4586d0, _0x599f2c) {
    const _0x25d10c = _0x599f2c.key.remoteJid;
    try {
      await _0x4586d0.sendMessage(_0x25d10c, {
        react: {
          text: "💡",
          key: _0x599f2c.key
        }
      });
      const _0x257fae = new AbortController();
      const _0x255b38 = setTimeout(() => _0x257fae.abort(), 12000);
      const _0x107d08 = await fetch("https://uselessfacts.jsph.pl/random.json?language=en", {
        signal: _0x257fae.signal
      });
      clearTimeout(_0x255b38);
      const _0x43c1f7 = await _0x107d08.json();
      if (!_0x43c1f7?.text) {
        throw new Error("No fact");
      }
      await _0x4586d0.sendMessage(_0x25d10c, {
        text: box("FUN FACT", "💡", ["║ 💡 " + _0x43c1f7.text])
      }, {
        quoted: _0x599f2c
      });
    } catch (_0x5720dc) {
      await _0x4586d0.sendMessage(_0x25d10c, {
        text: err("FUN FACT", "💡", _0x5720dc.message)
      }, {
        quoted: _0x599f2c
      });
    }
  }
};
const jokeCmd = {
  name: "joke",
  aliases: ["jokes", "funny", "laugh", "lol"],
  description: "Get a random joke",
  category: "fun",
  async execute(_0x4fa101, _0x295878) {
    const _0x55f574 = _0x295878.key.remoteJid;
    try {
      await _0x4fa101.sendMessage(_0x55f574, {
        react: {
          text: "😂",
          key: _0x295878.key
        }
      });
      const _0x3b9860 = new AbortController();
      const _0x392f7b = setTimeout(() => _0x3b9860.abort(), 12000);
      const _0x4761ca = await fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist", {
        signal: _0x3b9860.signal
      });
      clearTimeout(_0x392f7b);
      const _0x128e67 = await _0x4761ca.json();
      if (_0x128e67.error) {
        throw new Error("No joke available");
      }
      const _0x661a32 = _0x128e67.type === "twopart" ? ["║ 📣 " + decode(_0x128e67.setup), "║", "║ 😂 " + decode(_0x128e67.delivery)] : ["║ 😂 " + decode(_0x128e67.joke)];
      await _0x4fa101.sendMessage(_0x55f574, {
        text: box("JOKE", "😂", _0x661a32)
      }, {
        quoted: _0x295878
      });
    } catch (_0x5440bb) {
      await _0x4fa101.sendMessage(_0x55f574, {
        text: err("JOKE", "😂", _0x5440bb.message)
      }, {
        quoted: _0x295878
      });
    }
  }
};
const memeCmd = {
  name: "meme",
  aliases: ["randommeme", "reditmeme", "getmeme"],
  description: "Get a random Reddit meme",
  category: "fun",
  async execute(_0x131eaa, _0xed8568) {
    const _0x244204 = _0xed8568.key.remoteJid;
    const _0x1780de = getBotName();
    try {
      await _0x131eaa.sendMessage(_0x244204, {
        react: {
          text: "😹",
          key: _0xed8568.key
        }
      });
      const _0xc97a99 = new AbortController();
      const _0x2f7c52 = setTimeout(() => _0xc97a99.abort(), 15000);
      const _0x151562 = await fetch("https://meme-api.com/gimme", {
        signal: _0xc97a99.signal
      });
      clearTimeout(_0x2f7c52);
      const _0x1b23ae = await _0x151562.json();
      if (!_0x1b23ae?.url) {
        throw new Error("No meme");
      }
      if (_0x1b23ae.nsfw) {
        throw new Error("NSFW meme — skipped");
      }
      const _0x337242 = "╔═|〔  😹 MEME 〕\n║\n" + ("║ ▸ *" + _0x1b23ae.title + "*\n") + ("║ ▸ r/" + _0x1b23ae.subreddit + " · 👍 " + (_0x1b23ae.ups || 0).toLocaleString() + " · u/" + _0x1b23ae.author + "\n") + ("║ ▸ 🔗 " + _0x1b23ae.postLink + "\n║\n╚═╝");
      const _0x546689 = await dlBuffer(_0x1b23ae.url);
      const _0x2f8fb3 = _0x1b23ae.url.split("?")[0].split(".").pop()?.toLowerCase() || "jpg";
      const _0x5c088f = _0x2f8fb3 === "gif" ? "image/gif" : _0x2f8fb3 === "png" ? "image/png" : "image/jpeg";
      if (_0x2f8fb3 === "gif") {
        await _0x131eaa.sendMessage(_0x244204, {
          video: _0x546689,
          gifPlayback: true,
          caption: _0x337242
        }, {
          quoted: _0xed8568
        });
      } else {
        await _0x131eaa.sendMessage(_0x244204, {
          image: _0x546689,
          caption: _0x337242
        }, {
          quoted: _0xed8568
        });
      }
    } catch (_0x5a020e) {
      await _0x131eaa.sendMessage(_0x244204, {
        text: err("MEME", "😹", _0x5a020e.message)
      }, {
        quoted: _0xed8568
      });
    }
  }
};
const quizCmd = {
  name: "quiz",
  aliases: ["trivia", "question", "triviaquest", "q"],
  description: "Get a random trivia question",
  category: "fun",
  async execute(_0x1a424f, _0x4b1ba4) {
    const _0x2d7388 = _0x4b1ba4.key.remoteJid;
    try {
      await _0x1a424f.sendMessage(_0x2d7388, {
        react: {
          text: "🧠",
          key: _0x4b1ba4.key
        }
      });
      const _0x55bdd7 = new AbortController();
      const _0x31390f = setTimeout(() => _0x55bdd7.abort(), 12000);
      const _0x374b8f = await fetch("https://opentdb.com/api.php?amount=1", {
        signal: _0x55bdd7.signal
      });
      clearTimeout(_0x31390f);
      const _0x498946 = await _0x374b8f.json();
      if (_0x498946.response_code !== 0 || !_0x498946.results?.length) {
        throw new Error("No question available");
      }
      const _0x5501b2 = _0x498946.results[0];
      const _0x4563f4 = decode(_0x5501b2.question);
      const _0x1bf8a9 = decode(_0x5501b2.correct_answer);
      const _0x555f69 = _0x5501b2.incorrect_answers.map(decode);
      const _0x3e80b7 = [..._0x555f69, _0x1bf8a9].sort(() => Math.random() - 0.5);
      const _0x5049f8 = ["A", "B", "C", "D"];
      const _0x9bcc46 = _0x3e80b7.slice(0, 4).map((_0x1b61a1, _0x42473f) => "║   *" + _0x5049f8[_0x42473f] + ".*  " + _0x1b61a1 + (_0x1b61a1 === _0x1bf8a9 ? "  ✅" : ""));
      await _0x1a424f.sendMessage(_0x2d7388, {
        text: box("TRIVIA QUIZ", "🧠", ["║ 📚 *Category*   : " + decode(_0x5501b2.category), "║ 🎯 *Difficulty* : " + _0x5501b2.difficulty, "║", "║ ❓ *" + _0x4563f4 + "*", "║", ..._0x9bcc46, "║", "║ 💡 _Answer marked ✅ above_"])
      }, {
        quoted: _0x4b1ba4
      });
    } catch (_0x3b0174) {
      await _0x1a424f.sendMessage(_0x2d7388, {
        text: err("TRIVIA QUIZ", "🧠", _0x3b0174.message)
      }, {
        quoted: _0x4b1ba4
      });
    }
  }
};
const quoteCmd = {
  name: "zenquote",
  aliases: ["randomquote", "zenq", "qod"],
  description: "Get a random inspirational quote",
  category: "fun",
  async execute(_0x25c318, _0x51f039) {
    const _0x309d35 = _0x51f039.key.remoteJid;
    try {
      await _0x25c318.sendMessage(_0x309d35, {
        react: {
          text: "✨",
          key: _0x51f039.key
        }
      });
      const _0xae20c1 = new AbortController();
      const _0x378dd2 = setTimeout(() => _0xae20c1.abort(), 12000);
      const _0x28a57e = await fetch("https://zenquotes.io/api/random", {
        signal: _0xae20c1.signal
      });
      clearTimeout(_0x378dd2);
      const [_0x55cf18] = await _0x28a57e.json();
      if (!_0x55cf18?.q) {
        throw new Error("No quote");
      }
      await _0x25c318.sendMessage(_0x309d35, {
        text: box("QUOTE", "✨", ["║ 💬 _\"" + _0x55cf18.q + "\"_", "║", "║ — *" + (_0x55cf18.a || "Unknown") + "*"])
      }, {
        quoted: _0x51f039
      });
    } catch (_0x1522fd) {
      await _0x25c318.sendMessage(_0x309d35, {
        text: err("QUOTE", "✨", _0x1522fd.message)
      }, {
        quoted: _0x51f039
      });
    }
  }
};
const ROASTS = ["You're the human equivalent of a participation trophy — nobody asked for you, you serve no real purpose, and yet here you are, taking up space on the shelf.", "I'd roast you, but my mama said I'm not allowed to burn trash.", "You have the energy of a phone at 2% battery — barely alive, constantly complaining, and nobody wants to deal with you right now.", "You're proof that God has a sense of humor. He looked at the blueprint for a human being and said 'let's see what happens if we remove the charming parts.'", "Scientists say the universe is made up of protons, neutrons, and electrons. They forgot morons. You're filling that gap admirably.", "Your WiFi password is probably something like 'iamthebest' because you need to remind yourself of things nobody else believes.", "I've seen better-looking things crawl out of a gym bag at the end of the week — and those at least served a purpose.", "You're like a software update notification. Everyone ignores you, and when they finally pay attention, they regret it immediately.", "Calling you an idiot would be an insult to idiots. At least they have the decency to not know better. You choose this.", "You're the type of person who brings a fork to a soup kitchen and then complains the soup isn't finger food.", "If brains were petrol, you wouldn't have enough to power a toy car around the inside of a Cheerio.", "Your birth certificate should come with a refund policy.", "You're like a broken pencil: completely pointless, and people only pick you up when there's absolutely nothing else available.", "The last time someone was happy to see you, they were mixing you up with someone else.", "You speak like someone translated your thoughts from a dead language using a dictionary written by someone who had never spoken to a human.", "Your confidence is truly inspiring. It takes a special kind of person to be that wrong about themselves for that long.", "I heard your IQ test came back negative. The machine crashed, couldn't calculate results that low.", "You're like a cloud — when you disappear, it's a beautiful day.", "If personality was currency, you'd be broke AND in debt AND somehow still asking to borrow money.", "You're the type of person who googles their own name and is genuinely surprised there's no results.", "You bring nothing to the table. Literally. I've seen you at buffets. You don't even bring yourself a plate.", "If common sense was a superpower, you'd be the least threatening villain in the Marvel universe.", "You have the social awareness of a parking cone — fixed in one spot, impossible to reason with, and everyone just drives around you.", "Your vibe is like a wet sock — nobody wants it near them, and when they're stuck with it, it ruins their entire day.", "You're the human embodiment of laggy internet — constantly buffering, never delivering, and everyone's already closed the tab.", "I'd challenge you to a battle of wits, but I don't like fighting unarmed opponents.", "You're like a Monday morning — unwanted, exhausting, and way too loud about it.", "If overthinking was a skill, you'd be a genius. Unfortunately, results are what matter.", "You're the reason group chats have a mute button.", "Your greatest skill is starting things you never finish, which is ironic because even that sentence describes you perfectly.", "You have the kind of energy that makes plants lean away from you.", "Your advice is so useless, people thank you and then immediately do the opposite and somehow end up fine.", "You're so basic even your WiFi router gets bored of you and disconnects on purpose.", "You call yourself a vibe but you're more of a mild inconvenience on a Tuesday afternoon.", "You're the reason people pretend to be on their phone when they see you approaching from across the street.", "Scientists discovered a new element. They're calling it Roastium. It's unstable, dense, and embarrassingly bad under pressure. They named it after you.", "You're like expired milk — the moment people get close enough, they immediately know something is wrong.", "Your most productive moment today was probably picking which side of the bed to get up from — and you still managed to get that wrong.", "You walk into a room and the vibe doesn't shift — it gasps, buckles, and files for early retirement."];
const roastCmd = {
  name: "roast",
  aliases: ["flame", "diss", "burnit", "draghim", "savage"],
  description: "Get roasted hard",
  category: "fun",
  async execute(_0x58e4d7, _0x5c2471) {
    const _0xd8ecbf = _0x5c2471.key.remoteJid;
    const _0x1be61b = getBotName();
    try {
      await _0x58e4d7.sendMessage(_0xd8ecbf, {
        react: {
          text: "🔥",
          key: _0x5c2471.key
        }
      });
    } catch {}
    const _0x3309a7 = ROASTS[Math.floor(Math.random() * ROASTS.length)];
    const _0x3ee71a = "╔═|〔  🔥 ROAST 〕\n║\n";
    await _0x58e4d7.sendMessage(_0xd8ecbf, {
      text: _0x3ee71a + "║ " + _0x3309a7 + "\n║\n╚═╝"
    }, {
      quoted: _0x5c2471
    });
  }
};
module.exports = [truthCmd, dareCmd, wyrCmd, paranoiaCmd, nhieCmd, pickuplineCmd, factCmd, jokeCmd, memeCmd, quizCmd, quoteCmd, roastCmd];