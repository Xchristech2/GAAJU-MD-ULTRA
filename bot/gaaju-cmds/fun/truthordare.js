'use strict';

const {
  getBotName
} = require("../../lib/botname");
const TRUTHS = ["What's the most embarrassing thing you've ever done in public?", "Have you ever lied to get out of trouble? What was the lie?", "What is your biggest fear and why?", "What's the most childish thing you still do?", "Have you ever cheated on a test or game?", "What's the worst thing you've ever said about a friend behind their back?", "Have you ever pretended to be sick to avoid something? What was it?", "What's one secret you've never told anyone?", "What's the most embarrassing song on your playlist?", "Have you ever sent a text to the wrong person? What did it say?", "What's the strangest dream you've ever had?", "Have you ever stood someone up? What happened?", "What's the dumbest thing you've ever done for love?", "What's something you've done that you hope your parents never find out about?", "Have you ever walked into a room, forgotten why, and just pretended you knew?", "What's the most embarrassing nickname someone has given you?", "Have you ever ugly-cried at a movie? Which one?", "What's one thing you're terrible at but pretend to be good at?", "What's the pettiest thing you've ever done to get back at someone?", "Have you ever laughed so hard you cried in public?"];
const DARES = ["Send a voice note saying 'I love you' to the last person you texted", "Post an embarrassing childhood photo to your status for 10 minutes", "Call someone and sing them 'Happy Birthday' even if it's not their birthday", "Text your crush 'We need to talk' and wait 5 minutes before explaining", "Send a funny selfie to 3 people in your contacts", "Change your WhatsApp profile picture to a funny animal for 1 hour", "Type your next 5 messages using only your nose (or elbows)", "Send a voice note imitating a chicken for 30 seconds", "Text your mom or dad: 'I did something bad today'", "Send the 10th photo in your gallery to this group right now", "Do your best celebrity impression in a voice note", "Text the 5th person in your contacts: 'Are you okay? I had a dream about you'", "Send a voice note talking in a robot voice for 30 seconds", "Share your most recent Google search in this chat", "Change your bio to 'TOOSII-XD is life 🔥' for 30 minutes", "Send a voice note of you beatboxing for 20 seconds", "Share the last app you opened and what you were doing on it", "Send a voice note saying 'Hello? Is anyone there?' in a spooky voice", "Text someone: 'I know what you did' and don't explain for 2 minutes", "Send a selfie making the silliest face you can"];
function pick(_0x238e19) {
  return _0x238e19[Math.floor(Math.random() * _0x238e19.length)];
}
module.exports = [{
  name: "truth",
  aliases: ["asktruth", "confessnow", "truthquestion"],
  description: "Get a random truth question — .truth",
  category: "fun",
  async execute(_0x16183f, _0x446987, _0x5b92b0, _0x5e71d7) {
    const _0x3ec64a = _0x446987.key.remoteJid;
    const _0x59026e = getBotName();
    try {
      await _0x16183f.sendMessage(_0x3ec64a, {
        react: {
          text: "💬",
          key: _0x446987.key
        }
      });
    } catch {}
    const _0x41618d = (_0x446987.key.participant || _0x446987.key.remoteJid).split("@")[0].split(":")[0];
    await _0x16183f.sendMessage(_0x3ec64a, {
      text: ["╔═|〔  TRUTH 💬 〕", "║", "║ @" + _0x41618d + ", answer honestly:", "║", "║ 🤔 *" + pick(TRUTHS) + "*", "║", "║ ▸ No lying allowed! 😏", "║", "╚═|〔 " + _0x59026e + " 〕"].join("\n"),
      mentions: [_0x41618d + "@s.whatsapp.net"]
    }, {
      quoted: _0x446987
    });
  }
}, {
  name: "dare",
  aliases: ["dodare", "darechallenge", "darequest"],
  description: "Get a random dare challenge — .dare",
  category: "fun",
  async execute(_0x2cbec8, _0x2f5a6b, _0x49fd55, _0x279f2f) {
    const _0xe8f399 = _0x2f5a6b.key.remoteJid;
    const _0x3fd820 = getBotName();
    try {
      await _0x2cbec8.sendMessage(_0xe8f399, {
        react: {
          text: "😈",
          key: _0x2f5a6b.key
        }
      });
    } catch {}
    const _0xfe3801 = (_0x2f5a6b.key.participant || _0x2f5a6b.key.remoteJid).split("@")[0].split(":")[0];
    await _0x2cbec8.sendMessage(_0xe8f399, {
      text: ["╔═|〔  DARE 😈 〕", "║", "║ @" + _0xfe3801 + ", you DARE to:", "║", "║ 🎯 *" + pick(DARES) + "*", "║", "║ ▸ No backing out now! 👀", "║", "╚═|〔 " + _0x3fd820 + " 〕"].join("\n"),
      mentions: [_0xfe3801 + "@s.whatsapp.net"]
    }, {
      quoted: _0x2f5a6b
    });
  }
}, {
  name: "tod",
  aliases: ["truthordare", "tordare", "totd"],
  description: "Get a random truth OR dare — .tod",
  category: "fun",
  async execute(_0x22dd5b, _0x2c717a, _0x10ebed, _0x3a9992) {
    const _0x3ad3c7 = _0x2c717a.key.remoteJid;
    const _0x43b48a = getBotName();
    const _0x45d367 = (_0x2c717a.key.participant || _0x2c717a.key.remoteJid).split("@")[0].split(":")[0];
    if (Math.random() < 0.5) {
      try {
        await _0x22dd5b.sendMessage(_0x3ad3c7, {
          react: {
            text: "💬",
            key: _0x2c717a.key
          }
        });
      } catch {}
      await _0x22dd5b.sendMessage(_0x3ad3c7, {
        text: ["╔═|〔  TRUTH OR DARE — TRUTH 💬 〕", "║", "║ @" + _0x45d367 + ", the universe chose *TRUTH*!", "║", "║ 🤔 *" + pick(TRUTHS) + "*", "║", "╚═|〔 " + _0x43b48a + " 〕"].join("\n"),
        mentions: [_0x45d367 + "@s.whatsapp.net"]
      }, {
        quoted: _0x2c717a
      });
    } else {
      try {
        await _0x22dd5b.sendMessage(_0x3ad3c7, {
          react: {
            text: "😈",
            key: _0x2c717a.key
          }
        });
      } catch {}
      await _0x22dd5b.sendMessage(_0x3ad3c7, {
        text: ["╔═|〔  TRUTH OR DARE — DARE 😈 〕", "║", "║ @" + _0x45d367 + ", the universe chose *DARE*!", "║", "║ 🎯 *" + pick(DARES) + "*", "║", "╚═|〔 " + _0x43b48a + " 〕"].join("\n"),
        mentions: [_0x45d367 + "@s.whatsapp.net"]
      }, {
        quoted: _0x2c717a
      });
    }
  }
}];