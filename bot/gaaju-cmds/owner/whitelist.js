'use strict';
  const fs   = require('fs');
  const path = require('path');

  const WL_FILE = path.join(__dirname, '../../data/whitelist.json');
  function load()  { try { return JSON.parse(fs.readFileSync(WL_FILE, 'utf8')); } catch { return []; } }
  function save(d) { try { fs.mkdirSync(path.dirname(WL_FILE), { recursive: true }); fs.writeFileSync(WL_FILE, JSON.stringify(d, null, 2)); } catch {} }

  function normalize(num) { return String(num || '').replace(/[^0-9]/g, ''); }

  function isWhitelisted(num) {
      const clean = normalize(num);
      if (!clean) return false;
      return load().some(n => normalize(n) === clean);
  }

  function resolveNumber(msg, args) {
      const fromArgs = normalize(args[0] || '');
      if (fromArgs) return fromArgs;
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = (ctx?.mentionedJid || [])[0];
      if (mentioned) return normalize(mentioned.split('@')[0].split(':')[0]);
      if (ctx?.participant) return normalize(ctx.participant.split('@')[0].split(':')[0]);
      return null;
  }

  module.exports = {
      isWhitelisted,
      name: 'whitelist', aliases: ['wl', 'allowlist'],
      description: 'Whitelist numbers to bypass private/silent mode restrictions',
      category: 'owner', ownerOnly: true, sudoAllowed: true,

      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;

          if (!ctx?.isOwnerUser && !ctx?.isSudoUser)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ❌ Owner/sudo only\n║\n╚═╝`
              }, { quoted: msg });

          const sub = (args[0] || '').toLowerCase();
          const wl  = load();

          if (!sub || sub === 'list') {
              const rows = wl.length
                  ? wl.map((n, i) => `║   ${i + 1}. +${n}`).join('\n')
                  : '║   (empty)';
              return sock.sendMessage(chatId, {
                  text: [
                      `╔═|〔  WHITELIST 〕`, `║`,
                      `║ ▸ *Allowed* : ${wl.length} number(s)`, `║`,
                      rows, `║`,
                      `║ ▸ *Usage*:`,
                      `║   ${prefix}whitelist add <number | @mention | reply>`,
                      `║   ${prefix}whitelist remove <number>`,
                      `║   ${prefix}whitelist check <number>`,
                      `║   ${prefix}whitelist clear`,
                      `║`, `╚═╝`
                  ].join('\n')
              }, { quoted: msg });
          }

          if (sub === 'add') {
              const num = resolveNumber(msg, args.slice(1));
              if (!num)
                  return sock.sendMessage(chatId, {
                      text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ❌ Provide a number, @mention, or reply\n║\n╚═╝`
                  }, { quoted: msg });
              if (wl.some(n => normalize(n) === num))
                  return sock.sendMessage(chatId, {
                      text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ⚠️ Already whitelisted: +${num}\n║\n╚═╝`
                  }, { quoted: msg });
              wl.push(num); save(wl);
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ✅ Allowed : +${num}\n║ ▸ *Total*   : ${wl.length}\n║\n╚═╝`
              }, { quoted: msg });
          }

          if (sub === 'remove' || sub === 'del') {
              const num = resolveNumber(msg, args.slice(1));
              if (!num)
                  return sock.sendMessage(chatId, {
                      text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ❌ Provide a number, @mention, or reply\n║\n╚═╝`
                  }, { quoted: msg });
              const idx = wl.findIndex(n => normalize(n) === num);
              if (idx === -1)
                  return sock.sendMessage(chatId, {
                      text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ⚠️ Not found: +${num}\n║\n╚═╝`
                  }, { quoted: msg });
              wl.splice(idx, 1); save(wl);
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ✅ Removed : +${num}\n║ ▸ *Total*   : ${wl.length}\n║\n╚═╝`
              }, { quoted: msg });
          }

          if (sub === 'check') {
              const num = resolveNumber(msg, args.slice(1));
              if (!num)
                  return sock.sendMessage(chatId, {
                      text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ❌ Provide a number\n║\n╚═╝`
                  }, { quoted: msg });
              const allowed = wl.some(n => normalize(n) === num);
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ *Number* : +${num}\n║ ▸ *Status* : ${allowed ? '✅ Whitelisted' : '🚫 Not whitelisted'}\n║\n╚═╝`
              }, { quoted: msg });
          }

          if (sub === 'clear') {
              save([]);
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  WHITELIST 〕\n║\n║ ▸ ✅ All ${wl.length} number(s) cleared\n║\n╚═╝`
              }, { quoted: msg });
          }

          return sock.sendMessage(chatId, {
              text: [
                  `╔═|〔  WHITELIST 〕`, `║`,
                  `║ ▸ Unknown: "${sub}"`, `║`,
                  `║ ▸ *Subcommands*:`,
                  `║   list | add | remove | check | clear`,
                  `║`, `╚═╝`
              ].join('\n')
          }, { quoted: msg });
      }
  };