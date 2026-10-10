'use strict';

const axios = require('axios');

const FALLBACK_INSULTS = [
    "You're the reason the gene pool needs a lifeguard.",
    "I'd agree with you, but then we'd both be wrong.",
    "You bring everyone so much joy when you leave the room.",
    "I'd explain it to you, but I left my crayons at home.",
    "Light travels faster than sound, which is why you appeared bright until you spoke.",
    "Some drink from the fountain of knowledge — you only gargled.",
    "You're like a cloud — when you disappear, it's a beautiful day.",
    "You're not stupid; you just have bad luck thinking.",
    "If ignorance is bliss, you must be the happiest soul alive.",
    "You're the human equivalent of a participation trophy.",
    "Your secrets are safe with me. I never listen when you tell them.",
    "I would call you a tool, but even tools serve a purpose.",
    "You're proof that confidence and competence are two different things.",
    "Your brain has too many tabs open, and none of them are responding.",
    "You're not the sharpest tool in the shed, but at least you're in the shed.",
    "You have something on your chin… no, the third one down.",
    "You're living proof that autocorrect can't fix everything.",
    "Your logic is impressive. It manages to avoid every correct answer.",
    "You're like a software update: nobody asked, and somehow things got worse.",
    "If common sense were money, you'd be asking for a loan."
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchInsult() {
    try {
        const response = await axios.get(
            'https://evilinsult.com/generate_insult.php?lang=en&type=json',
            {
                timeout: 6000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            }
        );

        const insult = response.data?.insult;

        if (typeof insult === 'string' && insult.trim()) {
            return insult
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .replace(/&#039;/g, "'")
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .trim();
        }
    } catch (error) {
        // Use the local insult list if the API is unavailable.
    }

    return FALLBACK_INSULTS[
        Math.floor(Math.random() * FALLBACK_INSULTS.length)
    ];
}

module.exports = {
    name: 'insult',
    aliases: ['roast', 'burn', 'diss'],
    description: 'Roast a user, reply target, or group for fun',
    category: 'fun',
    ownerOnly: false,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');

        const botJid = sock.user?.id
            ? sock.user.id.replace(/:\d+@/, '@')
            : null;

        const senderJid =
            msg.key.participant ||
            (msg.key.fromMe ? botJid : chatId);

        const context =
            msg.message?.extendedTextMessage?.contextInfo ||
            msg.message?.imageMessage?.contextInfo ||
            msg.message?.videoMessage?.contextInfo ||
            msg.message?.documentMessage?.contextInfo;

        const mentioned = context?.mentionedJid || [];
        const replyJid = context?.participant;

        const send = (text, options = {}) =>
            sock.sendMessage(
                chatId,
                { text, ...options },
                { quoted: msg }
            );

        let targets = [];
        let mode = 'self';

        if (mentioned.length) {
            targets = [...new Set(mentioned)];
            mode = 'mention';
        } else if (replyJid) {
            targets = [replyJid];
            mode = 'reply';
        } else if (isGroup) {
            try {
                const metadata = await sock.groupMetadata(chatId);

                targets = (metadata?.participants || [])
                    .map(participant => participant.id)
                    .filter(jid => jid && jid !== botJid);

                mode = 'group';
            } catch (error) {
                console.error('[INSULT] Group metadata error:', error);
                return send('❌ Could not fetch the group members.');
            }
        } else {
            targets = senderJid ? [senderJid] : [];
            mode = 'self';
        }

        if (!targets.length) {
            return send(
                `*INSULT COMMAND*\n\n` +
                `• ${prefix}insult @user\n` +
                `• Reply to a message with ${prefix}insult\n` +
                `• ${prefix}insult — roast the group\n\n` +
                `_For entertainment only._`
            );
        }

        try {
            await sock.sendMessage(chatId, {
                react: { text: '🔥', key: msg.key }
            });
        } catch {}

        try {
            // Group mode: cap the number of targets to avoid oversized messages.
            if (mode === 'group') {
                const selectedTargets = targets.slice(0, 20);
                const lines = [];

                for (const jid of selectedTargets) {
                    const insult = await fetchInsult();
                    lines.push(`@${jid.split('@')[0]}\n${insult}`);
                    await sleep(150);
                }

                const text =
                    `*GROUP ROAST*\n\n` +
                    `${lines.join('\n\n')}\n\n` +
                    `_Just jokes. Don't take it personally._\n` +
                    `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`;

                return sock.sendMessage(
                    chatId,
                    {
                        text,
                        mentions: selectedTargets
                    },
                    { quoted: msg }
                );
            }

            // Single-target mode.
            const target = targets[0];
            const insult = await fetchInsult();
            const tag = `@${target.split('@')[0]}`;

            const title = mode === 'self'
                ? '*SELF ROAST*'
                : '*ROAST SESSION*';

            const text =
                `${title}\n\n` +
                `${tag}\n` +
                `${insult}\n\n` +
                `_Just jokes. Don't take it personally._\n` +
                `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`;

            return sock.sendMessage(
                chatId,
                {
                    text,
                    mentions: [target]
                },
                { quoted: msg }
            );
        } catch (error) {
            console.error('[INSULT] Error:', error);

            return send(
                `❌ *INSULT COMMAND FAILED*\n\n${error.message}`
            );
        }
    }
};
