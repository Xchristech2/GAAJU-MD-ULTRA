'use strict';

const axios = require('axios');

let giftedBtns;
try {
    giftedBtns = require('wolfbtns');
} catch {}

let prepareWAMessageMedia;
try {
    ({ prepareWAMessageMedia } = require('wolfsocket'));
} catch {}

module.exports = {
    name: 'link',

    aliases: [
        'grouplink',
        'glink',
        'gclink',
        'invitelink'
    ],

    description: 'Get group invite link with copy button and group thumbnail',

    category: 'group',

    async execute(sock, msg, args, cmdName, prefix) {
        const jid = msg.key.remoteJid;

        if (!jid?.endsWith('@g.us')) {
            return await sock.sendMessage(
                jid,
                {
                    text: '❌ This command only works in groups.'
                },
                { quoted: msg }
            );
        }

        try {
            try {
                await sock.sendMessage(jid, {
                    react: {
                        text: '🔗',
                        key: msg.key
                    }
                });
            } catch {}

            const groupInfo = await sock.groupMetadata(jid);
            const groupName = groupInfo.subject || 'Group';
            const members = groupInfo.participants?.length || 0;

            let inviteCode;

            try {
                inviteCode = await sock.groupInviteCode(jid);
            } catch (error) {
                const errorText = [
                    error.message || '',
                    error.output?.error || '',
                    JSON.stringify(error)
                ].join(' ');

                if (/rate-overlimit|rate.limit/i.test(errorText)) {
                    throw new Error('rate-overlimit');
                }

                await new Promise(resolve =>
                    setTimeout(resolve, 1500)
                );

                try {
                    inviteCode = await sock.groupInviteCode(jid);
                } catch {
                    throw new Error(
                        'Bot needs admin permissions to get the group link.'
                    );
                }
            }

            const inviteLink =
                `https://chat.whatsapp.com/${inviteCode}`;

            let profilePic = null;

            try {
                const profileUrl = await sock.profilePictureUrl(
                    jid,
                    'image'
                );

                if (profileUrl) {
                    const response = await axios.get(
                        profileUrl,
                        {
                            responseType: 'arraybuffer',
                            timeout: 8000
                        }
                    );

                    profilePic = Buffer.from(response.data);
                }
            } catch {}

            const caption =
`🔗 *GROUP LINK*

📌 *Name:* ${groupName}
👥 *Members:* ${members}

🔗 *Invite Link:*
${inviteLink}`;

            let buttonsSent = false;

            if (giftedBtns?.sendInteractiveMessage) {
                const buttons = [
                    {
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📋 Copy Link',
                            copy_code: inviteLink
                        })
                    },
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '🔗 Open Link',
                            url: inviteLink
                        })
                    }
                ];

                try {
                    if (
                        profilePic &&
                        prepareWAMessageMedia &&
                        sock.waUploadToServer
                    ) {
                        const media = await prepareWAMessageMedia(
                            { image: profilePic },
                            { upload: sock.waUploadToServer }
                        );

                        await giftedBtns.sendInteractiveMessage(
                            sock,
                            jid,
                            {
                                interactiveMessage: {
                                    header: {
                                        imageMessage: media.imageMessage,
                                        hasMediaAttachment: true
                                    },
                                    body: {
                                        text: caption
                                    },
                                    footer: {
                                        text: 'Group Invite'
                                    },
                                    nativeFlowMessage: {
                                        buttons
                                    }
                                }
                            },
                            { quoted: msg }
                        );
                    } else {
                        await giftedBtns.sendInteractiveMessage(
                            sock,
                            jid,
                            {
                                text: caption,
                                footer: 'Group Invite',
                                interactiveButtons: buttons,
                                ...(profilePic
                                    ? { image: profilePic }
                                    : {})
                            },
                            { quoted: msg }
                        );
                    }

                    buttonsSent = true;
                } catch (error) {
                    console.error(
                        '[LINK] Interactive buttons failed:',
                        error.message
                    );
                }
            }

            if (!buttonsSent) {
                if (profilePic) {
                    await sock.sendMessage(
                        jid,
                        {
                            image: profilePic,
                            caption
                        },
                        { quoted: msg }
                    );
                } else {
                    await sock.sendMessage(
                        jid,
                        {
                            text: caption
                        },
                        { quoted: msg }
                    );
                }
            }

            try {
                await sock.sendMessage(jid, {
                    react: {
                        text: '✅',
                        key: msg.key
                    }
                });
            } catch {}

        } catch (error) {
            console.error('Link command error:', error);

            let errorMsg = '❌ *Failed to get group link.*';

            if (
                /rate-overlimit|rate.limit/i.test(
                    error.message || ''
                )
            ) {
                errorMsg +=
                    '\n\nWhatsApp is limiting requests. Please wait a little and try again.';
            } else if (
                /admin|permission/i.test(
                    error.message || ''
                )
            ) {
                errorMsg +=
                    '\n\nThe bot may need admin permissions to retrieve the invite link.';
            } else {
                errorMsg += `\n\n${error.message || 'Unknown error'}`;
            }

            await sock.sendMessage(
                jid,
                {
                    text: errorMsg
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
