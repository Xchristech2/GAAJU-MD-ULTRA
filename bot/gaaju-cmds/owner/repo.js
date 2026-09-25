'use strict';

const https = require('https');
const { getBotName } = require('../../lib/botname');

const OWN_REPO = 'Xchristech2/GAAJU-MD-ULTRA';
const OWN_BRANCH = 'main';

const REPO_IMAGE =
    'https://raw.githubusercontent.com/Xchristech2/GAAJU-MD-ULTRA/main/assets/xd-logo.jpg';

function ghGet(path) {
    return new Promise((resolve, reject) => {
        https.get(
            {
                hostname: 'api.github.com',
                path,
                headers: {
                    'User-Agent': 'GAAJU-MD-ULTRA'
                }
            },
            res => {
                let data = '';

                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        ).on('error', reject);
    });
}

function parseRepo(input) {
    if (!input) return OWN_REPO;

    input = input
        .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
        .replace(/\/+$/, '')
        .replace(/^@/, '');

    const parts = input.split('/');

    if (parts.length >= 2) {
        return `${parts[0]}/${parts[1].replace(/\.git$/, '')}`;
    }

    return OWN_REPO;
}

function num(value) {
    return Number(value || 0).toLocaleString();
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
            const data = await ghGet(`/repos/${repo}`);

            if (!data || data.message === 'Not Found') {
                return await sock.sendMessage(
                    jid,
                    {
                        text: '❌ Repository not found.'
                    },
                    { quoted: msg }
                );
            }

            const repository = data.full_name || repo;
            const branch = data.default_branch || OWN_BRANCH;

            const text = `📦 *${repository}*

👤 ${data.owner?.login || 'Unknown'}
⭐ ${num(data.stargazers_count)}
🍴 ${num(data.forks_count)}
💻 ${data.language || 'Unknown'}
🌿 ${branch}
${data.private ? '🔒 Private' : '🔓 Public'}

📝 ${data.description || 'No description available.'}

> Powered by ᴄʜʀɪs ɢᴀᴀᴊᴜ`;

            await sock.sendMessage(
                jid,
                {
                    image: {
                        url: REPO_IMAGE
                    },
                    caption: text
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('Repo error:', error);

            await sock.sendMessage(
                jid,
                {
                    text: '❌ Unable to fetch repository information.'
                },
                { quoted: msg }
            );
        }
    }
};
