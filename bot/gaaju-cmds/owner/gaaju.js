'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const { getBotName } = require('../../lib/botname');

let giftedBtns;

try {
    giftedBtns = require('wolfbtns');
} catch {}

const OWN_REPO = 'Xchristech2/GAAJU-MD-ULTRA';
const OWN_BRANCH = 'main';

const DEPLOY_TUTORIAL =
    'https://youtu.be/jHYSN3vUJec?si=nimF4UmjSz-Mz2fV';

const PAIR_SITE =
    'https://gaaju-ultra-pair-ljtv.onrender.com';

const VIEW_CHANNEL =
    'https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z';

const MENU_IMAGE = path.resolve(
    process.cwd(),
    'assets',
    'menu-image.jpg'
);

const DEFAULT_OWNER_NUMBER = '2348069675806';

const CONTACT_FILE = path.join(
    process.cwd(),
    'bot_owner_contact.json'
);

function ghGet(apiPath) {
    return new Promise((resolve, reject) => {
        const req = https.get({
            hostname: 'api.github.com',
            path: apiPath,
            headers: {
                'User-Agent': 'GAAJU-MD-ULTRA',
                'Accept': 'application/vnd.github+json'
            },
            timeout: 10000
        }, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);

                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        return reject(
                            new Error(json.message || 'GitHub request failed')
                        );
                    }

                    resolve(json);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('timeout', () => {
            req.destroy(new Error('GitHub request timed out'));
        });

        req.on('error', reject);
    });
}

function parseRepo(input) {
    if (!input) return OWN_REPO;

    input = String(input)
        .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
        .replace(/\/+$/, '')
        .replace(/^@/, '');

    const parts = input.split('/');

    if (parts.length >= 2) {
        return `${parts[0]}/${parts[1].replace(/\.git$/i, '')}`;
    }

    return OWN_REPO;
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString('en-US');
}

function formatSize(size) {
    size = Number(size || 0);

    if (size < 1024) {
        return `${formatNumber(size)} KB`;
    }

    return `${(size / 1024).toFixed(2)} MB`;
}

function getOwnerContact() {
    try {
        if (fs.existsSync(CONTACT_FILE)) {
            const data = JSON.parse(
                fs.readFileSync(CONTACT_FILE, 'utf8')
            );

            const number = String(data.number || '')
                .replace(/\D/g, '');

            if (number.length >= 7) return number;
        }
    } catch (error) {
        console.error('[REPO] Owner contact error:', error.message);
    }

    return DEFAULT_OWNER_NUMBER;
}

function getOwnerName() {
    try {
        const cfg = require('../../config');
        return cfg.OWNER_NAME || 'Chris Gaaju';
    } catch {
        return 'Chris Gaaju';
    }
}

function getDisplayName() {
    try {
        return getBotName() || 'GAAJU-MD-ULTRA';
    } catch {
        return 'GAAJU-MD-ULTRA';
    }
}

module.exports = {
    name: 'repo',

    aliases: [
        'botrepo',
        'repository',
        'gitinfo',
        'repostats'
    ],

    description: 'Display GitHub repository information',

    category: 'owner',

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        try {
            const repo = parseRepo(args?.[0]);
            const data = await ghGet(
                `/repos/${repo}`
            );

            const repository = data.full_name || repo;
            const repoUrl = data.html_url ||
                `https://github.com/${repository}`;

            const forkUrl = `${repoUrl}/fork`;

            const zipUrl =
                `${repoUrl}/archive/refs/heads/` +
                `${data.default_branch || OWN_BRANCH}.zip`;

            const ownerNumber = getOwnerContact();
            const ownerName = getOwnerName();
            const botName = getDisplayName();

            const text =
                `╭━━━〔 📦 *REPOSITORY* 〕\n` +
                `┃\n` +
                `┃ ▸ *Name:* ${repository}\n` +
                `┃ ▸ ⭐ *Stars:* ${formatNumber(data.stargazers_count)}\n` +
                `┃ ▸ 🍴 *Forks:* ${formatNumber(data.forks_count)}\n` +
                `┃ ▸ ❗ *Open Issues:* ${formatNumber(data.open_issues_count)}\n` +
                `┃ ▸ 📁 *Repo Size:* ${formatSize(data.size)}\n` +
                `┃\n` +
                `┃ 🔗 *Fork Link:*\n` +
                `┃ ${forkUrl}\n` +
                `╰━━━━━━━━━━━━━━`;

            const buttons = [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '⭐ Star Repo',
                        url: repoUrl
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🍴 Fork Repo',
                        url: forkUrl
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📦 Download ZIP',
                        url: zipUrl
                    })
                },
                {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📋 Copy Owner Number',
                        copy_code: `+${ownerNumber}`
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '👑 Message Owner',
                        url: `https://wa.me/${ownerNumber}`
                    })
                }
            ];

            const footer =
                `👑 ${ownerName}\n` +
                `Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`;

            // Use wolfbtns for interactive buttons.
            if (giftedBtns?.sendInteractiveMessage) {
                try {
                    if (fs.existsSync(MENU_IMAGE)) {
                        await giftedBtns.sendInteractiveMessage(
                            sock,
                            jid,
                            {
                                image: fs.readFileSync(MENU_IMAGE),
                                text,
                                footer,
                                interactiveButtons: buttons
                            }
                        );
                    } else {
                        await giftedBtns.sendInteractiveMessage(
                            sock,
                            jid,
                            {
                                text,
                                footer,
                                interactiveButtons: buttons
                            }
                        );
                    }

                    return;
                } catch (error) {
                    console.error(
                        '[REPO] Interactive buttons error:',
                        error.message
                    );
                }
            }

            // Fallback if wolfbtns is unavailable.
            const fallbackText =
                `${text}\n\n` +
                `⭐ *Star Repo:*\n${repoUrl}\n\n` +
                `🍴 *Fork Repo:*\n${forkUrl}\n\n` +
                `📦 *Download ZIP:*\n${zipUrl}\n\n` +
                `👑 *Owner:* ${ownerName}\n` +
                `📱 *Number:* +${ownerNumber}\n` +
                `💬 https://wa.me/${ownerNumber}\n\n` +
                `🎥 *Deployment Tutorial:*\n${DEPLOY_TUTORIAL}\n\n` +
                `🔑 *Pair Site:*\n${PAIR_SITE}\n\n` +
                `📢 *WhatsApp Channel:*\n${VIEW_CHANNEL}\n\n` +
                `> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`;

            if (fs.existsSync(MENU_IMAGE)) {
                await sock.sendMessage(
                    jid,
                    {
                        image: fs.readFileSync(MENU_IMAGE),
                        caption: fallbackText
                    },
                    { quoted: msg }
                );
            } else {
                await sock.sendMessage(
                    jid,
                    { text: fallbackText },
                    { quoted: msg }
                );
            }
        } catch (error) {
            console.error('[REPO] Command error:', error);

            await sock.sendMessage(
                jid,
                {
                    text:
                        '❌ *Failed to fetch repository information.*\n\n' +
                        'Please try again later.'
                },
                { quoted: msg }
            );
        }
    }
};
