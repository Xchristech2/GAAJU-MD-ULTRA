'use strict';

const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "weather",
  aliases: ["wthr", "forecast", "clima"],
  description: "Get current weather for any city",
  category: "utility",
  async execute(_0x174af1, _0x3059e4, _0x3415fb, _0x323022, _0x326ac7) {
    const _0x52b0c1 = _0x3059e4.key.remoteJid;
    const _0x40cd69 = getBotName();
    try {
      await _0x174af1.sendMessage(_0x52b0c1, {
        react: {
          text: "🌤️",
          key: _0x3059e4.key
        }
      });
    } catch {}
    const _0x31f126 = _0x3415fb.join(" ").trim();
    if (!_0x31f126) {
      return _0x174af1.sendMessage(_0x52b0c1, {
        text: "╔═|〔  WEATHER 〕\n║\n║ ▸ *Usage* : " + _0x323022 + "weather <city>\n║ ▸ *Example*: " + _0x323022 + "weather Nairobi\n║\n╚═|〔 " + _0x40cd69 + " 〕"
      }, {
        quoted: _0x3059e4
      });
    }
    try {
      const _0x21c372 = await fetch("https://wttr.in/" + encodeURIComponent(_0x31f126) + "?format=j1", {
        signal: AbortSignal.timeout(15000)
      });
      if (!_0x21c372.ok) {
        throw new Error("City not found");
      }
      const _0x40634a = await _0x21c372.json();
      const _0x181fd6 = _0x40634a.current_condition?.[0];
      const _0x4f6408 = _0x40634a.nearest_area?.[0];
      const _0x210377 = _0x4f6408?.areaName?.[0]?.value || _0x31f126;
      const _0x368be0 = _0x4f6408?.country?.[0]?.value || "";
      const _0x3b7bfa = _0x181fd6?.temp_C || "?";
      const _0x1d0d58 = _0x181fd6?.temp_F || "?";
      const _0x54ddad = _0x181fd6?.FeelsLikeC || "?";
      const _0x597a36 = _0x181fd6?.humidity || "?";
      const _0x4f5397 = _0x181fd6?.windspeedKmph || "?";
      const _0x34565e = _0x181fd6?.weatherDesc?.[0]?.value || "?";
      const _0x24df3d = _0x181fd6?.uvIndex || "?";
      const _0x1dc6d1 = {
        Sunny: "☀️",
        Clear: "🌙",
        "Partly cloudy": "⛅",
        Cloudy: "☁️",
        Overcast: "☁️",
        Rain: "🌧️",
        Drizzle: "🌦️",
        Thunder: "⛈️",
        Snow: "❄️",
        Mist: "🌫️",
        Fog: "🌫️",
        Haze: "🌫️"
      }[_0x34565e] || "🌡️";
      await _0x174af1.sendMessage(_0x52b0c1, {
        text: "╔═|〔  WEATHER 〕\n║\n║ ▸ *City*    : " + _0x210377 + ", " + _0x368be0 + "\n║ ▸ *Temp*    : " + _0x3b7bfa + "°C / " + _0x1d0d58 + "°F\n║ ▸ *Feels*   : " + _0x54ddad + "°C\n║ ▸ *Sky*     : " + _0x1dc6d1 + " " + _0x34565e + "\n║ ▸ *Humidity*: " + _0x597a36 + "%\n║ ▸ *Wind*    : " + _0x4f5397 + " km/h\n║ ▸ *UV Index*: " + _0x24df3d + "\n║\n╚═|〔 " + _0x40cd69 + " 〕"
      }, {
        quoted: _0x3059e4
      });
    } catch (_0x387755) {
      await _0x174af1.sendMessage(_0x52b0c1, {
        text: "╔═|〔  WEATHER 〕\n║\n║ ▸ *Status* : ❌ " + _0x387755.message + "\n║\n╚═|〔 " + _0x40cd69 + " 〕"
      }, {
        quoted: _0x3059e4
      });
    }
  }
};