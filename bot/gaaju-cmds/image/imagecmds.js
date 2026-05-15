'use strict';

const {
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
async function fetchImg(_0x44eae1, _0x53e6b4 = 20000) {
  const _0x5e66d5 = new AbortController();
  const _0x4e77d4 = setTimeout(() => _0x5e66d5.abort(), _0x53e6b4);
  try {
    const _0x2f9b19 = await fetch(_0x44eae1, {
      signal: _0x5e66d5.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Gaaju/1.0"
      }
    });
    if (!_0x2f9b19.ok) {
      throw new Error("HTTP " + _0x2f9b19.status);
    }
    return _0x2f9b19;
  } finally {
    clearTimeout(_0x4e77d4);
  }
}
async function fetchJson(_0x4a5323, _0x17ff96 = 12000) {
  const _0x1ffafb = new AbortController();
  const _0x145abc = setTimeout(() => _0x1ffafb.abort(), _0x17ff96);
  try {
    const _0x2d3af4 = await fetch(_0x4a5323, {
      signal: _0x1ffafb.signal,
      headers: {
        "User-Agent": "Gaaju/1.0"
      }
    });
    if (!_0x2d3af4.ok) {
      throw new Error("HTTP " + _0x2d3af4.status);
    }
    return _0x2d3af4.json();
  } finally {
    clearTimeout(_0x145abc);
  }
}
const wallpaperCmd = {
  name: "wallpaper",
  aliases: ["wall", "wp", "wallpap"],
  description: "Get an HD wallpaper by keyword — .wallpaper <keyword>",
  category: "image",
  async execute(_0x4135cb, _0x11479b, _0x3b6308, _0x807933) {
    const _0x13cbfb = _0x11479b.key.remoteJid;
    const _0x27fb1e = getBotName();
    const _0x493c33 = _0x3b6308.join(" ").trim() || "nature";
    try {
      await _0x4135cb.sendMessage(_0x13cbfb, {
        react: {
          text: "🖼️",
          key: _0x11479b.key
        }
      });
      const _0x17a133 = Math.floor(Math.random() * 1000000);
      const _0x235ae4 = await fetchImg("https://loremflickr.com/1920/1080/" + encodeURIComponent(_0x493c33) + "?lock=" + _0x17a133);
      const _0x49ebaa = Buffer.from(await _0x235ae4.arrayBuffer());
      if (_0x49ebaa.length < 5000) {
        throw new Error("No image returned");
      }
      await _0x4135cb.sendMessage(_0x13cbfb, {
        image: _0x49ebaa,
        mimetype: "image/jpeg",
        caption: "╔═|〔  🖼️ WALLPAPER 〕\n║\n║ ▸ *Query* : " + _0x493c33 + "\n║ ▸ *Size*  : " + (_0x49ebaa.length / 1024).toFixed(0) + " KB\n║\n╚═|〔 " + _0x27fb1e + " 〕"
      }, {
        quoted: _0x11479b
      });
    } catch (_0x334419) {
      await _0x4135cb.sendMessage(_0x13cbfb, {
        text: "╔═|〔  🖼️ WALLPAPER 〕\n║\n║ ▸ *Usage*  : " + _0x807933 + "wallpaper <keyword>\n║ ▸ *Status* : ❌ Failed — " + _0x334419.message + "\n║\n╚═|〔 " + _0x27fb1e + " 〕"
      }, {
        quoted: _0x11479b
      });
    }
  }
};
const catCmd = {
  name: "cat",
  aliases: ["catpic", "kitty", "catphoto", "meow"],
  description: "Get a random cute cat photo",
  category: "image",
  async execute(_0x3a2888, _0x2ad89c) {
    const _0x472eb8 = _0x2ad89c.key.remoteJid;
    const _0x77d159 = getBotName();
    try {
      await _0x3a2888.sendMessage(_0x472eb8, {
        react: {
          text: "🐱",
          key: _0x2ad89c.key
        }
      });
      const _0x10a626 = await dlBuffer("https://cataas.com/cat?" + Date.now());
      if (!_0x10a626 || _0x10a626.length < 3000) {
        throw new Error("No cat today 😿");
      }
      await _0x3a2888.sendMessage(_0x472eb8, {
        image: _0x10a626,
        mimetype: "image/jpeg",
        caption: "╔═|〔  🐱 CAT PHOTO 〕\n║\n║ ▸ *Meow!* Here's your random cat 😻\n║\n╚═|〔 " + _0x77d159 + " 〕"
      }, {
        quoted: _0x2ad89c
      });
    } catch (_0x3db8f9) {
      await _0x3a2888.sendMessage(_0x472eb8, {
        text: "╔═|〔  🐱 CAT PHOTO 〕\n║\n║ ▸ *Status* : ❌ " + _0x3db8f9.message + "\n║\n╚═|〔 " + _0x77d159 + " 〕"
      }, {
        quoted: _0x2ad89c
      });
    }
  }
};
const dogCmd = {
  name: "dog",
  aliases: ["dogpic", "dogphoto", "puppy", "woof"],
  description: "Get a random cute dog photo",
  category: "image",
  async execute(_0x2f509b, _0x2f4d9f) {
    const _0x13e987 = _0x2f4d9f.key.remoteJid;
    const _0xb1c52 = getBotName();
    try {
      await _0x2f509b.sendMessage(_0x13e987, {
        react: {
          text: "🐶",
          key: _0x2f4d9f.key
        }
      });
      const _0x2a8047 = await fetchJson("https://dog.ceo/api/breeds/image/random");
      if (!_0x2a8047?.message) {
        throw new Error("No dog found");
      }
      const _0x4b5cdb = _0x2a8047.message;
      const _0x4bb7c3 = _0x4b5cdb.split(".").pop().toLowerCase();
      if (["mp4", "webm"].includes(_0x4bb7c3)) {
        throw new Error("Got video, retrying...");
      }
      const _0x1fdba9 = await dlBuffer(_0x4b5cdb);
      const _0x489bf2 = _0x4bb7c3 === "png" ? "image/png" : "image/jpeg";
      await _0x2f509b.sendMessage(_0x13e987, {
        image: _0x1fdba9,
        mimetype: _0x489bf2,
        caption: "╔═|〔  🐶 DOG PHOTO 〕\n║\n║ ▸ *Woof!* Here's your random dog 🐾\n║\n╚═|〔 " + _0xb1c52 + " 〕"
      }, {
        quoted: _0x2f4d9f
      });
    } catch (_0x403b25) {
      await _0x2f509b.sendMessage(_0x13e987, {
        text: "╔═|〔  🐶 DOG PHOTO 〕\n║\n║ ▸ *Status* : ❌ " + _0x403b25.message + "\n║\n╚═|〔 " + _0xb1c52 + " 〕"
      }, {
        quoted: _0x2f4d9f
      });
    }
  }
};
const foxCmd = {
  name: "fox",
  aliases: ["foxpic", "foxphoto", "foxy"],
  description: "Get a random fox photo",
  category: "image",
  async execute(_0x315cf1, _0xa7621f) {
    const _0x534d37 = _0xa7621f.key.remoteJid;
    const _0x1acd2d = getBotName();
    try {
      await _0x315cf1.sendMessage(_0x534d37, {
        react: {
          text: "🦊",
          key: _0xa7621f.key
        }
      });
      const _0xea5404 = await fetchJson("https://randomfox.ca/floof/");
      if (!_0xea5404?.image) {
        throw new Error("No fox found");
      }
      const _0x1b2ff3 = await dlBuffer(_0xea5404.image);
      await _0x315cf1.sendMessage(_0x534d37, {
        image: _0x1b2ff3,
        mimetype: "image/jpeg",
        caption: "╔═|〔  🦊 FOX PHOTO 〕\n║\n║ ▸ *Yip!* Here's your random fox 🦊\n║\n╚═|〔 " + _0x1acd2d + " 〕"
      }, {
        quoted: _0xa7621f
      });
    } catch (_0x1854da) {
      await _0x315cf1.sendMessage(_0x534d37, {
        text: "╔═|〔  🦊 FOX PHOTO 〕\n║\n║ ▸ *Status* : ❌ " + _0x1854da.message + "\n║\n╚═|〔 " + _0x1acd2d + " 〕"
      }, {
        quoted: _0xa7621f
      });
    }
  }
};
module.exports = [wallpaperCmd, catCmd, dogCmd, foxCmd];