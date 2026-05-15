'use strict';
  module.exports = {
      name: 'setgpp',
      aliases: ['seticon', 'grouppic', 'setgrouppp', 'setgroupicon', 'setpic'],
      description: 'Change the group profile picture',
      category: 'group',
      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;
          if (!chatId.endsWith('@g.us'))
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  SET GROUP PP 〕\n║\n║ ▸ ❌ Group only — use ${prefix}setpp to change bot photo\n║\n╚═╝`
              }, { quoted: msg });

          if (!ctx?.isOwnerUser && !ctx?.isSudoUser && !ctx?.isGroupAdmin)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  SET GROUP PP 〕\n║\n║ ▸ ❌ Admins only\n║\n╚═╝`
              }, { quoted: msg });

          const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
          const imgMsg = quoted?.imageMessage || msg.message?.imageMessage;
          if (!imgMsg)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  SET GROUP PP 〕\n║\n║ ▸ *Usage* : Reply an image with ${prefix}setgpp\n║\n╚═╝`
              }, { quoted: msg });

          try {
              const { downloadMediaMessage } = require('@whiskeysockets/baileys');
              const buf = await downloadMediaMessage(
                  { message: quoted ? { ...quoted } : msg.message, key: msg.key },
                  'buffer', {}
              );
              await sock.updateProfilePicture(chatId, buf);
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  SET GROUP PP 〕\n║\n║ ▸ ✅ Group photo updated\n║\n╚═╝`
              }, { quoted: msg });
          } catch (e) {
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  SET GROUP PP 〕\n║\n║ ▸ ❌ Failed: ${e.message}\n║\n╚═╝`
              }, { quoted: msg });
          }
      }
  };