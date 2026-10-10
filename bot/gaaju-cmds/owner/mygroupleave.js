'use strict';

const sessions = new Map();

module.exports = {
    name: 'mygroupleave',
    aliases: ['groupleave'],
    description: 'Select and leave a WhatsApp group',
    category: 'owner',
    ownerOnly: true,
    sudoAllowed: false,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;
        const senderJid =
            msg.key.participant ||
            (msg.key.fromMe ? sock.user?.id : chatId);

        const senderId = senderJid
            ?.split('@')[0]
            ?.split(':')[0];

        const send = (text) => sock.sendMessage(
            chatId,
            { text },
            { quoted: msg }
        );

        let isOwner = false;

        try {
            isOwner = Boolean(extra?.jidManager?.isOwner?.(msg));
        } catch (error) {
            console.error('[MYGROUPLEAVE] Owner check failed:', error);
        }

        if (!isOwner) {
            return send('❌ *Owner Only Command!*');
        }

        if (!senderId) {
            return send('❌ Could not identify the command sender.');
        }

        const action = String(args?.[0] || '').toLowerCase();
        const sessionKey = `${senderId}:${chatId}`;

        // Leave the selected group after confirmation.
        if (action === 'confirm') {
            const selected = sessions.get(sessionKey);

            if (!selected) {
                return send(
`╭─⌈ *MY GROUP LEAVE* ⌋
│
├─⊷ No group selected.
├─⊷ Use ${prefix}mygroupleave first.
╰─⊷`
                );
            }

            try {
                await sock.groupLeave(selected.id);
                sessions.delete(sessionKey);

                return send(
`╭─⌈ *GAAJU-MD-ULTRA* ⌋
│
├─⊷ ✅ *GROUP LEFT SUCCESSFULLY*
│
├─⊷ Group: ${selected.name}
╰─⊷`
                );
            } catch (error) {
                console.error('[MYGROUPLEAVE] Leave error:', error);

                return send(
`╭─⌈ *MY GROUP LEAVE* ⌋
│
├─⊷ ❌ Failed to leave group.
├─⊷ Group: ${selected.name}
├─⊷ Error: ${error.message}
╰─⊷`
                );
            }
        }

        // List groups the bot has joined.
        if (action === 'list' || !action) {
            try {
                const groups = Object.values(
                    await sock.groupFetchAllParticipating()
                );

                if (!groups.length) {
                    return send('❌ Your bot has not joined any groups.');
                }

                const list = groups.map((group, index) => {
                    return `${index + 1}. ${group.subject || 'Unnamed Group'}`;
                }).join('\n');

                sessions.set(`${sessionKey}:groups`, groups.map(group => ({
                    id: group.id,
                    name: group.subject || 'Unnamed Group'
                })));

                return send(
`╭─⌈ *GAAJU-MD-ULTRA* ⌋
│
├─⊷ *YOUR GROUPS*
│
${list.split('\n').map(line => `├─⊷ ${line}`).join('\n')}
│
├─⊷ Select a group:
├─⊷ ${prefix}mygroupleave <number>
│
╰─⊷`
                );
            } catch (error) {
                console.error('[MYGROUPLEAVE] Group fetch error:', error);

                return send(
`❌ *Could not fetch groups.*

${error.message}`
                );
            }
        }

        // Select a group by its number.
        const number = Number.parseInt(action, 10);

        if (!Number.isInteger(number) || number < 1) {
            return send(
`❌ Invalid group number.

Use ${prefix}mygroupleave to view your groups.`
            );
        }

        const groups = sessions.get(`${sessionKey}:groups`);

        if (!groups || number > groups.length) {
            return send(
`❌ Group list not found or invalid number.

Use ${prefix}mygroupleave to refresh the list.`
            );
        }

        const selected = groups[number - 1];

        sessions.set(sessionKey, selected);

        return send(
`╭─⌈ *GAAJU-MD-ULTRA* ⌋
│
├─⊷ *GROUP SELECTED*
│
├─⊷ Name: ${selected.name}
├─⊷ Group ID: ${selected.id}
│
├─⊷ To leave this group, use:
├─⊷ ${prefix}mygroupleave confirm
│
╰─⊷`
        );
    }
};
