const https = require("https");
const { execSync } = require("child_process");
const { getBotName } = require("../../lib/botname");

const OWN_REPO = "Xchristech2/GAAJU-MD-ULTRA";
const OWN_BRANCH = "main";

const YOUTUBE_DEPLOY = "https://youtu.be/jHYSN3vUJec?si=nimF4UmjSz-Mz2fV";
const SESSION_ID = "https://gaaju-ultra-pair-ljtv.onrender.com";
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z";

function ghGet(path) {
    return new Promise((resolve, reject) => {
        https.get("https://api.github.com" + path, {
            headers: {
                "User-Agent": "GAAJU-XMD-Bot",
                "Accept": "application/vnd.github+json"
            }
        }, res => {
            let data = "";

            res.on("data", chunk => data += chunk);

            res.on("end", () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(data)
                    });
                } catch {
                    reject(new Error("GitHub response error"));
                }
            });
        }).on("error", reject);
    });
}

function parseRepo(input) {
    if (!input) return OWN_REPO;

    const match = input.match(
        /github\.com\/([^\/\s]+\/[^\/\s?#]+)/i
    );

    if (match) {
        return match[1].replace(/\.git$/, "");
    }

    if (/^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(input)) {
        return input;
    }

    return null;
}

function num(value) {
    if (value == null) return "N/A";
    return Number(value).toLocaleString();
}

function trunc(text, length = 60) {
    if (!text) return "N/A";

    text = String(text);

    return text.length > length
        ? text.substring(0, length) + "..."
        : text;
}

module.exports = {
    name: "repo",
    aliases: [
        "botrepo",
        "repository",
        "gitinfo",
        "repostats"
    ],

    description:
        "Show GitHub repository information",

    category: "owner",

    async execute(sock, msg, args, cmdName, prefix) {

        const jid = msg.key.remoteJid;
        const botName = getBotName();

        const input = args[0] || null;
        const repo = parseRepo(input);

        if (input && !repo) {
            return sock.sendMessage(
                jid,
                {
                    text: `┏━━━━━━━━━━━━━━━━━

✧ Usage:    ${prefix}repo owner/repo
✧ Example:  ${prefix}repo Xchristech2/GAAJU-MD-ULTRA

┗━━━━━━━━━━━━━━━━━
Powered by ${botName}`
                },
                { quoted: msg }
            );
        }

        try {

            await sock.sendMessage(jid, {
                react: {
                    text: "📦",
                    key: msg.key
                }
            });

            const [repoRes, branchRes] = await Promise.all([
                ghGet("/repos/" + repo),
                ghGet("/repos/" + repo + "/branches")
            ]);

            if (repoRes.status !== 200) {
                throw new Error(
                    "Repository not found or is private."
                );
            }

            const data = repoRes.data;

            const owner =
                data.owner?.login || "N/A";

            const repository =
                data.name || "N/A";

            const description =
                trunc(
                    data.description ||
                    "No description available.",
                    65
                );

            const language =
                data.language || "N/A";

            const license =
                data.license?.spdx_id ||
                data.license?.name ||
                "N/A";

            const visibility =
                data.visibility === "public"
                    ? "🔓 Public"
                    : "🔒 Private";

            let branch = OWN_BRANCH;

            if (Array.isArray(branchRes.data)) {
                const mainBranch =
                    branchRes.data.find(
                        b =>
                            b.name === data.default_branch
                    );

                branch =
                    mainBranch?.name ||
                    data.default_branch ||
                    OWN_BRANCH;
            }

            const stars =
                num(data.stargazers_count);

            const forks =
                num(data.forks_count);

            const watchers =
                num(data.subscribers_count);

            const issues =
                num(data.open_issues_count);

            const size =
                data.size != null
                    ? `${(data.size / 1024).toFixed(2)} MB`
                    : "N/A";

            const text = `┏━━━━━━━━━━━━━━━━━

✧ Repository:  ${repository}
✧ Owner:       ${owner}
✧ Description: ${description}
✧ Language:    ${language}
✧ License:     ${license}
✧ Branch:      ${branch}
✧ Visibility:  ${visibility}

┗━━━━━━━━━━━━━━━━━
┏━━━━━━━━━━━━━━━━━

⿻ STATISTICS
⿻ Stars:       ${stars}
⿻ Forks:       ${forks}
⿻ Watchers:    ${watchers}
⿻ Size:        ${size}
⿻ Issues:      ${issues}

┗━━━━━━━━━━━━━━━━━
┏━━━━━━━━━━━━━━━━━

⿻ PROJECT LINKS
⿻ Repository:  ${data.html_url}
${repo === OWN_REPO
    ? `⿻ Pair Site:   ${SESSION_ID}
⿻ Deploy:      ${YOUTUBE_DEPLOY}
⿻ Channel:     ${WHATSAPP_CHANNEL}`
    : ""}

┗━━━━━━━━━━━━━━━━━
Powered by ${botName}`;

            await sock.sendMessage(
                jid,
                { text },
                { quoted: msg }
            );

        } catch (error) {

            await sock.sendMessage(
                jid,
                {
                    text: `┏━━━━━━━━━━━━━━━━━

✧ Status:  ❌ Failed
✧ Reason:  ${error.message}

┗━━━━━━━━━━━━━━━━━
Powered by ${botName}`
                },
                { quoted: msg }
            );
        }
    }
};
