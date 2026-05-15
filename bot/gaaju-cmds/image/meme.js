'use strict';

const {
  getBotName
} = require("../../lib/botname");
const SUBREDDITS = ["memes", "dankmemes", "me_irl", "teenagers", "funny", "AdviceAnimals", "ProgrammerHumor", "blackpeopletwitter"];
async function fetchMeme(_0x4d333a = "") {
  const _0x3de35f = _0x4d333a || SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];
  const _0x3d782b = "https://meme-api.com/gimme/" + encodeURIComponent(_0x3de35f);
  const _0x2b54db = await fetch(_0x3d782b, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent": "Gaaju/1.0"
    }
  });
  if (!_0x2b54db.ok) {
    throw new Error("Meme API HTTP " + _0x2b54db.status);
  }
  const _0x4616e4 = await _0x2b54db.json();
  if (!_0x4616e4.url) {
    throw new Error("No meme returned");
  }
  return _0x4616e4;
}
async function imgBuffer(_0x3a684b) {
  const _0x54fb74 = await fetch(_0x3a684b, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent": "Mozilla/5.0 Chrome/120"
    }
  });
  if (!_0x54fb74.ok) {
    throw new Error("Image HTTP " + _0x54fb74.status);
  }
  return Buffer.from(await _0x54fb74.arrayBuffer());
}
module.exports = {
  name: "meme",
  aliases: ["memes", "randmeme", "dankmeme", "funnymeme"],
  description: "Get a random meme image — .meme [subreddit]",
  category: "image",
  async execute(_0x250cba, _0x33605a, _0x1c0eec, _0x43cd2b) {
    const _0x31b19a = _0x33605a.key.remoteJid;
    const _0x3ad700 = getBotName();
    try {
      await _0x250cba.sendMessage(_0x31b19a, {
        react: {
          text: "😂",
          key: _0x33605a.key
        }
      });
    } catch {}
    const _0x1e3af9 = _0x1c0eec[0]?.replace(/^r\//, "") || "";
    try {
      const _0x429f57 = await fetchMeme(_0x1e3af9);
      const _0x55e61c = await imgBuffer(_0x429f57.url);
      const _0x482bb2 = ["╔═|〔  MEME 😂 〕", "║", "║ ▸ *Title* : " + (_0x429f57.title || "").slice(0, 80), "║ ▸ *From*  : r/" + _0x429f57.subreddit, "║ ▸ *Upvotes* : 👍 " + (_0x429f57.ups || 0).toLocaleString(), "║", "╚═|〔 " + _0x3ad700 + " 〕"].join("\n");
      await _0x250cba.sendMessage(_0x31b19a, {
        image: _0x55e61c,
        caption: _0x482bb2
      }, {
        quoted: _0x33605a
      });
    } catch (_0x3fdc37) {
      await _0x250cba.sendMessage(_0x31b19a, {
        text: "╔═|〔  MEME 〕\n║\n║ ▸ *Status* : ❌ " + _0x3fdc37.message + "\n║\n╚═|〔 " + _0x3ad700 + " 〕"
      }, {
        quoted: _0x33605a
      });
    }
  }
};