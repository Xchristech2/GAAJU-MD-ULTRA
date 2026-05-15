'use strict';

const {
  getBotName
} = require("../../lib/botname");
const CG = "https://api.coingecko.com/api/v3";
async function cgFetch(_0xf2af70) {
  const _0x1ac38a = await fetch("" + CG + _0xf2af70, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent": "Gaaju/1.0",
      Accept: "application/json"
    }
  });
  if (_0x1ac38a.status === 429) {
    throw new Error("Rate limited — try again in 30 seconds");
  }
  if (!_0x1ac38a.ok) {
    throw new Error("CoinGecko HTTP " + _0x1ac38a.status);
  }
  return _0x1ac38a.json();
}
const KNOWN = {
  btc: "bitcoin",
  eth: "ethereum",
  bnb: "binancecoin",
  sol: "solana",
  xrp: "ripple",
  ada: "cardano",
  doge: "dogecoin",
  shib: "shiba-inu",
  dot: "polkadot",
  matic: "matic-network",
  ltc: "litecoin",
  avax: "avalanche-2",
  link: "chainlink",
  uni: "uniswap",
  atom: "cosmos",
  trx: "tron",
  near: "near",
  algo: "algorand",
  xlm: "stellar",
  vet: "vechain",
  pepe: "pepe",
  floki: "floki",
  ton: "the-open-network",
  apt: "aptos",
  arb: "arbitrum",
  op: "optimism",
  inj: "injective-protocol",
  sui: "sui"
};
async function resolveId(_0x33ccac) {
  const _0x5ecb3a = _0x33ccac.toLowerCase().trim();
  if (KNOWN[_0x5ecb3a]) {
    return {
      id: KNOWN[_0x5ecb3a],
      name: _0x5ecb3a.toUpperCase()
    };
  }
  try {
    const _0x21e4fc = await cgFetch("/simple/price?ids=" + encodeURIComponent(_0x5ecb3a) + "&vs_currencies=usd");
    if (_0x21e4fc[_0x5ecb3a]) {
      return {
        id: _0x5ecb3a,
        name: _0x5ecb3a
      };
    }
  } catch {}
  const _0x3bcc78 = await cgFetch("/search?query=" + encodeURIComponent(_0x5ecb3a));
  const _0xa838c1 = _0x3bcc78.coins?.[0];
  if (!_0xa838c1) {
    throw new Error("Coin not found: \"" + _0x33ccac + "\"");
  }
  return {
    id: _0xa838c1.id,
    name: _0xa838c1.name
  };
}
function arrow(_0x3c71a4) {
  if (_0x3c71a4 > 0) {
    return "📈 +" + _0x3c71a4.toFixed(2) + "%";
  }
  if (_0x3c71a4 < 0) {
    return "📉 " + _0x3c71a4.toFixed(2) + "%";
  }
  return "➡️ 0.00%";
}
function fmt(_0x1ac1fc) {
  if (_0x1ac1fc == null) {
    return "N/A";
  }
  if (_0x1ac1fc >= 1000000000000) {
    return "$" + (_0x1ac1fc / 1000000000000).toFixed(2) + "T";
  }
  if (_0x1ac1fc >= 1000000000) {
    return "$" + (_0x1ac1fc / 1000000000).toFixed(2) + "B";
  }
  if (_0x1ac1fc >= 1000000) {
    return "$" + (_0x1ac1fc / 1000000).toFixed(2) + "M";
  }
  if (_0x1ac1fc >= 1000) {
    return "$" + _0x1ac1fc.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  if (_0x1ac1fc >= 1) {
    return "$" + _0x1ac1fc.toFixed(4);
  }
  return "$" + _0x1ac1fc.toFixed(8);
}
module.exports = [{
  name: "crypto",
  aliases: ["coin", "coinprice", "cryptoprice", "price", "cryptocheck"],
  description: "Live cryptocurrency price — .crypto <coin>",
  category: "utility",
  async execute(_0x2eee3b, _0x18a8cd, _0xc693da, _0x14cbc8) {
    const _0x20b6f6 = _0x18a8cd.key.remoteJid;
    const _0x26281d = getBotName();
    try {
      await _0x2eee3b.sendMessage(_0x20b6f6, {
        react: {
          text: "💰",
          key: _0x18a8cd.key
        }
      });
    } catch {}
    const _0x1cd7ad = _0xc693da.join(" ").trim();
    if (!_0x1cd7ad) {
      return _0x2eee3b.sendMessage(_0x20b6f6, {
        text: ["╔═|〔  CRYPTO 💰 〕", "║", "║ ▸ *Usage*   : " + _0x14cbc8 + "crypto <coin>", "║ ▸ *Example* : " + _0x14cbc8 + "crypto bitcoin", "║ ▸ *Example* : " + _0x14cbc8 + "crypto BTC", "║ ▸ *Example* : " + _0x14cbc8 + "crypto doge", "║", "║ ▸ *Multi*   : " + _0x14cbc8 + "cryptotop — top 10 by market cap", "║", "╚═|〔 " + _0x26281d + " 〕"].join("\n")
      }, {
        quoted: _0x18a8cd
      });
    }
    try {
      const {
        id: _0x148656
      } = await resolveId(_0x1cd7ad);
      const [_0xc81b8b] = await cgFetch("/coins/markets?vs_currency=usd&ids=" + _0x148656 + "&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=1h,24h,7d");
      if (!_0xc81b8b) {
        throw new Error("No price data found");
      }
      const _0x2d7b39 = _0xc81b8b;
      const _0x343aa2 = ["╔═|〔  CRYPTO 💰 〕", "║", "║ ▸ *Coin*       : " + _0x2d7b39.name + " (" + (_0x2d7b39.symbol || "").toUpperCase() + ")", "║ ▸ *Rank*       : #" + (_0x2d7b39.market_cap_rank ?? "N/A"), "║", "║ ▸ *Price*      : " + fmt(_0x2d7b39.current_price), "║ ▸ *1h Change*  : " + arrow(_0x2d7b39.price_change_percentage_1h_in_currency), "║ ▸ *24h Change* : " + arrow(_0x2d7b39.price_change_percentage_24h), "║ ▸ *7d Change*  : " + arrow(_0x2d7b39.price_change_percentage_7d_in_currency), "║", "║ ▸ *Market Cap* : " + fmt(_0x2d7b39.market_cap), "║ ▸ *Volume 24h* : " + fmt(_0x2d7b39.total_volume), "║ ▸ *24h High*   : " + fmt(_0x2d7b39.high_24h), "║ ▸ *24h Low*    : " + fmt(_0x2d7b39.low_24h), "║ ▸ *Supply*     : " + (_0x2d7b39.circulating_supply ? Number(_0x2d7b39.circulating_supply).toLocaleString() : "N/A") + " " + (_0x2d7b39.symbol || "").toUpperCase(), "║ ▸ *ATH*        : " + fmt(_0x2d7b39.ath), "║", "║ ⏱️ Live via CoinGecko", "║", "╚═|〔 " + _0x26281d + " 〕"].join("\n");
      await _0x2eee3b.sendMessage(_0x20b6f6, {
        text: _0x343aa2
      }, {
        quoted: _0x18a8cd
      });
    } catch (_0xa90d05) {
      await _0x2eee3b.sendMessage(_0x20b6f6, {
        text: "╔═|〔  CRYPTO 〕\n║\n║ ▸ *Status* : ❌ " + _0xa90d05.message + "\n║\n╚═|〔 " + _0x26281d + " 〕"
      }, {
        quoted: _0x18a8cd
      });
    }
  }
}, {
  name: "cryptotop",
  aliases: ["topcrypto", "topcoins", "cryptolist", "coinlist"],
  description: "Top 10 cryptocurrencies by market cap — .cryptotop",
  category: "utility",
  async execute(_0x140ba8, _0x5e80c5, _0x49a060, _0x4d30fa) {
    const _0xba010b = _0x5e80c5.key.remoteJid;
    const _0x1b30da = getBotName();
    try {
      await _0x140ba8.sendMessage(_0xba010b, {
        react: {
          text: "📊",
          key: _0x5e80c5.key
        }
      });
    } catch {}
    try {
      const _0xeffbe1 = await cgFetch("/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");
      if (!_0xeffbe1?.length) {
        throw new Error("No data returned");
      }
      const _0x2b6d4e = _0xeffbe1.map((_0x1bedf3, _0x376d03) => {
        const _0x143163 = _0x1bedf3.price_change_percentage_24h;
        const _0x4ef3a0 = _0x143163 > 0 ? "📈" : _0x143163 < 0 ? "📉" : "➡️";
        return "║ *" + (_0x376d03 + 1) + ".* " + _0x1bedf3.name + " (" + (_0x1bedf3.symbol || "").toUpperCase() + ")\n║    " + fmt(_0x1bedf3.current_price) + "  " + _0x4ef3a0 + " " + (_0x143163 != null ? _0x143163.toFixed(2) + "%" : "N/A");
      }).join("\n║\n");
      await _0x140ba8.sendMessage(_0xba010b, {
        text: "╔═|〔  TOP 10 CRYPTO 📊 〕\n║\n" + _0x2b6d4e + "\n║\n║ 💡 " + _0x4d30fa + "crypto <coin> for details\n║\n╚═|〔 " + _0x1b30da + " 〕"
      }, {
        quoted: _0x5e80c5
      });
    } catch (_0x58ba5e) {
      await _0x140ba8.sendMessage(_0xba010b, {
        text: "╔═|〔  CRYPTO TOP 〕\n║\n║ ▸ *Status* : ❌ " + _0x58ba5e.message + "\n║\n╚═|〔 " + _0x1b30da + " 〕"
      }, {
        quoted: _0x5e80c5
      });
    }
  }
}];