'use strict';
  const path = require('path');

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const COINS = ['bitcoin','btc','ethereum','eth','bnb','binancecoin','solana','sol',
      'dogecoin','doge','xrp','ripple','cardano','ada','shiba','shib','matic','polygon',
      'litecoin','ltc','pepe','ton','tron','trx','near','avalanche','avax','polkadot',
      'dot','chainlink','link','uni','uniswap','atom','cosmos','inj','sui','apt','aptos'];

  const ZODIAC = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio',
      'sagittarius','capricorn','aquarius','pisces'];

  const CURRENCIES = ['usd','eur','gbp','kes','ngn','usd','jpy','cny','inr','aed','aud',
      'cad','chf','zar','brl','mxn','rub','pkr','egp','ghs','tzs','ugx','rwf'];

  function extractUrl(text) {
      const m = text.match(/https?:\/\/[^\s]+/i);
      return m ? m[0] : null;
  }

  function clean(text, ...words) {
      let t = text;
      words.forEach(w => { t = t.replace(new RegExp('\\b' + w + '\\b', 'gi'), ''); });
      return t.replace(/\s+/g,' ').trim();
  }

  // ── Main intent detector ──────────────────────────────────────────────────────
  function detectIntent(text) {
      const t  = text.toLowerCase().trim();
      const url = extractUrl(text);

      // ── URL-based downloads ───────────────────────────────────────────────────
      if (url) {
          if (/tiktok\.com|vm\.tiktok/.test(url))     return { intent: 'tiktok',    args: [url] };
          if (/instagram\.com|instagr\.am/.test(url)) return { intent: 'instagram', args: [url] };
          if (/twitter\.com|x\.com|t\.co/.test(url)) return { intent: 'twitter',   args: [url] };
          if (/spotify\.com/.test(url))                 return { intent: 'spotify',   args: [url] };
          if (/youtu\.?be|youtube\.com/.test(url)) {
              if (/\bvideo\b|\bvid\b/.test(t)) return { intent: 'youtube', args: [url] };
              return { intent: 'yta', args: [url] };
          }
      }

      // ── Play / song ───────────────────────────────────────────────────────────
      if (/\b(play|playsong|download\s+song|download\s+music|play\s+song|play\s+music|sing)\b/.test(t)) {
          const q = text.replace(/^[\s\S]*?(play\s+song|play\s+music|download\s+song|download\s+music|playsong|play|sing)\s+/i,'').trim();
          return { intent: 'play', args: q.split(' ').filter(Boolean) };
      }

      // ── Download video ────────────────────────────────────────────────────────
      if (/\b(download\s+video|yt\s+video|youtube\s+video|video\s+download)\b/.test(t)) {
          const q = clean(text,'download','video','yt','youtube');
          return { intent: 'youtube', args: q.split(' ').filter(Boolean) };
      }

      // ── Weather ───────────────────────────────────────────────────────────────
      if (/\b(weather|forecast|clima)\b/.test(t)) {
          const m = text.match(/(?:weather|forecast|clima)\s+(?:in|for|at|of)?\s*(.+)/i);
          const city = m ? m[1].replace(/[?.!,]/g,'').trim() : clean(text,'weather','forecast','what','is','the','check');
          return { intent: 'weather', args: city.split(' ').filter(Boolean) };
      }

      // ── Crypto price ──────────────────────────────────────────────────────────
      if (/\b(crypto|coin|price\s+of|coin\s+price)\b/.test(t) || COINS.some(c => new RegExp('\\b'+c+'\\b').test(t))) {
          const found = COINS.find(c => new RegExp('\\b'+c+'\\b').test(t));
          const q = found || clean(text,'price','of','crypto','coin','the','what','is','check','current');
          return { intent: 'crypto', args: q.split(' ').filter(Boolean) };
      }

      // ── Currency conversion ───────────────────────────────────────────────────
      if (/\b(convert|currency|exchange|forex|rate)\b/.test(t) ||
          (CURRENCIES.some(c => new RegExp('\\b'+c+'\\b').test(t)) && /\bto\b/.test(t))) {
          // "convert 100 usd to kes"  |  "100 usd to kes"
          const m = text.match(/(\d+(?:\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i);
          if (m) return { intent: 'currency', args: [m[1], m[2].toUpperCase(), m[3].toUpperCase()] };
          return null;
      }

      // ── Translate ─────────────────────────────────────────────────────────────
      if (/\b(translate|translation)\b/.test(t)) {
          const lm = t.match(/\bto\s+(english|french|spanish|arabic|swahili|german|portuguese|chinese|japanese|korean|hindi|russian|italian|turkish)\b/i);
          const lang = lm ? lm[1] : 'english';
          const textToTrans = clean(text,'translate','translation','to '+lang);
          return { intent: 'translate', args: [lang, ...textToTrans.split(' ').filter(Boolean)] };
      }

      // ── Calculate ─────────────────────────────────────────────────────────────
      if (/\b(calculate|calc|compute|solve|math)\b/.test(t)) {
          const expr = clean(text,'calculate','calc','compute','solve','math','what is',"what's",'please');
          return { intent: 'calc', args: [expr] };
      }

      // ── Movie info ────────────────────────────────────────────────────────────
      if (/\b(movie|film|imdb|filminfo|movieinfo)\b/.test(t)) {
          const q = clean(text,'movie','film','imdb','info','about','search','find','tell me about');
          return { intent: 'movie', args: q.split(' ').filter(Boolean) };
      }

      // ── GitHub search ─────────────────────────────────────────────────────────
      if (/\b(github|git\s+user|git\s+profile|gh\s+user)\b/.test(t)) {
          const q = clean(text,'github','git','user','profile','search','find','show','gh');
          return { intent: 'github', args: q.split(' ').filter(Boolean) };
      }

      // ── Country info ──────────────────────────────────────────────────────────
      if (/\b(country|nation|countryinfo|tell me about)\b/.test(t) && !/\b(music|song|weather|movie)\b/.test(t)) {
          const q = clean(text,'country','nation','info','about','show','tell me');
          return { intent: 'country', args: q.split(' ').filter(Boolean) };
      }

      // ── Recipe ────────────────────────────────────────────────────────────────
      if (/\b(recipe|how\s+to\s+(make|cook|prepare|bake)|cook\s+|bake\s+)/.test(t)) {
          const q = clean(text,'recipe','how to','make','cook','prepare','bake','for','a','an','the');
          return { intent: 'recipe', args: q.split(' ').filter(Boolean) };
      }

      // ── Horoscope ─────────────────────────────────────────────────────────────
      if (/\b(horoscope|zodiac|star\s+sign|horo)\b/.test(t) || ZODIAC.some(z => t.includes(z))) {
          const sign = ZODIAC.find(z => t.includes(z)) || clean(text,'horoscope','zodiac','star sign','my','horo','today');
          return { intent: 'horoscope', args: [sign.trim()] };
      }

      // ── Magic 8-ball ──────────────────────────────────────────────────────────
      if (/\b(8ball|8-ball|eight\s+ball|magic\s+8|oracle|will i|should i|am i|is it|will he|will she)\b/.test(t)) {
          const q = clean(text,'8ball','8-ball','eight ball','magic 8','oracle');
          return { intent: '8ball', args: q.split(' ').filter(Boolean) };
      }

      // ── QR code ───────────────────────────────────────────────────────────────
      if (/\b(qr|qrcode|generate\s+qr|make\s+qr|create\s+qr|qr\s+code)\b/.test(t)) {
          const q = clean(text,'qr','qrcode','generate','make','create','code','for','a');
          return { intent: 'qr', args: q.split(' ').filter(Boolean) };
      }

      // ── Quote ─────────────────────────────────────────────────────────────────
      if (/\b(quote|inspire|motivation|motivational|random\s+quote|daily\s+quote)\b/.test(t)) {
          const q = clean(text,'quote','inspire','motivation','motivational','random','daily','give me','send me','a');
          return { intent: 'quote', args: q.split(' ').filter(Boolean) };
      }

      // ── Riddle ────────────────────────────────────────────────────────────────
      if (/\b(riddle|brain\s*teaser|puzzle|brainteaser)\b/.test(t)) {
          return { intent: 'riddle', args: [] };
      }

      // ── Compliment ────────────────────────────────────────────────────────────
      if (/\b(compliment|compliment me|say something nice|flatter)\b/.test(t)) {
          return { intent: 'compliment', args: [] };
      }

      // ── News ──────────────────────────────────────────────────────────────────
      if (/\b(news|headlines|latest\s+news|breaking\s+news)\b/.test(t)) {
          const q = clean(text,'news','headlines','latest','breaking','show','me','get','the','about');
          return { intent: 'news', args: q ? q.split(' ').filter(Boolean) : [] };
      }

      // ── Wiki / who is / what is ───────────────────────────────────────────────
      if (/\b(who\s+is|what\s+is|tell\s+me\s+about|explain|define|wiki|wikipedia)\b/.test(t)) {
          const q = clean(text,'who is','what is','tell me about','explain','define','wiki','wikipedia','please');
          return { intent: 'wiki', args: q.split(' ').filter(Boolean) };
      }

        // ── AI image generation ───────────────────────────────────────────────────
        if (/\b(imagine|draw|paint|generate\s+image|ai\s+image|ai\s+art|create\s+image|picture\s+of|image\s+of)\b/.test(t)) {
            const q = clean(text,'imagine','draw','paint','generate','ai','art','create','image','picture','of','a','an','the','me');
            return { intent: 'imagine', args: q.split(' ').filter(Boolean) };
        }

        // ── World clock / time ────────────────────────────────────────────────────
        if (/\b(time\s+in|what\s+time|world\s+clock|timezone|timein)\b/.test(t)) {
            const mc = text.match(/(?:time\s+in|what\s+time\s+is\s+it\s+in|clock\s+in|timezone\s+of)\s+(.+)/i);
            const city = mc ? mc[1].replace(/[?.!,]/g,'').trim() : clean(text,'time','what','is','it','in','world','clock','timezone');
            return { intent: 'time', args: city.split(' ').filter(Boolean) };
        }

        // ── TTS / voice ───────────────────────────────────────────────────────────
        if (/\b(say\s+in\s+voice|read\s+this|speak\s+this|voice\s+note|tts|text\s+to\s+speech|say\s+this)\b/.test(t)) {
            const q = clean(text,'say in voice','read this','speak this','voice note','tts','text to speech','say this','say','please');
            return { intent: 'tts', args: q.split(' ').filter(Boolean) };
        }

        // ── Sports player ─────────────────────────────────────────────────────────
        if (/\b(player\s+info|search\s+player|football\s+player|soccer\s+player|find\s+player)\b/.test(t)) {
            const q = clean(text,'player info','search player','football player','soccer player','find player','player','info','search','find');
            return { intent: 'player', args: q.split(' ').filter(Boolean) };
        }

        // ── Sports team ───────────────────────────────────────────────────────────
        if (/\b(team\s+info|search\s+team|football\s+team|soccer\s+team|find\s+team|club\s+info)\b/.test(t)) {
            const q = clean(text,'team info','search team','football team','soccer team','find team','club info','team','info','search','find','club');
            return { intent: 'team', args: q.split(' ').filter(Boolean) };
        }

        // ── Number fact ───────────────────────────────────────────────────────────
        if (/\b(number\s+fact|fact\s+about|numfact)\b/.test(t) ||
            (/\b(fact|interesting|trivia)\b/.test(t) && /\d+/.test(t))) {
            const num = (text.match(/\d+/) || ['random'])[0];
            return { intent: 'numfact', args: [num] };
        }

      return null;
  }

  // ── Load command helper ───────────────────────────────────────────────────────
  function loadCmd(relPath) {
      const mod = require(relPath);
      return Array.isArray(mod) ? mod[0] : mod;
  }

  // ── Execute a detected intent, returns true if handled ───────────────────────
  async function runIntent(sock, msg, detected, prefix, ctx) {
      if (!detected) return false;
      const chatId = msg.key.remoteJid;

      // URL-based simple routes
      const simpleRoutes = {
          tiktok:    '../gaaju-cmds/download/tiktok.js',
          instagram: '../gaaju-cmds/download/instagram.js',
          twitter:   '../gaaju-cmds/download/twitter.js',
          spotify:   '../gaaju-cmds/download/spotify.js',
          play:      '../gaaju-cmds/download/play.js',
          weather:   '../gaaju-cmds/utility/weather.js',
          crypto:    '../gaaju-cmds/utility/crypto.js',
          currency:  '../gaaju-cmds/utility/currency.js',
          translate: '../gaaju-cmds/utility/translate.js',
          calc:      '../gaaju-cmds/utility/calc.js',
          qr:        '../gaaju-cmds/utility/qr.js',
          horoscope: '../gaaju-cmds/utility/horoscope.js',
          quote:     '../gaaju-cmds/utility/quote.js',
          riddle:    '../gaaju-cmds/games/riddle.js',
          compliment:'../gaaju-cmds/fun/compliment.js',
          recipe:    '../gaaju-cmds/search/recipe.js',
          wiki:      '../gaaju-cmds/search/wiki.js',
          github:    '../gaaju-cmds/search/github.js',
          country:   '../gaaju-cmds/search/country.js',
          movie:     '../gaaju-cmds/movie/moviecmds.js',
          news:      '../gaaju-cmds/news/newscmds.js',
          '8ball':   '../gaaju-cmds/fun/eightball.js',
          imagine:   '../gaaju-cmds/ai/imagine.js',
          time:      '../gaaju-cmds/utility/worldclock.js',
          tts:       '../gaaju-cmds/ai/aitools.js',
      };

      // Sports player
      if (detected.intent === 'player') {
          const mod = require(path.join(__dirname, '../gaaju-cmds/sports/sportscmds.js'));
          const cmds = Array.isArray(mod) ? mod : [mod];
          const cmd  = cmds.find(c => c.name === 'playersearch') || cmds[0];
          if (cmd?.execute) { await cmd.execute(sock, msg, detected.args, prefix, ctx).catch(()=>{}); return true; }
          return false;
      }

      // Sports team
      if (detected.intent === 'team') {
          const mod = require(path.join(__dirname, '../gaaju-cmds/sports/sportscmds.js'));
          const cmds = Array.isArray(mod) ? mod : [mod];
          const cmd  = cmds.find(c => c.name === 'teamsearch') || cmds[1];
          if (cmd?.execute) { await cmd.execute(sock, msg, detected.args, prefix, ctx).catch(()=>{}); return true; }
          return false;
      }

      // Number fact
      if (detected.intent === 'numfact') {
          const num = detected.args[0] === 'random' ? Math.floor(Math.random()*1000) : detected.args[0];
          try {
              const r    = await fetch(`http://numbersapi.com/${num}?notfound=floor`, { signal: AbortSignal.timeout(10000) });
              const fact = await r.text();
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  🔢 NUMBER FACT 〕\n║\n║ ▸ *Number* : ${num}\n║ ▸ *Fact*   : ${fact}\n║\n╚═╝`
              }, { quoted: msg });
              return true;
          } catch { return false; }
      }

      // yt audio via URL
      if (detected.intent === 'yta') {
          const cmd = require('../gaaju-cmds/download/youtube.js');
          const ytaCmd = Array.isArray(cmd) ? cmd.find(c => c.name === 'yta') || cmd[0] : cmd;
          return !!(await ytaCmd.execute(sock, msg, detected.args, prefix, ctx).catch(() => null));
      }

      // yt video by name (search first)
      if (detected.intent === 'youtube') {
          if (detected.args[0]?.startsWith('http')) {
              const cmd = require('../gaaju-cmds/download/youtube.js');
              const ytvCmd = Array.isArray(cmd) ? cmd.find(c => c.name === 'ytv') || cmd[1] : cmd;
              return !!(await ytvCmd.execute(sock, msg, detected.args, prefix, ctx).catch(() => null));
          }
          // search by name
          try {
              const { casperGet, dlBuffer } = require('./keithapi');
              const vQuery = detected.args.join(' ').trim();
              const search = await casperGet('/api/search/youtube', { query: vQuery });
              if (!search.success || !search.videos?.length) return false;
              const top = search.videos[0];
              const dl  = await casperGet('/api/downloader/ytmp4', { url: top.url, quality: '720' });
              if (!dl?.success || !dl?.url) return false;
              const buf = await dlBuffer(dl.url);
              const banner = [
                  `╔═|〔  🎬 VIDEO 〕`, `║`,
                  `║ ▸ *Title*   : ${(top.title||vQuery).slice(0,38)}`,
                  top.channel  ? `║ ▸ *Channel* : ${top.channel.slice(0,30)}` : null,
                  top.duration ? `║ ▸ *Length*  : ${top.duration}` : null,
                  `║ ▸ *Size*    : ${(buf.length/1024/1024).toFixed(2)} MB`,
                  `║`, `╚═╝`
              ].filter(Boolean).join('\n');
              await sock.sendMessage(chatId, { video: buf, caption: banner }, { quoted: msg });
              return true;
          } catch { return false; }
      }

      const relPath = simpleRoutes[detected.intent];
      if (!relPath) return false;

      try {
          const cmd = loadCmd(path.join(__dirname, relPath));
          if (!cmd?.execute) return false;
          await cmd.execute(sock, msg, detected.args, prefix, ctx);
          return true;
      } catch { return false; }
  }

  module.exports = { detectIntent, runIntent };