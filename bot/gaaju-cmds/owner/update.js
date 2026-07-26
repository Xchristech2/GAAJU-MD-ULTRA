'use strict';
const { execSync } = require('child_process');
const https = require('https');
const path  = require('path');
const fs    = require('fs');
const { getBotName } = require('../../lib/botname');

const REPO   = 'Xchristech2/GAAJU-MD-ULTRA';
const BRANCH = 'main';

//const IS_HEROKU = !!process.env.DYNO;
//const PLATFORM  = IS_HEROKU ? 
//'Heroku' : 'VPS/Panel';

const GITHUB_URL = `https://github.com/${REPO}.git`;

// __dirname = bot/gaaju-cmds/owner
// BOT_ROOT  = bot/
// REPO_ROOT = the folder containing bot/ (i.e. the project root)
const BOT_ROOT  = path.resolve(__dirname, '../../');
const REPO_ROOT = path.resolve(BOT_ROOT, '..');

// Session lives at bot/session/
const SESSION_DIR    = path.join(BOT_ROOT, 'session');
// Backup goes to project root level so it's never touched by zip extraction
const SESSION_BACKUP = path.join(REPO_ROOT, '_session_update_backup');

function run(cmd, opts = {}) {
    return execSync(cmd, { encoding: 'utf8', timeout: 120000, stdio: 'pipe', ...opts }).trim();
}

function isGitRepo() {
    try { run('git rev-parse --git-dir', { cwd: REPO_ROOT }); return true; } catch { return false; }
}

function getCurrentCommit() {
    try { return run('git rev-parse HEAD', { cwd: REPO_ROOT }); } catch { return null; }
}

async function getLatestCommit() {
    return new Promise((resolve, reject) => {
        const url = `https://api.github.com/repos/${REPO}/commits/${BRANCH}`;
        https.get(url, { headers: { 'User-Agent': 'GAAJU-MD-Bot' } }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ sha: json.sha, message: json.commit?.message?.split('\n')[0] || '' });
                } catch { reject(new Error('Failed to parse GitHub response')); }
            });
        }).on('error', reject);
    });
}

// Recursively copy a directory
function copyDirSync(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
        const s = path.join(src, entry);
        const d = path.join(dest, entry);
        fs.statSync(s).isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d);
    }
}

// Backup entire session folder to a safe location
function backupSession() {
    try {
        if (!fs.existsSync(SESSION_DIR)) return false;
        if (fs.existsSync(SESSION_BACKUP)) fs.rmSync(SESSION_BACKUP, { recursive: true, force: true });
        copyDirSync(SESSION_DIR, SESSION_BACKUP);
        return true;
    } catch { return false; }
}

// Restore session folder from backup
function restoreSession() {
    try {
        if (!fs.existsSync(SESSION_BACKUP)) return false;
        if (fs.existsSync(SESSION_DIR)) fs.rmSync(SESSION_DIR, { recursive: true, force: true });
        copyDirSync(SESSION_BACKUP, SESSION_DIR);
        fs.rmSync(SESSION_BACKUP, { recursive: true, force: true });
        return true;
    } catch { return false; }
}

// Download zip with redirect support — returns a Buffer
async function downloadZip(url) {
    return new Promise((resolve, reject) => {
        const request = (reqUrl, redirects = 0) => {
            if (redirects > 5) return reject(new Error('Too many redirects'));
            https.get(reqUrl, { headers: { 'User-Agent': 'GAAJU-MD-Bot' } }, res => {
                if ([301, 302, 307, 308].includes(res.statusCode)) {
                    return request(res.headers.location, redirects + 1);
                }
                if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
                const chunks = [];
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            }).on('error', reject);
        };
        request(url);
    });
}

// Pure Node.js ZIP extractor — no unzip binary required
// Extracts to REPO_ROOT so "bot/index.js" lands at REPO_ROOT/bot/index.js correctly
function extractZipBuffer(buf, destDir, skipPaths) {
    const zlib = require('zlib');

    // Find End of Central Directory (signature 0x06054b50)
    let eocdOffset = -1;
    for (let i = buf.length - 22; i >= 0; i--) {
        if (buf.readUInt32LE(i) === 0x06054b50) { eocdOffset = i; break; }
    }
    if (eocdOffset === -1) throw new Error('Invalid ZIP: EOCD not found');

    const cdCount  = buf.readUInt16LE(eocdOffset + 10);
    const cdOffset = buf.readUInt32LE(eocdOffset + 16);

    let pos = cdOffset;
    let stripPrefix = null;

    for (let i = 0; i < cdCount; i++) {
        if (buf.readUInt32LE(pos) !== 0x02014b50) break;

        const compMethod  = buf.readUInt16LE(pos + 10);
        const compSize    = buf.readUInt32LE(pos + 20);
        const uncompSize  = buf.readUInt32LE(pos + 24);
        const nameLen     = buf.readUInt16LE(pos + 28);
        const extraLen    = buf.readUInt16LE(pos + 30);
        const commentLen  = buf.readUInt16LE(pos + 32);
        const localOffset = buf.readUInt32LE(pos + 42);
        const fileName    = buf.slice(pos + 46, pos + 46 + nameLen).toString('utf8');

        pos += 46 + nameLen + extraLen + commentLen;

        // Auto-detect top-level folder prefix (e.g. "GAAJU-MD-ULTRA-main/")
        if (stripPrefix === null) {
            const firstSlash = fileName.indexOf('/');
            stripPrefix = firstSlash > 0 ? fileName.slice(0, firstSlash + 1) : '';
        }

        // Strip the top-level folder so paths are relative to project root
        const relPath = stripPrefix && fileName.startsWith(stripPrefix)
            ? fileName.slice(stripPrefix.length)
            : fileName;

        if (!relPath || relPath.endsWith('/')) continue; // directory entry

        // Skip protected paths — check both top dir and full path prefix
        const topDir  = relPath.split('/')[0];
        const fullDest = path.join(destDir, relPath);

        // Never touch session/ or data/ regardless of where they appear
        if (skipPaths.has(topDir)) continue;
        if (relPath.startsWith('bot/session/') || relPath.startsWith('bot/data/')) continue;

        // Read local file header for actual data offset
        const localNameLen  = buf.readUInt16LE(localOffset + 26);
        const localExtraLen = buf.readUInt16LE(localOffset + 28);
        const dataStart     = localOffset + 30 + localNameLen + localExtraLen;

        fs.mkdirSync(path.dirname(fullDest), { recursive: true });

        if (compMethod === 0) {
            fs.writeFileSync(fullDest, buf.slice(dataStart, dataStart + uncompSize));
        } else if (compMethod === 8) {
            fs.writeFileSync(fullDest, zlib.inflateRawSync(buf.slice(dataStart, dataStart + compSize)));
        }
    }
}

async function updateViaZip() {
    const zipUrl = `https://codeload.github.com/${REPO}/zip/refs/heads/${BRANCH}`;

    // These top-level dirs in the zip are skipped entirely
    const SKIP = new Set(['.env', 'node_modules']);

    const buf = await downloadZip(zipUrl);
    // Extract to REPO_ROOT (parent of bot/) so zip paths like "bot/index.js" land correctly
    extractZipBuffer(buf, REPO_ROOT, SKIP);
}

module.exports = {
    name:        'update',
    aliases:     ['upgrade', 'pullupdate'],
    description: 'Pull latest changes from GitHub and restart',
    category:    'owner',
    ownerOnly:   true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        try { await sock.sendMessage(chatId, { react: { text: '🔄', key: msg.key } }); } catch {}
        const botName = getBotName();
        const foot    = `╚═|〔 ${botName} 〕`;

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
            return await sock.sendMessage(chatId, {
                text: `╔═|〔  UPDATE 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n${foot}`
            }, { quoted: msg });
        }

        if (IS_HEROKU) {
            let latest;
            try { latest = await getLatestCommit(); } catch { latest = { sha: '?', message: '?' }; }
            return await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  UPDATE 〕`,
                    `║`,
                    `║ ▸ *Platform* : ☁️ Heroku`,
                    `║ ▸ *Status*   : ℹ️ Redeploy from Heroku dashboard`,
                    `║ ▸ *Latest*   : ${latest.sha?.slice(0, 7)} — ${latest.message}`,
                    `║`,
                    `${foot}`,
                ].join('\n')
            }, { quoted: msg });
        }

        let latest;
        try { latest = await getLatestCommit(); }
        catch (err) {
            return await sock.sendMessage(chatId, {
                text: `╔═|〔  UPDATE 〕\n║\n║ ▸ *Status* : ❌ GitHub unreachable\n║ ▸ *Reason* : ${err.message}\n║\n${foot}`
            }, { quoted: msg });
        }

        const current      = getCurrentCommit();
        const shortCurrent = current?.slice(0, 7) || 'unknown';
        const shortLatest  = latest.sha?.slice(0, 7) || 'unknown';

        if (current && latest.sha && current === latest.sha) {
            return await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  UPDATE 〕`,
                    `║`,
                    `║ ▸ *Status*   : ✅ Already up to date`,
                    `║ ▸ *Commit*   : ${shortCurrent}`,
                    `║ ▸ *Changes*  : ${latest.message}`,
                    `║`,
                    `${foot}`,
                ].join('\n')
            }, { quoted: msg });
        }

        // ── Backup entire session folder BEFORE update ────────────────────────
        const sessionSaved = backupSession();

        let pullErr, npmErr, method;

        if (isGitRepo()) {
            method = 'git';
            try {
                run(`git fetch ${GITHUB_URL} ${BRANCH}`, { cwd: REPO_ROOT });
                run(`git reset --hard FETCH_HEAD`, { cwd: REPO_ROOT });
            } catch (err) { pullErr = err.message?.slice(0, 150); }
        } else {
            method = 'zip';
            try {
                await updateViaZip();
            } catch (err) { pullErr = err.message?.slice(0, 150); }
        }

        // ── Always restore session regardless of update result ────────────────
        restoreSession();

        if (pullErr) {
            return await sock.sendMessage(chatId, {
                text: `╔═|〔  UPDATE 〕\n║\n║ ▸ *Status* : ❌ Update failed\n║ ▸ *Method* : ${method}\n║ ▸ *Reason* : ${pullErr}\n║\n${foot}`
            }, { quoted: msg });
        }

        try { run('npm install --production', { cwd: BOT_ROOT }); }
        catch { npmErr = true; }

        await sock.sendMessage(chatId, {
            text: [
                `╔═|〔  UPDATE 〕`,
                `║`,
                `║ ▸ *Status*   : ✅ Updated successfully`,
                `║ ▸ *Platform* : ${PLATFORM}`,
                `║ ▸ *Method*   : ${method === 'git' ? '🔀 Git pull' : '📦 Zip download'}`,
                `║ ▸ *From*     : ${shortCurrent}`,
                `║ ▸ *To*       : ${shortLatest}`,
                `║ ▸ *Changes*  : ${latest.message}`,
                `║ ▸ *Session*  : ${sessionSaved ? '✅ Preserved' : '⚠️ Could not backup'}`,
                `║ ▸ *Deps*     : ${npmErr ? '⚠️ npm had warnings' : '✅ Up to date'}`,
                `║`,
                `║ ▸ 🔄 Restarting...`,
                `║`,
                `${foot}`,
            ].join('\n')
        }, { quoted: msg });

        setTimeout(() => process.exit(1), 3000);
    },
};
