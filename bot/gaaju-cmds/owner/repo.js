'use strict';

const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');
const { getBotName } = require('../../lib/botname');

let giftedBtns;
try {
    giftedBtns = require('wolfbtns');
} catch {}

const REPO_OWNER = 'Xchristech2';
const REPO_NAME = 'GAAJU-MD-ULTRA';

const REPO_URL =
    'https://github.com/Xchristech2/GAAJU-MD-ULTRA';

const REPO_ZIP =
    'https://github.com/Xchristech2/GAAJU-MD-ULTRA/archive/refs/heads/main.zip';

const OWNER_NUMBER = '2348069675806';

const DEFAULT_IMAGE_URL =
    'https://i.ibb.co/Gvkt4q9d/Chat-GPT-Image-Feb-21-2026-12-47-33-AM.png';

function getRepoImage() {
    const imagePaths = [
        path.join(__dirname, '../../../assets/menu-image.jpg'),
        path.join(__dirname, '../../../assets/menu-image.png'),
        path.join(__dirname, '../media/wolfbot.jpg'),
        path.join(__dirname, '../media/wolfbot.png')
    ];

    for (const file of imagePaths) {
        if (fs.existsSync(file)) {
            try {
                return {
                    type: 'buffer',
                    data: fs.readFileSync(file)
                };
            } catch {}
        }
    }

    return {
        type: 'url',
        data: DEFAULT_IMAGE_URL
    };
}

function formatSize(sizeKB) {
    const size = Number(sizeKB || 0);

    if (size >= 1024) {
        return `${(size / 1024).toFixed(2)} MB`;
    }

    return `${size} KB`;
}

function createFakeContact(msg) {
    const number =
        msg.key.participant?.split('@')[0] ||
        msg.key.remoteJid?.split('@')[0] ||
        OWNER_NUMBER;

    return {
        key: {
            participants: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            fromMe: false,
            id: getBotName()
        },
        message: {
            contactMessage: {
                vcard:
                    `BEGIN:VCARD\n` +
                    `VERSION:3.0\n` +
                    `N:Bot;${getBotName()};;;\n` +
                    `FN:${getBotName()}\n` +
                    `item1.TEL;waid=${number}:${number}\n` +
                    `item1.X-ABLabel:WhatsApp\n` +
                    `END:VCARD`
            }
        },
        participant: '0@s.whatsapp.net'
    };
}

async function sendRepoCard(sock, jid, caption, imagePayload, msg) {
    const fkontak = createFakeContact(msg);

    if (giftedBtns?.sendInteractiveMessage) {
        try {
            await giftedBtns.sendInteractiveMessage(
                sock,
                jid,
                {
                    text: caption,

                    footer: `⚡ ${getBotName()}`,

                    interactiveButtons: [
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '⭐ Star Repo',
                                url: `${REPO_URL}/stargazers`
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '🍴 Fork Repo',
                                url: `${REPO_URL}/fork`
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📦 Download ZIP',
                                url: REPO_ZIP
                            })
                        },
                        {
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📋 Copy Owner',
                                copy_code: `+${OWNER_NUMBER}`
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '💬 Message Owner',
                                url: `https://wa.me/${OWNER_NUMBER}`
                            })
                        }
                    ],

                    ...(imagePayload.image
                        ? { image: imagePayload.image }
                        : {})
                },
                {
                    quoted: fkontak
                }
            );

            return;
        } catch (error) {
            console.error('Repo button error:', error);
        }
    }

    await sock.sendMessage(
        jid,
        {
            ...imagePayload,
            caption
        },
        {
            quoted: msg
        }
    );
}

module.exports = {
    name: 'repo',

    aliases: [
        'r',
        'sc',
        'source',
        'github',
        'git',
        'botrepo',
        'repository',
        'repostats'
    ],

    description: 'Show GAAJU-MD-ULTRA GitHub repository information',

    category: 'owner',

    async execute(sock, msg, args, cmdName, prefix) {
        const jid = msg.key.remoteJid;

        try {
            const image = getRepoImage();

            const imagePayload =
                image.type === 'buffer'
                    ? { image: image.data }
                    : { image: { url: image.data } };

            const { data } = await axios.get(
                `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
                {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'GAAJU-MD-ULTRA',
                        Accept: 'application/vnd.github+json'
                    }
                }
            );

            const size = formatSize(data.size);

            const updated = data.updated_at
                ? moment(data.updated_at).format('DD/MM/YYYY HH:mm:ss')
                : 'Unknown';

            const caption =
`📦 *GAAJU-MD-ULTRA*

👤 *Owner:* ${data.owner?.login || REPO_OWNER}
⭐ *Stars:* ${data.stargazers_count || 0}
🍴 *Forks:* ${data.forks_count || 0}
👁️ *Watchers:* ${data.watchers_count || 0}
🐞 *Open Issues:* ${data.open_issues_count || 0}
💾 *Size:* ${size}
🌿 *Branch:* ${data.default_branch || 'main'}
🕒 *Updated:* ${updated}

📝 *Description:*
${data.description || 'A powerful WhatsApp multi-device bot.'}

🔗 *Fork Link:*
${REPO_URL}/fork

> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`;

            await sendRepoCard(
                sock,
                jid,
                caption,
                imagePayload,
                msg
            );

            await sock.sendMessage(
                jid,
                {
                    react: {
                        text: '⭐',
                        key: msg.key
                    }
                }
            );

        } catch (error) {
            console.error('❌ Repo command error:', error);

            await sock.sendMessage(
                jid,
                {
                    text:
`❌ *Failed to fetch repository information.*

🔗 ${REPO_URL}

📦 ${REPO_ZIP}`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
