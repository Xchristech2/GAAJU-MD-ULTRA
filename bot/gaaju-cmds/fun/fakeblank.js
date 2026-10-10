'use strict';

const BLANK_PAYLOAD = '\u00AD\u200B\u200C\u200D\u2060\uFEFF\u034F\u200E\u200F'.repeat(20);

module.exports = {
    name: '',
    aliases: ['blanktext', 'fakemsg', 'blankmsg'],
    description: 'Generate invisible text for testing',
    category: 'fun',
    ownerOnly: false,

    async execute(sock, msg, args, prefix) {
        const jid = msg.key.remoteJid;

        try {
            await sock.sendMessage(
                jid,
                {
                    text:
                        `⬜ *BLANK TEXT GENERATOR*\n\n` +
                        `Your invisible-text sample is ready.\n\n` +
                        `Copy the blank message below to test it in your own chat:\n\n` +
                        `${BLANK_PAYLOAD}\n\n` +
                        `_For testing purposes only._\n` +
                        `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
                },
                { quoted: msg }
            );
        } catch (error) {
            console.error('[FAKEBLANK] Error:', error);

            await sock.sendMessage(
                jid,
                {
                    text: '❌ Could not generate the blank-text sample. Please try again.'
                },
                { quoted: msg }
            );
        }
    }
};
