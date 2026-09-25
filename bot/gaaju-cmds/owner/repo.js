'use strict';

const https = require('https');
const { getBotName } = require('../../lib/botname');

const OWN_REPO = 'Xchristech2/GAAJU-MD-ULTRA';
const OWN_BRANCH = 'main';

const YOUTUBE_DEPLOY =
    'https://youtu.be/jHYSN3vUJec?si=nimF4UmjSz-Mz2fV';

const SESSION_ID =
    'https://gaaju-ultra-pair-ljtv.onrender.com';

const WHATSAPP_CHANNEL =
    'https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z';

const REPO_IMAGE =
    'https://raw.githubusercontent.com/Xchristech2/GAAJU-MD-ULTRA/main/assets/xd-logo.jpg';

/*
 * ==============================
 * GITHUB REQUEST
 * ==============================
 */

function ghGet(path) {
    return new Promise((resolve, reject) => {
        const request = https.get(
            'https://api.github.com' + path,
            {
                headers: {
                    'User-Agent': 'GAAJU-XMD-Bot',
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
                        resolve({
                            status: res.statusCode,
                            data: JSON.parse(data)
                        });
                    } catch {
                        reject(
                            new Error(
                                'Invalid GitHub response.'
                            )
                        );
                    }
                });
            }
        );

        request.on('error', reject);
    });
}

/*
 * ==============================
 * REPOSITORY PARSER
 * ==============================
 */

function parseRepo(input) {
    if (!input) {
        return OWN_REPO;
    }

    const match = input.match(
        /github\.com\/([^\/\s]+\/[^\/\s?#]+)/i
    );

    if (match) {
        return match[1].replace(/\.git$/, '');
    }

    if (
        /^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(input)
    ) {
        return input;
    }

    return null;
}

/*
 * ==============================
 * NUMBER FORMAT
 * ==============================
 */

function num(value) {
    if (value == null) {
        return 'N/A';
    }

    return Number(value).toLocaleString();
}

/*
 * ==============================
 * TEXT TRIMMER
 * ==============================
 */

function trunc(text, length = 120) {
    if (!text) {
        return 'No description available.';
    }

    text = String(text);

    if (text.length <= length) {
        return text;
    }

    return text.substring(0, length) + '...';
}

/*
 * ==============================
 * VISIBILITY
 * ==============================
 */

function getVisibility(data) {
    if (data.visibility === 'public') {
        return '🔓 Public';
    }

    return '🔒 Private';
}

/*
 * ==============================
 * LANGUAGE ICON
 * ==============================
 */

function getLanguage(language) {
    if (!language) {
        return '💻 Unknown';
    }

    const icons = {
        JavaScript: '🟨',
        TypeScript: '🔷',
        Python: '🐍',
        Java: '☕',
        PHP: '🐘',
        C: '🔵',
        'C++': '🔷',
        'C#': '🟣',
        HTML: '🌐',
        CSS: '🎨'
    };

    return `${icons[language] || '💻'} ${language}`;
}

/*
 * ==============================
 * COMMAND
 * ==============================
 */

module.exports = {

    name: 'repo',

    aliases: [
        'botrepo',
        'repository',
        'gitinfo',
        'repostats'
    ],

    description:
        'Display detailed GitHub repository information',

    category: 'owner',

    async execute(
        sock,
        msg,
        args,
        cmdName,
        prefix
    ) {

        const jid =
            msg.key.remoteJid;

        const botName =
            getBotName();

        const p =
            prefix || '.';

        const input =
            args[0] || null;

        const repo =
            parseRepo(input);

        /*
         * ==============================
         * INVALID REPOSITORY
         * ==============================
         */

        if (input && !repo) {

            return sock.sendMessage(
                jid,
                {
                    text: `┏━━❐➭ ${botName} ❐
┃➭
┃➭ ⚠️ Invalid repository
┃➭
┃➭ Usage:
┃➭ ${p}repo owner/repository
┃➭
┃➭ Example:
┃➭ ${p}repo Xchristech2/GAAJU-MD-ULTRA
┗━━❐➭`
                },
                {
                    quoted: msg
                }
            );
        }

        try {

            /*
             * ==============================
             * REACTION
             * ==============================
             */

            await sock.sendMessage(
                jid,
                {
                    react: {
                        text: '📦',
                        key: msg.key
                    }
                }
            );

            /*
             * ==============================
             * FETCH DATA
             * ==============================
             */

            const [
                repoRes,
                branchRes
            ] = await Promise.all([

                ghGet(
                    '/repos/' + repo
                ),

                ghGet(
                    '/repos/' +
                    repo +
                    '/branches'
                )
            ]);

            if (repoRes.status !== 200) {
                throw new Error(
                    'Repository not found or is private.'
                );
            }

            const data =
                repoRes.data;

            /*
             * ==============================
             * BASIC INFORMATION
             * ==============================
             */

            const owner =
                data.owner?.login ||
                'N/A';

            const repository =
                data.name ||
                'N/A';

            const description =
                trunc(
                    data.description ||
                    'No description available.',
                    120
                );

            const language =
                getLanguage(
                    data.language
                );

            const license =
                data.license?.spdx_id ||
                data.license?.name ||
                'None';

            const visibility =
                getVisibility(data);

            /*
             * ==============================
             * BRANCH
             * ==============================
             */

            let branch =
                data.default_branch ||
                OWN_BRANCH;

            if (
                Array.isArray(
                    branchRes.data
                )
            ) {

                const mainBranch =
                    branchRes.data.find(
                        b =>
                            b.name ===
                            data.default_branch
                    );

                branch =
                    mainBranch?.name ||
                    data.default_branch ||
                    OWN_BRANCH;
            }

            /*
             * ==============================
             * STATISTICS
             * ==============================
             */

            const stars =
                num(
                    data.stargazers_count
                );

            const forks =
                num(
                    data.forks_count
                );

            const watchers =
                num(
                    data.subscribers_count
                );

            const issues =
                num(
                    data.open_issues_count
                );

            const size =
                data.size != null
                    ? `${(
                        data.size / 1024
                    ).toFixed(2)} MB`
                    : 'N/A';

            /*
             * ==============================
             * LINKS
             * ==============================
             */

            const repoUrl =
                data.html_url;

            const downloadZip =
                `https://github.com/${repo}/archive/refs/heads/${branch}.zip`;

            const forkUrl =
                `https://github.com/${repo}/fork`;

            /*
             * ==============================
             * REPO CAPTION
             * ==============================
             */

            const caption = `📦 *${repository}*

👤 Owner: ${owner}
⭐ Stars: ${stars}
🍴 Forks: ${forks}
👁️ Watchers: ${watchers}
🐛 Issues: ${issues}
💾 Size: ${size}
💻 Language: ${language}
📜 License: ${license}
🌿 Branch: ${branch}
🔓 Status: ${visibility}

🕒 Last Updated:
${data.updated_at
    ? new Date(data.updated_at).toLocaleString()
    : 'N/A'}

📝 *Description:*
${description}

👋 Hey @${owner}!

⭐ Don't forget to fork and star the repo!

Tap a button below to continue 👇

> Powered by ᴄʜʀɪs ɢᴀᴀᴊᴜ`;

            /*
             * ==============================
             * BUTTONS
             * ==============================
             */

            const buttons = [
                {
                    index: 1,
                    urlButton: {
                        displayText:
                            '📋 Copy Link',
                        url:
                            repoUrl
                    },
                    buttonId:
                        'repo_copy'
                },
                {
                    index: 2,
                    urlButton: {
                        displayText:
                            '↗️ Visit Repo',
                        url:
                            repoUrl
                    }
                },
                {
                    index: 3,
                    urlButton: {
                        displayText:
                            '📥 Download ZIP',
                        url:
                            downloadZip
                    }
                }
            ];

            /*
             * ==============================
             * OWN REPO BUTTONS
             * ==============================
             */

            if (repo === OWN_REPO) {

                buttons.push(
                    {
                        index: 4,
                        urlButton: {
                            displayText:
                                '🍴 Fork Repo',
                            url:
                                forkUrl
                        }
                    },
                    {
                        index: 5,
                        urlButton: {
                            displayText:
                                '🎥 Watch Tutorial',
                            url:
                                YOUTUBE_DEPLOY
                        }
                    },
                    {
                        index: 6,
                        urlButton: {
                            displayText:
                                '💬 Support',
                            url:
                                WHATSAPP_CHANNEL
                        }
                    },
                    {
                        index: 7,
                        urlButton: {
                            displayText:
                                '🔑 Pair Site',
                            url:
                                SESSION_ID
                        }
                    }
                );
            }

            /*
             * ==============================
             * SEND IMAGE + BUTTONS
             * ==============================
             */

            await sock.sendMessage(
                jid,
                {
                    image: {
                        url: REPO_IMAGE
                    },

                    caption,

                    templateButtons:
                        buttons,

                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,

                        mentionedJid: [
                            `${owner}@s.whatsapp.net`
                        ],

                        forwardedNewsletterMessageInfo: {
                            newsletterJid:
                                '120363406588763460@newsletter',

                            newsletterName:
                                'GAAJU-MD-ULTRA',

                            serverMessageId: -1
                        }
                    }
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {

            console.error(
                '[REPO ERROR]',
                error
            );

            await sock.sendMessage(
                jid,
                {
                    text: `┏━━❐➭ ${botName} ❐
┃➭
┃➭ ❌ *REPOSITORY ERROR*
┃➭
┃➭ Status : Failed
┃➭ Reason : ${error.message}
┃➭
┃➭ Please try again later.
┗━━❐➭

> Powered by ᴄʜʀɪs ɢᴀᴀᴊᴜ`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
