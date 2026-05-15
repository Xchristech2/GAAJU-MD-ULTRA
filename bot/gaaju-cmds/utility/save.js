'use strict';

const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { getBotName } = require('../../lib/botname');
const config = require('../../config');

module.exports = {
    name:        'save',
    aliases:     ['keep', 'savemsg'],
    description: 'Save a quoted message (text or media) to your DM/saved messages',
    category:    'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '💾', key: msg.key } }); } catch {}

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
            || msg.message?.imageMessage?.contextInfo?.quotedMessage
            || msg.message?.videoMessage?.contextInfo?.quotedMessage
            || msg.message?.audioMessage?.contextInfo?.quotedMessage
            || msg.message?.documentMessage?.contextInfo?.quotedMessage
            || msg.message?.stickerMessage?.contextInfo?.quotedMessage
            || null;

        if (!quoted) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  SAVE 〕\n║\n║ ▸ *Status* : ❌ Reply to a message to save it\n║\n╚═╝`
            }, { quoted: msg });
        }

        const ownerJid = (config.OWNER_NUMBER || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        if (!ownerJid || ownerJid === '@s.whatsapp.net') {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  SAVE 〕\n║\n║ ▸ *Status* : ❌ Owner number not configured\n║\n╚═╝`
            }, { quoted: msg });
        }

        try {
            const fromLabel = chatId.endsWith('@g.us') ? 'Group' : 'DM';

            // ── Detect message type ──────────────────────────────────────────
            const msgType = Object.keys(quoted).find(k =>
                ['imageMessage','videoMessage','audioMessage','documentMessage','stickerMessage'].includes(k)
            );

            if (!msgType) {
                // Plain text message
                const text = quoted.conversation || quoted.extendedTextMessage?.text || '';
                await sock.sendMessage(ownerJid, {
                    text: `╔═|〔  SAVED MESSAGE 〕\n║\n║ ▸ *From* : ${fromLabel}\n║ ▸ *Content* : ${text.slice(0, 500)}\n║\n╚═╝`
                });
            } else {
                // Media message — download and forward
                const mediaMsg = {
                    key: { remoteJid: chatId, id: msg.key.id, fromMe: false },
                    message: quoted
                };

                const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
                const mediaInfo = quoted[msgType];
                const caption = (mediaInfo.caption || '').slice(0, 300);
                const headerNote = `╔═|〔  SAVED MESSAGE 〕\n║\n║ ▸ *From* : ${fromLabel}\n║\n╚═╝`;

                if (msgType === 'imageMessage') {
                    await sock.sendMessage(ownerJid, {
                        image: buffer,
                        caption: caption || headerNote,
                        mimetype: mediaInfo.mimetype || 'image/jpeg'
                    });
                    if (caption) await sock.sendMessage(ownerJid, { text: headerNote });

                } else if (msgType === 'videoMessage') {
                    await sock.sendMessage(ownerJid, {
                        video: buffer,
                        caption: caption || headerNote,
                        mimetype: mediaInfo.mimetype || 'video/mp4'
                    });
                    if (caption) await sock.sendMessage(ownerJid, { text: headerNote });

                } else if (msgType === 'audioMessage') {
                    await sock.sendMessage(ownerJid, {
                        audio: buffer,
                        mimetype: mediaInfo.mimetype || 'audio/ogg; codecs=opus',
                        ptt: !!mediaInfo.ptt
                    });
                    await sock.sendMessage(ownerJid, { text: headerNote });

                } else if (msgType === 'stickerMessage') {
                    await sock.sendMessage(ownerJid, {
                        sticker: buffer,
                        mimetype: mediaInfo.mimetype || 'image/webp'
                    });
                    await sock.sendMessage(ownerJid, { text: headerNote });

                } else if (msgType === 'documentMessage') {
                    await sock.sendMessage(ownerJid, {
                        document: buffer,
                        mimetype: mediaInfo.mimetype || 'application/octet-stream',
                        fileName: mediaInfo.fileName || 'file',
                        caption: caption || headerNote
                    });
                    if (caption) await sock.sendMessage(ownerJid, { text: headerNote });
                }
            }

            await sock.sendMessage(chatId, {
                text: `╔═|〔  SAVE 〕\n║\n║ ▸ *Status* : ✅ Saved to your DM\n║\n╚═╝`
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  SAVE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
            }, { quoted: msg });
        }
    }
};
