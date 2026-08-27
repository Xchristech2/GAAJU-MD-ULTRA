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

        return match[1]
            .replace(/\.git$/, '');
    }

    if (
        /^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i
            .test(input)
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

function trunc(text, length = 70) {

    if (!text) {
        return 'N/A';
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

            const text = `┏━━❐✧ ${botName} ✧❐
┃
┃ ⚠️ Invalid repository
┃
┃ ✦ Usage:
┃   ${p}repo owner/repository
┃
┃ ✦ Example:
┃   ${p}repo Xchristech2/GAAJU-MD-ULTRA
┃
┗━━❐`;

            return sock.sendMessage(
                jid,
                {
                    text,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
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
                    75
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
             * OWN REPOSITORY LINKS
             * ==============================
             */

            let ownLinks = '';

            if (repo === OWN_REPO) {

                ownLinks = `

┏━━❐✧ BOT RESOURCES ✧❐
┃
┃ 🔑 Pairing
┃ ${SESSION_ID}
┃
┃ 🎬 Deployment Guide
┃ ${YOUTUBE_DEPLOY}
┃
┃ 📢 WhatsApp Channel
┃ ${WHATSAPP_CHANNEL}
┃
┗━━❐`;
            }

            /*
             * ==============================
             * FINAL REPOSITORY CARD
             * ==============================
             */

            const text = `┏━━❐✧ ${botName} ✧❐
┃
┃ 📦 REPOSITORY
┃
┃ ✦ Name      : ${repository}
┃ ✦ Owner     : ${owner}
┃ ✦ About     : ${description}
┃ ✦ Language  : ${language}
┃ ✦ License   : ${license}
┃ ✦ Branch    : ${branch}
┃ ✦ Status    : ${visibility}
┃
┗━━❐

┏━━❐✧ PROJECT STATISTICS ✧❐
┃
┃ ⭐ Stars     : ${stars}
┃ 🍴 Forks     : ${forks}
┃ 👁️ Watchers  : ${watchers}
┃ 🐛 Issues    : ${issues}
┃ 💾 Size      : ${size}
┃
┗━━❐

┏━━❐✧ SOURCE ✧❐
┃
┃ 🔗 Repository
┃ ${data.html_url}
┃
┗━━❐${ownLinks}

┏━━❐✧ DEVELOPER ✧❐
┃
┃ 🤖 ${botName}
┃ ⚡ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
┃
┗━━❐`;

            /*
             * ==============================
             * SEND
             * ==============================
             */

            await sock.sendMessage(
                jid,
                {
                    text,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
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

            /*
             * ==============================
             * ERROR MESSAGE
             * ==============================
             */

            await sock.sendMessage(
                jid,
                {
                    text: `┏━━❐✧ ${botName} ✧❐
┃
┃ ❌ REPOSITORY ERROR
┃
┃ ✦ Status : Failed
┃ ✦ Reason : ${error.message}
┃
┃ Please try again later.
┃
┗━━❐

⚡ Powered by GAAJU-MD ULTRA`,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
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
        }
    }
};
