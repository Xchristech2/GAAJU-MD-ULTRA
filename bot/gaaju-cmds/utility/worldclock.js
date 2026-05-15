'use strict';

const {
  getBotName
} = require("../../lib/botname");
const CITIES = {
  nairobi: "Africa/Nairobi",
  lagos: "Africa/Lagos",
  cairo: "Africa/Cairo",
  accra: "Africa/Accra",
  johannesburg: "Africa/Johannesburg",
  jburg: "Africa/Johannesburg",
  joburg: "Africa/Johannesburg",
  addis: "Africa/Addis_Ababa",
  ababa: "Africa/Addis_Ababa",
  kampala: "Africa/Kampala",
  dar: "Africa/Dar_es_Salaam",
  mombasa: "Africa/Nairobi",
  kigali: "Africa/Kigali",
  lusaka: "Africa/Lusaka",
  harare: "Africa/Harare",
  casablanca: "Africa/Casablanca",
  tunis: "Africa/Tunis",
  algiers: "Africa/Algiers",
  dakar: "Africa/Dakar",
  abidjan: "Africa/Abidjan",
  accra: "Africa/Accra",
  newyork: "America/New_York",
  nyc: "America/New_York",
  new_york: "America/New_York",
  losangeles: "America/Los_Angeles",
  la: "America/Los_Angeles",
  lax: "America/Los_Angeles",
  chicago: "America/Chicago",
  houston: "America/Chicago",
  denver: "America/Denver",
  toronto: "America/Toronto",
  vancouver: "America/Vancouver",
  montreal: "America/Montreal",
  mexico: "America/Mexico_City",
  saopaulo: "America/Sao_Paulo",
  sp: "America/Sao_Paulo",
  buenosaires: "America/Argentina/Buenos_Aires",
  ba: "America/Argentina/Buenos_Aires",
  lima: "America/Lima",
  bogota: "America/Bogota",
  santiago: "America/Santiago",
  miami: "America/New_York",
  boston: "America/New_York",
  atlanta: "America/New_York",
  london: "Europe/London",
  paris: "Europe/Paris",
  berlin: "Europe/Berlin",
  madrid: "Europe/Madrid",
  rome: "Europe/Rome",
  amsterdam: "Europe/Amsterdam",
  moscow: "Europe/Moscow",
  istanbul: "Europe/Istanbul",
  athens: "Europe/Athens",
  stockholm: "Europe/Stockholm",
  oslo: "Europe/Oslo",
  helsinki: "Europe/Helsinki",
  warsaw: "Europe/Warsaw",
  prague: "Europe/Prague",
  budapest: "Europe/Budapest",
  vienna: "Europe/Vienna",
  zurich: "Europe/Zurich",
  lisbon: "Europe/Lisbon",
  dubai: "Asia/Dubai",
  abudhabi: "Asia/Dubai",
  riyadh: "Asia/Riyadh",
  mumbai: "Asia/Kolkata",
  delhi: "Asia/Kolkata",
  india: "Asia/Kolkata",
  kolkata: "Asia/Kolkata",
  bangalore: "Asia/Kolkata",
  hyderabad: "Asia/Kolkata",
  beijing: "Asia/Shanghai",
  shanghai: "Asia/Shanghai",
  china: "Asia/Shanghai",
  tokyo: "Asia/Tokyo",
  japan: "Asia/Tokyo",
  osaka: "Asia/Tokyo",
  seoul: "Asia/Seoul",
  korea: "Asia/Seoul",
  singapore: "Asia/Singapore",
  jakarta: "Asia/Jakarta",
  bangkok: "Asia/Bangkok",
  kualalumpur: "Asia/Kuala_Lumpur",
  kl: "Asia/Kuala_Lumpur",
  manila: "Asia/Manila",
  hongkong: "Asia/Hong_Kong",
  hk: "Asia/Hong_Kong",
  taipei: "Asia/Taipei",
  tehran: "Asia/Tehran",
  karachi: "Asia/Karachi",
  lahore: "Asia/Karachi",
  dhaka: "Asia/Dhaka",
  kathmandu: "Asia/Kathmandu",
  colombo: "Asia/Colombo",
  tashkent: "Asia/Tashkent",
  sydney: "Australia/Sydney",
  melbourne: "Australia/Melbourne",
  brisbane: "Australia/Brisbane",
  perth: "Australia/Perth",
  auckland: "Australia/Auckland",
  nz: "Pacific/Auckland",
  utc: "UTC",
  gmt: "UTC",
  est: "America/New_York",
  pst: "America/Los_Angeles",
  ist: "Asia/Kolkata",
  eat: "Africa/Nairobi",
  wat: "Africa/Lagos",
  cat: "Africa/Harare",
  cet: "Europe/Paris",
  eest: "Europe/Helsinki",
  jst: "Asia/Tokyo",
  cst: "Asia/Shanghai",
  sgt: "Asia/Singapore",
  aest: "Australia/Sydney",
  msk: "Europe/Moscow"
};
function fmtTime(_0x1ebdd0) {
  try {
    const _0x1b8560 = new Date();
    const _0x2612cf = {
      timeZone: _0x1ebdd0,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    const _0x215818 = _0x1b8560.toLocaleTimeString("en-US", _0x2612cf);
    const _0x5d3430 = _0x1b8560.toLocaleDateString("en-GB", {
      timeZone: _0x1ebdd0,
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    return {
      time: _0x215818,
      date: _0x5d3430
    };
  } catch {
    return null;
  }
}
const WORLD_ZONES = [{
  city: "Nairobi 🇰🇪",
  tz: "Africa/Nairobi"
}, {
  city: "Lagos 🇳🇬",
  tz: "Africa/Lagos"
}, {
  city: "London 🇬🇧",
  tz: "Europe/London"
}, {
  city: "Dubai 🇦🇪",
  tz: "Asia/Dubai"
}, {
  city: "India 🇮🇳",
  tz: "Asia/Kolkata"
}, {
  city: "Singapore 🇸🇬",
  tz: "Asia/Singapore"
}, {
  city: "Tokyo 🇯🇵",
  tz: "Asia/Tokyo"
}, {
  city: "New York 🇺🇸",
  tz: "America/New_York"
}, {
  city: "Los Angeles 🇺🇸",
  tz: "America/Los_Angeles"
}, {
  city: "Sydney 🇦🇺",
  tz: "Australia/Sydney"
}];
module.exports = [{
  name: "time",
  aliases: ["worldtime", "timezone", "clock", "whatsthetime", "timein"],
  description: "Get the current time in any city — .time <city>",
  category: "utility",
  async execute(_0x13af5e, _0x1ee7b1, _0x171e89, _0xd8967d) {
    const _0x10787a = _0x1ee7b1.key.remoteJid;
    const _0x29c110 = getBotName();
    try {
      await _0x13af5e.sendMessage(_0x10787a, {
        react: {
          text: "🕐",
          key: _0x1ee7b1.key
        }
      });
    } catch {}
    const _0x22a7c4 = _0x171e89.join("").toLowerCase().replace(/\s+/g, "").trim();
    if (!_0x22a7c4) {
      const _0x2e2ad1 = WORLD_ZONES.map(({
        city: _0x4389e1,
        tz: _0x21daea
      }) => {
        const _0x2ec79f = fmtTime(_0x21daea);
        if (_0x2ec79f) {
          return "║ ▸ *" + _0x4389e1 + "* : " + _0x2ec79f.time;
        } else {
          return null;
        }
      }).filter(Boolean).join("\n");
      return _0x13af5e.sendMessage(_0x10787a, {
        text: ["╔═|〔  WORLD CLOCK 🕐 〕", "║", _0x2e2ad1, "║", "║ 💡 " + _0xd8967d + "time <city> for any city", "║ 💡 " + _0xd8967d + "time nairobi | london | tokyo", "║", "╚═|〔 " + _0x29c110 + " 〕"].join("\n")
      }, {
        quoted: _0x1ee7b1
      });
    }
    const _0x38fc61 = CITIES[_0x22a7c4] || (() => {
      const _0x3dfa56 = Object.keys(CITIES).find(_0x492a3c => _0x492a3c.includes(_0x22a7c4) || _0x22a7c4.includes(_0x492a3c));
      if (_0x3dfa56) {
        return CITIES[_0x3dfa56];
      } else {
        return null;
      }
    })();
    if (!_0x38fc61) {
      return _0x13af5e.sendMessage(_0x10787a, {
        text: "╔═|〔  TIME 〕\n║\n║ ▸ ❌ City not found: *" + _0x171e89.join(" ") + "*\n║ ▸ Try: nairobi, london, dubai, tokyo, new york\n║\n╚═|〔 " + _0x29c110 + " 〕"
      }, {
        quoted: _0x1ee7b1
      });
    }
    const _0x3f9fb4 = fmtTime(_0x38fc61);
    if (!_0x3f9fb4) {
      return _0x13af5e.sendMessage(_0x10787a, {
        text: "╔═|〔  TIME 〕\n║\n║ ▸ ❌ Could not get time for " + _0x171e89.join(" ") + "\n║\n╚═|〔 " + _0x29c110 + " 〕"
      }, {
        quoted: _0x1ee7b1
      });
    }
    const _0x18594d = _0x171e89.join(" ").replace(/\b\w/g, _0x4f182a => _0x4f182a.toUpperCase());
    await _0x13af5e.sendMessage(_0x10787a, {
      text: ["╔═|〔  WORLD CLOCK 🕐 〕", "║", "║ ▸ *City*     : " + _0x18594d, "║ ▸ *Timezone* : " + _0x38fc61, "║", "║ 🕐 *Time*    : " + _0x3f9fb4.time, "║ 📅 *Date*    : " + _0x3f9fb4.date, "║", "╚═|〔 " + _0x29c110 + " 〕"].join("\n")
    }, {
      quoted: _0x1ee7b1
    });
  }
}, {
  name: "worldclock",
  aliases: ["timezones", "alltimes", "globaltimes", "timeworld"],
  description: "Show current time in major world cities — .worldclock",
  category: "utility",
  async execute(_0x27d404, _0x532729, _0x376532, _0x64b445) {
    const _0x596dcd = _0x532729.key.remoteJid;
    const _0x1f5b70 = getBotName();
    const _0x56f0dc = WORLD_ZONES.map(({
      city: _0x47b862,
      tz: _0x1d8205
    }) => {
      const _0x18a36a = fmtTime(_0x1d8205);
      if (_0x18a36a) {
        return "║ ▸ *" + _0x47b862 + "* : " + _0x18a36a.time + "\n║      📅 " + _0x18a36a.date;
      } else {
        return null;
      }
    }).filter(Boolean).join("\n║\n");
    await _0x27d404.sendMessage(_0x596dcd, {
      text: ["╔═|〔  WORLD CLOCK 🌍 〕", "║", _0x56f0dc, "║", "║ 💡 " + _0x64b445 + "time <city> — any city", "║", "╚═|〔 " + _0x1f5b70 + " 〕"].join("\n")
    }, {
      quoted: _0x532729
    });
  }
}];