const https = require("https");
const { execSync } = require("child_process");
const { getBotName } = require("../../lib/botname");

const OWN_REPO = "Xchristech2/GAAJU-MD-ULTRA";
const OWN_BRANCH = "main";

const YOUTUBE_DEPLOY = "https://youtu.be/jHYSN3vUJec?si=nimF4UmjSz-Mz2fV";
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z";

function run(cmd) {
  try {
    return execSync(cmd, {
      encoding: "utf8",
      stdio: "pipe",
      timeout: 8000
    }).trim();
  } catch {
    return null;
  }
}

function fmtDate(d) {
  if (!d) return "N/A";
  try {
    return new Date(d).toDateString();
  } catch {
    return d;
  }
}

function num(v) {
  if (v == null) return "N/A";
  return Number(v).toLocaleString();
}

function trunc(str, len = 70) {
  if (!str) return "N/A";
  return String(str).length > len
    ? String(str).substring(0, len) + "…"
    : String(str);
}

function ghGet(path) {
  return new Promise((resolve, reject) => {
    const url = "https://api.github.com" + path;

    https.get(url, {
      headers: {
        "User-Agent": "GAAJU-MD-ULTRA-Bot",
        Accept: "application/vnd.github+json"
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
          reject(new Error("Parse error"));
        }
      });
    }).on("error", reject);
  });
}

function parseRepo(input) {
  if (!input) return OWN_REPO;

  const match = input.match(/github\.com\/([^\/\s]+\/[^\/\s?#]+)/i);
  if (match) return match[1].replace(/\.git$/, "");

  if (/^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(input)) return input;

  return null;
}

function localGitInfo() {
  const sha = run("git rev-parse HEAD")?.slice(0, 7) || "unknown";
  const branch = run("git branch --show-current") || OWN_BRANCH;
  const count = run("git rev-list --count HEAD") || "?";
  const log = run("git log --oneline -5") || "";

  const commits = log.split("\n").filter(Boolean).map(l => {
    const [hash, ...msg] = l.split(" ");
    return { hash, msg: msg.join(" ") };
  });

  return { sha, branch, count, commits };
}

module.exports = {
  name: "repo",
  aliases: ["botrepo", "repository", "gitinfo", "repostats"],
  description: "Show GitHub repo info — .repo [owner/name or url] (default: bot repo)",
  category: "owner",

  async execute(sock, msg, args, cmdName, prefix) {
    const jid = msg.key.remoteJid;
    const botName = getBotName();
    const footer = `╚═|〔 ${botName} 〕`;

    const input = args[0] || null;
    const repo = parseRepo(input);

    if (input && !repo) {
      return sock.sendMessage(jid, {
        text:
`╭━━━〔 🐙 REPOSITORY INFO 〕━━━⬣
┃
┃ ✦ Usage   : ${prefix}repo <owner/repo>
┃ ✦ Example : ${prefix}repo Xchristech2/GAAJU-MD-ULTRA
┃ ✦ Tip     : Leave blank to view the bot's default repository.
┃
${footer}`
      }, { quoted: msg });
    }

    try {
      await sock.sendMessage(jid, {
        react: { text: "🐙", key: msg.key }
      });

      const isOwn = repo === OWN_REPO;

      const [repoRes, commitsRes] = await Promise.all([
        ghGet("/repos/" + repo),
        ghGet("/repos/" + repo + "/commits?per_page=5")
      ]);

      const ok = repoRes.status === 200;
      const data = ok ? repoRes.data : null;

      const commits = Array.isArray(commitsRes.data)
        ? commitsRes.data.slice(0, 5).map(c => ({
            hash: c.sha?.slice(0, 7),
            msg: trunc(c.commit?.message?.split("\n")[0], 55),
            by: c.commit?.author?.name,
            date: fmtDate(c.commit?.author?.date)
          }))
        : [];

      let text = [];

      if (isOwn) {
        const stars = ok ? num(data.stargazers_count) : "—";
        const forks = ok ? num(data.forks_count) : "—";

        text = [        
`╭━━━〔 🤖 GAAJU-MD ULTRA 〕━━━⬣`,
`┃`,
`┃ ⭐ Stars   : ${stars}`,
`┃ 🍴 Forks   : ${forks}`,
`┃`,
`┃ 🔗 Repository`,
`┃ ${`https://github.com/${OWN_REPO}`}`,
`┃`,
`┃ 🎬 Deploy Video`,
`┃ ${YOUTUBE_DEPLOY}`,
`┃`,
`┃ 📢 WhatsApp Channel`,
`┃ ${WHATSAPP_CHANNEL}`,
`┃`,
`┃ ✦ Don't forget to ⭐ Star & 🍴 Fork`,
`┃ ✦ Share the project with your friends`,
`┃`,
`╰━━━━━━━━━━━━━━━━━━━━⬣`,
footer
        ];
      } else if (ok && data) {

        const topics = Array.isArray(data.topics) && data.topics.length
          ? data.topics.slice(0, 5).join(", ")
          : "N/A";

        text = [
`╭━━━〔 🎯 REPOSITORY INFO 〕━━━⬣`,
`┃`,
`┃ ✦ Repository : ${data.full_name}`,
`┃ ✦ About      : ${trunc(data.description, 75)}`,
`┃ ✦ Language   : ${data.language || "N/A"}`,
`┃ ✦ License    : ${data.license?.name || "N/A"}`,
`┃ ✦ Topics     : ${topics}`,
`┃`,
`┃ 📊 Statistics`,
`┃ ⭐ Stars      : ${num(data.stargazers_count)}`,
`┃ 🍴 Forks      : ${num(data.forks_count)}`,
`┃ 👁️ Watchers   : ${num(data.subscribers_count)}`,
`┃ 🐛 Issues     : ${num(data.open_issues_count)}`,
`┃`,
`┃ 📅 Activity`,
`┃ ✦ Created    : ${fmtDate(data.created_at)}`,
`┃ ✦ Updated    : ${fmtDate(data.updated_at)}`,
`┃`,
`┃ 🔗 ${data.html_url}`,
`┃`,
`╰━━━━━━━━━━━━━━━⬣`,
footer
        ];
      } else {
        throw new Error(`Repo "${repo}" not found or is private`);
      }

      await sock.sendMessage(jid, {
        text: text.join("\n")
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(jid, {
        text:
`╭━━━〔 ❌ REPOSITORY ERROR 〕━━━⬣
┃
┃ ✦ Status : Failed
┃ ✦ Reason : ${e.message}
┃
${footer}`
      }, { quoted: msg });
    }
  }
};
