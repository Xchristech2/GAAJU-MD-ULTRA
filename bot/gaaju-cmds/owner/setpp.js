'use strict';
  module.exports = {
      name: 'setpp',
      aliases: ['setbotpp', 'setbotpic', 'setbotphoto', 'botpp'],
      description: "Set the bot's own profile picture",
      category: 'owner', ownerOnly: true, sudoAllowed: true,
      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;

          if (!ctx?.isOwnerUser && !ctx?.isSudoUser)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  SET BOT PP 〕\n║\n║ ▸ ❌ Owner/sudo only\n║\n╚═╝`
              }, { quoted: msg });

          const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
          const imgMsg = quoted?.imageMessage || msg.message?.imageMessage;
          if (!imgMsg)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  SET BOT PP 〕\n║\n║ ▸ *Usage* : Send or reply to an image with ${prefix}setpp\n║\n╚═╝`
              }, { quoted: msg });

          try {
              await sock.sendMessage(chatId, { react: { text: '🖼️', key: msg.key } });
              const { downloadMediaMessage } = require('@whiskeysockets/baileys');
              const buf = await downloadMediaMessage(
                  { message: quoted ? { ...quoted } : msg.message, key: msg.key },
                  'buffer', {}
              );
              await sock.updateProfilePicture(sock.user.id, buf);
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  SET BOT PP 〕\n║\n║ ▸ ✅ Bot profile photo updated\n║\n╚═╝`
              }, { quoted: msg });
          } catch (e) {
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  SET BOT PP 〕\n║\n║ ▸ ❌ Failed: ${e.message}\n║\n╚═╝`
              }, { quoted: msg });
          }
      }
  };