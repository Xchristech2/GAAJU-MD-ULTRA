'use strict';

const https = require('https');
const { getBotName } = require('../../lib/botname');

const OWN_REPO = 'Xchristech2/GAAJU-MD-ULTRA';
const OWN_BRANCH = 'main';

const REPO_SITE =
    'https://github.com/Xchristech2/GAAJU-MD-ULTRA';

const DEPLOY_TUTORIAL =
    'https://youtu.be/jHYSN3vUJec?si=nimF4UmjSz-Mz2fV';

const PAIR_SITE =
    'https://gaaju-ultra-pair-ljtv.onrender.com';

const VIEW_CHANNEL =
    'https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z';

function ghGet(path) {
    return new Promise((resolve, reject) => {
        https.get(
            {
                hostname: 'api.github.com',
                path,
                headers: {
                    'User-Agent': 'GAAJU-MD-ULTRA',
                    'Accept': 'application/vnd.github+json'
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
                    } catch (error) {
                        reject(error);
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
        return `${parts[0]}/${parts[1].replace(/\.git$/i, '')}`;
    }

    return OWN_REPO;
}

function num(value) {
    return Number(value || 0).toLocaleString();
}

function trunc(text, max = 120) {
    if (!text) return 'No description available.';

    text = String(text)
        .replace(/\s+/g, ' ')
        .trim();

    return text.length > max
        ? `${text.slice(0, max - 3)}...`
        : text;
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

    async execute(sock, msg, args, cmdName, prefix) {
        const jid = msg.key.remoteJid;

        try {
            const repo = parseRepo(args?.[0]);

            const data = await ghGet(`/repos/${repo}`);

            if (!data || data.message === 'Not Found') {
                return await sock.sendMessage(
                    jid,
                    {
                        text: '❌ *Repository not found.*'
                    },
                    { quoted: msg }
                );
            }

            const repository = data.full_name || repo;
            const branch = data.default_branch || OWN_BRANCH;

            const text = `📦 *${repository}*

👤 Owner: ${data.owner?.login || 'Unknown'}
⭐ Stars: ${num(data.stargazers_count)}
🍴 Forks: ${num(data.forks_count)}
💻 Language: ${data.language || 'Unknown'}
🌿 Branch: ${branch}
${data.private ? '🔒 Status: Private' : '🔓 Status: Public'}

📝 *Description:*
${trunc(data.description)}

🔗 *Deployment & Resources*

🌐 *Repo Site*
${REPO_SITE}

🎥 *Deployment Tutorial*
${DEPLOY_TUTORIAL}

🔑 *Pair Site*
${PAIR_SITE}

📢 *View Channel*
${VIEW_CHANNEL}

> Powered by ᴄʜʀɪs ɢᴀᴀᴊᴜ`;

            await sock.sendMessage(
                jid,
                {
                    text: text
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('❌ Repo command error:', error);

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
