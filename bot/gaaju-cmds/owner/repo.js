'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const { getBotName } = require('../../lib/botname');

const OWN_REPO = 'Xchristech2/GAAJU-MD-ULTRA';
const OWNER_NUMBER = '2348069675806';

const REPO_SITE = `https://github.com/${OWN_REPO}`;
const FORK_SITE = `${REPO_SITE}/fork`;
const ZIP_SITE = `${REPO_SITE}/archive/refs/heads/main.zip`;
const OWNER_SITE = `https://wa.me/${OWNER_NUMBER}`;

const MENU_IMAGE = path.resolve(
    __dirname,
    '../../../assets/menu-image.jpg'
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

            res.on('data', chunk => data += chunk);

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);

                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        return reject(
                            new Error(json.message || 'GitHub API request failed')
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

function num(value) {
    return Number(value || 0).toLocaleString('en-US');
}

function formatSize(kb) {
    if (kb < 1024) return `${num(kb)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
}

function trunc(value, max = 100) {
    if (!value) return 'No description available.';

    const text = String(value).replace(/\s+/g, ' ').trim();

    return text.length > max
        ? `${text.slice(0, max - 3)}...`
        : text;
}

module.exports = {
    name: 'repo',

    aliases: ['botrepo', 'repository', 'gitinfo', 'repostats'],

    description: 'Display GitHub repository information',

    category: 'owner',

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        try {
            const repo = parseRepo(args?.[0]);
            const data = await ghGet(`/repos/${repo}`);

            const repository = data.full_name || repo;
            const repoUrl = data.html_url || `https://github.com/${repository}`;
            const forkUrl = `${repoUrl}/fork`;
            const zipUrl = `${repoUrl}/archive/refs/heads/${data.default_branch || 'main'}.zip`;
            const ownerUrl = `https://wa.me/${OWNER_NUMBER}`;

            const text = `╭━━━〔 📦 *REPOSITORY* 〕
┃
┃ ▸ *Name:* ${repository}
┃ ▸ ⭐ *Stars:* ${num(data.stargazers_count)}
┃ ▸ 🍴 *Forks:* ${num(data.forks_count)}
┃ ▸ ❗ *Open Issues:* ${num(data.open_issues_count)}
┃ ▸ 📁 *Repo Size:* ${formatSize(data.size || 0)}
┃ ▸ 💻 *Language:* ${data.language || 'Unknown'}
┃
┃ 🔗 *Fork Link:*
┃ ${forkUrl}
┃
╰━━━━━━━━━━━━━━

> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`;

            const buttons = [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '⭐ STAR REPO',
                        url: repoUrl
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🍴 FORK REPO',
                        url: forkUrl
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📦 DOWNLOAD ZIP',
                        url: zipUrl
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '👑 OWNER',
                        url: ownerUrl
                    })
                }
            ];

            const message = {
                text,
                footer: 'GAAJU-MD-ULTRA',
                interactiveButtons: buttons
            };

            if (fs.existsSync(MENU_IMAGE)) {
                message.image = fs.readFileSync(MENU_IMAGE);
            }

            await sock.sendMessage(jid, message, { quoted: msg });

        } catch (error) {
            console.error('Repo command error:', error);

            await sock.sendMessage(
                jid,
                {
                    text: '❌ *Failed to fetch repository information.*\nPlease try again later.'
                },
                { quoted: msg }
            );
        }
    }
};
