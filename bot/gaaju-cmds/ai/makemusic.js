'use strict';

const {
  casperGet,
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
const GENRES = ["Pop", "Afrobeat", "Hip-hop", "R&B", "Rock", "Jazz", "Reggae", "Country", "Electronic", "Soul", "Blues", "Classical", "Trap", "Dancehall", "Gospel", "Indie", "Folk", "Lo-fi"];
const MOODS = ["Happy", "Sad", "Romantic", "Energetic", "Calm", "Passionate", "Melancholic", "Nostalgic", "Motivational", "Playful"];
const VOCALS = ["male", "female"];
function matchList(_0x339a5b, _0x23f9b7) {
  return _0x23f9b7.find(_0x28119c => _0x28119c.toLowerCase() === _0x339a5b.toLowerCase()) || null;
}
const makemusicCmd = {
  name: "makemusic",
  aliases: ["aimusic", "musicai", "genmusic", "songgen", "aitrack", "musicgen"],
  description: "Generate a full AI-composed MP3 song from a text prompt",
  category: "ai",
  async execute(_0x162527, _0x2af46b, _0x5b22ce, _0x1729c4) {
    const _0x43647f = _0x2af46b.key.remoteJid;
    const _0x73e145 = getBotName();
    if (!_0x5b22ce.length) {
      return _0x162527.sendMessage(_0x43647f, {
        text: ["╔═|〔  🎵 AI MUSIC GENERATOR 〕", "║", "║ ▸ *Usage*    : " + _0x1729c4 + "makemusic <prompt>", "║ ▸ *Genre*    : add | <genre> to set (optional)", "║ ▸ *Mood*     : add | <mood> to set (optional)", "║ ▸ *Vocal*    : add | Male or Female (optional)", "║ ▸ *No vocals*: add | instrumental (optional)", "║", "║ 📌 *Examples*", "║  " + _0x1729c4 + "makemusic a love song about Nairobi nights", "║  " + _0x1729c4 + "makemusic party anthem | Afrobeat | Energetic | Female", "║  " + _0x1729c4 + "makemusic peaceful vibes | Lo-fi | Calm | instrumental", "║  " + _0x1729c4 + "makemusic hustle motivation | Hip-hop | Motivational", "║", "║ 🎼 *Genres*  : Pop, Afrobeat, Hip-hop, R&B, Rock, Jazz,", "║               Reggae, Country, Electronic, Soul, Blues,", "║               Classical, Trap, Dancehall, Gospel, Indie,", "║               Folk, Lo-fi", "║ 🎭 *Moods*   : Happy, Sad, Romantic, Energetic, Calm,", "║               Passionate, Melancholic, Nostalgic,", "║               Motivational, Playful", "║", "║ ⏳ *Note* : Generation takes ~2-3 minutes", "║", "╚═|〔 " + _0x73e145 + " 〕"].join("\n")
      }, {
        quoted: _0x2af46b
      });
    }
    const _0x51973e = _0x5b22ce.join(" ");
    const _0x14c8d2 = _0x51973e.split("|").map(_0x46c282 => _0x46c282.trim()).filter(Boolean);
    let _0x51e692 = _0x14c8d2[0];
    let _0x3a52ce = null;
    let _0x37b7aa = null;
    let _0x17faa1 = null;
    let _0x244385 = false;
    for (let _0xf0ae8a = 1; _0xf0ae8a < _0x14c8d2.length; _0xf0ae8a++) {
      const _0x2857b9 = _0x14c8d2[_0xf0ae8a].trim();
      if (_0x2857b9.toLowerCase() === "instrumental") {
        _0x244385 = true;
        continue;
      }
      const _0xbdae7e = matchList(_0x2857b9, GENRES);
      if (_0xbdae7e) {
        _0x3a52ce = _0xbdae7e;
        continue;
      }
      const _0x23ead3 = matchList(_0x2857b9, MOODS);
      if (_0x23ead3) {
        _0x37b7aa = _0x23ead3;
        continue;
      }
      if (VOCALS.includes(_0x2857b9.toLowerCase())) {
        _0x17faa1 = _0x2857b9.charAt(0).toUpperCase() + _0x2857b9.slice(1).toLowerCase();
        continue;
      }
    }
    if (!_0x51e692) {
      return _0x162527.sendMessage(_0x43647f, {
        text: "╔═|〔  🎵 AI MUSIC 〕\n║\n║ ▸ Please provide a prompt!\n║ ▸ *Usage* : " + _0x1729c4 + "makemusic <prompt>\n║\n╚═|〔 " + _0x73e145 + " 〕"
      }, {
        quoted: _0x2af46b
      });
    }
    try {
      await _0x162527.sendMessage(_0x43647f, {
        react: {
          text: "🎵",
          key: _0x2af46b.key
        }
      });
    } catch {}
    const _0x422ab5 = _0x3a52ce || "Pop";
    const _0x5c2a94 = _0x37b7aa || "Happy";
    const _0x2ca2c0 = _0x244385 ? "Instrumental" : _0x17faa1 || "Male";
    await _0x162527.sendMessage(_0x43647f, {
      text: ["╔═|〔  🎵 AI MUSIC GENERATOR 〕", "║", "║ ▸ *Prompt* : " + _0x51e692.substring(0, 60) + (_0x51e692.length > 60 ? "..." : ""), "║ ▸ *Genre*  : " + _0x422ab5, "║ ▸ *Mood*   : " + _0x5c2a94, "║ ▸ *Vocal*  : " + _0x2ca2c0, "║", "║ ⏳ Generating your song... (2-3 mins)", "║ 🎧 Sit tight, AI is composing! 🔥", "║", "╚═|〔 " + _0x73e145 + " 〕"].join("\n")
    }, {
      quoted: _0x2af46b
    });
    try {
      const _0xd790f9 = {
        prompt: _0x51e692,
        genre: _0x422ab5,
        mood: _0x5c2a94
      };
      if (_0x17faa1) {
        _0xd790f9.vocal = _0x2ca2c0;
      }
      if (_0x244385) {
        _0xd790f9.instrumental = "true";
      }
      let _0x293d07;
      let _0x18c58f;
      for (let _0x3bf615 = 1; _0x3bf615 <= 3; _0x3bf615++) {
        try {
          _0x293d07 = await casperGet("/api/tools/text-to-music", _0xd790f9, 210000);
          _0x18c58f = null;
          break;
        } catch (_0x17e9f9) {
          _0x18c58f = _0x17e9f9;
          const _0x5f3bb6 = /50[234]/.test(_0x17e9f9.message);
          if (_0x5f3bb6 && _0x3bf615 < 3) {
            await new Promise(_0x39918d => setTimeout(_0x39918d, _0x3bf615 * 15000));
            continue;
          }
          throw _0x17e9f9;
        }
      }
      if (_0x18c58f) {
        throw _0x18c58f;
      }
      if (!_0x293d07.success) {
        throw new Error(_0x293d07.error || _0x293d07.message || "Music generation failed");
      }
      const _0x172ece = _0x293d07.audioUrl || _0x293d07.audio_url || _0x293d07.url;
      if (!_0x172ece) {
        throw new Error("No audio URL in response");
      }
      const _0x411cf1 = await dlBuffer(_0x172ece);
      const _0x105b08 = _0x293d07.title || _0x51e692.substring(0, 40);
      const _0x363cf2 = ["╔═|〔  🎵 AI MUSIC READY 〕", "║", "║ ▸ *Title*  : " + _0x105b08, "║ ▸ *Genre*  : " + (_0x293d07.genre || _0x422ab5), "║ ▸ *Mood*   : " + (_0x293d07.mood || _0x5c2a94), "║ ▸ *Vocal*  : " + _0x2ca2c0, "║ ▸ *Prompt* : " + _0x51e692.substring(0, 50) + (_0x51e692.length > 50 ? "..." : ""), "║", "║ 🤖 Powered by Toosii AI 🔥", "║", "╚═|〔 " + _0x73e145 + " 〕"].join("\n");
      await _0x162527.sendMessage(_0x43647f, {
        audio: _0x411cf1,
        mimetype: "audio/mpeg",
        ptt: false,
        fileName: (_0x105b08.replace(/[^\w\s-]/g, "").trim() || "toosii-music") + ".mp3",
        caption: _0x363cf2
      }, {
        quoted: _0x2af46b
      });
    } catch (_0x3dc592) {
      const _0x428555 = /50[234]/.test(_0x3dc592.message);
      const _0xe0b785 = _0x428555 ? "Casper servers are busy right now — tried 3 times" : _0x3dc592.message;
      const _0x3bc9f0 = _0x428555 ? "⏳ Wait a few minutes then try again" : "💡 Try again — generation can sometimes timeout";
      await _0x162527.sendMessage(_0x43647f, {
        text: ["╔═|〔  🎵 AI MUSIC 〕", "║", "║ ▸ *Status* : ❌ Failed", "║ ▸ *Reason* : " + _0xe0b785, "║", "║ " + _0x3bc9f0, "║", "╚═|〔 " + _0x73e145 + " 〕"].join("\n")
      }, {
        quoted: _0x2af46b
      });
    }
  }
};
module.exports = [makemusicCmd];