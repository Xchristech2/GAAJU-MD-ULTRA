'use strict';

module.exports = {
    name: 'listonline',

    aliases: [
        'whoonline',
        'onlinelist',
        'activeusers'
    ],

    description: 'Detect online/active members in a group',

    category: 'group',

    async execute(sock, msg, args, cmdName, prefix) {
        const jid = msg.key.remoteJid;

        if (!jid?.endsWith('@g.us')) {
            return await sock.sendMessage(
                jid,
                { text: '❌ Group only.' },
                { quoted: msg }
            );
        }

        try {
            await sock.sendMessage(jid, {
                react: {
                    text: '⏳',
                    key: msg.key
                }
            });
        } catch {}

        try {
            const group = await sock.groupMetadata(jid);
            const groupName = group.subject || 'Group';

            const botJid =
                sock.user?.id?.split(':')[0] +
                '@s.whatsapp.net';

            const presenceResults = new Map();
            const scanDuration = 10000;

            const presenceHandler = json => {
                if (!json || json.id !== jid) return;
                if (!json.presences) return;

                for (const [participantJid, data] of Object.entries(
                    json.presences
                )) {
                    if (
                        data?.lastKnownPresence &&
                        participantJid !== botJid
                    ) {
                        presenceResults.set(participantJid, {
                            presence: data.lastKnownPresence,
                            timestamp: Date.now()
                        });
                    }
                }
            };

            sock.ev.on(
                'presence.update',
                presenceHandler
            );

            try {
                await sock.presenceSubscribe(jid);
            } catch {}

            const members = group.participants.filter(
                member => member.id !== botJid
            );

            const batchSize = 30;

            for (
                let i = 0;
                i < Math.min(members.length, 100);
                i += batchSize
            ) {
                const batch = members.slice(
                    i,
                    i + batchSize
                );

                await Promise.allSettled(
                    batch.map(member =>
                        sock
                            .presenceSubscribe(member.id)
                            .catch(() => {})
                    )
                );

                await new Promise(resolve =>
                    setTimeout(resolve, 500)
                );
            }

            await new Promise(resolve =>
                setTimeout(resolve, scanDuration)
            );

            sock.ev.off(
                'presence.update',
                presenceHandler
            );

            const onlineMembers = [];
            const typingMembers = [];
            const recordingMembers = [];

            for (const [participantId, data] of presenceResults) {
                const normalized = participantId
                    .split(':')[0]
                    .split('@')[0];

                const participant =
                    group.participants.find(member =>
                        member.id
                            .split(':')[0]
                            .split('@')[0] === normalized
                    );

                const memberInfo = {
                    id: participant?.id || participantId,
                    phone: normalized,
                    isAdmin: !!participant?.admin,
                    presence: data.presence
                };

                if (data.presence === 'available') {
                    onlineMembers.push(memberInfo);
                } else if (data.presence === 'composing') {
                    typingMembers.push(memberInfo);
                } else if (data.presence === 'recording') {
                    recordingMembers.push(memberInfo);
                }
            }

            const allActive = [
                ...onlineMembers,
                ...typingMembers,
                ...recordingMembers
            ];

            if (allActive.length === 0) {
                await sock.sendMessage(
                    jid,
                    {
                        text:
`🔍 *ONLINE SCAN*

📌 Group: ${groupName}

😴 No online members detected.

👥 Scanned: ${members.length} members
⏱️ Duration: ${scanDuration / 1000}s

💡 Some members may have privacy settings that hide their presence.`
                    },
                    { quoted: msg }
                );

                try {
                    await sock.sendMessage(jid, {
                        react: {
                            text: '😴',
                            key: msg.key
                        }
                    });
                } catch {}

                return;
            }

            let message =
`🔍 *ONLINE SCAN*

📌 Group: ${groupName}

👥 Active: ${allActive.length}/${members.length}

`;

            if (onlineMembers.length > 0) {
                message += `🟢 *ONLINE*\n`;

                onlineMembers.forEach(member => {
                    const icon = member.isAdmin
                        ? '👑'
                        : '👤';

                    message += `${icon} @${member.phone}\n`;
                });

                message += '\n';
            }

            if (typingMembers.length > 0) {
                message += `⌨️ *TYPING*\n`;

                typingMembers.forEach(member => {
                    const icon = member.isAdmin
                        ? '👑'
                        : '👤';

                    message += `${icon} @${member.phone}\n`;
                });

                message += '\n';
            }

            if (recordingMembers.length > 0) {
                message += `🎙️ *RECORDING*\n`;

                recordingMembers.forEach(member => {
                    const icon = member.isAdmin
                        ? '👑'
                        : '👤';

                    message += `${icon} @${member.phone}\n`;
                });
            }

            const mentions = allActive.map(
                member => member.id
            );

            await sock.sendMessage(
                jid,
                {
                    text: message.trim(),
                    mentions
                },
                { quoted: msg }
            );

            try {
                await sock.sendMessage(jid, {
                    react: {
                        text: '✅',
                        key: msg.key
                    }
                });
            } catch {}

        } catch (error) {
            console.error(
                'ListOnline error:',
                error
            );

            await sock.sendMessage(
                jid,
                {
                    text:
`❌ *Online scan failed.*

${error.message || 'Unknown error'}`
                },
                { quoted: msg }
            );

            try {
                await sock.sendMessage(jid, {
                    react: {
                        text: '❌',
                        key: msg.key
                    }
                });
            } catch {}
        }
    }
};
