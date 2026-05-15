/**
 * API helpers
 *  - casper*  → https://apis.xcasper.space  (primary)
 *  - keith*   → https://apiskeith.top        (fallback)
 */

const CASPER = 'https://apis.xcasper.space';
const KEITH  = 'https://apiskeith.top';
const MAX_BYTES = 60 * 1024 * 1024;

async function casperGet(path, params = {}, timeoutMs = 30000) {
    const qs  = new URLSearchParams(params).toString();
    const url = `${CASPER}${path}${qs ? '?' + qs : ''}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`Casper HTTP ${res.status}`);
    return res.json();
}

async function keithGet(path, params = {}) {
    const qs  = new URLSearchParams(params).toString();
    const url = `${KEITH}${path}${qs ? '?' + qs : ''}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function keithTry(paths, params = {}) {
    let lastErr;
    for (const path of paths) {
        try {
            const j = await keithGet(path, params);
            if (j.status && j.result) return j;
        } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('All API variants failed');
}

function extractUrl(result) {
    if (!result) return null;
    if (typeof result === 'string' && result.startsWith('http')) return result;
    if (typeof result === 'object') {
        for (const k of ['dl_link','download_url','video_hd','video_sd','hd','sd','url','audio','video','download','link','media','file','mp4','mp3','data']) {
            if (result[k] && typeof result[k] === 'string' && result[k].startsWith('http')) return result[k];
        }
        if (Array.isArray(result) && result[0]) return extractUrl(result[0]);
    }
    return null;
}

async function dlBuffer(url) {
    const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
    const cl = parseInt(res.headers.get('content-length') || '0');
    if (cl && cl > MAX_BYTES) throw new Error(`File too large (${(cl/1024/1024).toFixed(1)} MB > 60 MB)`);
    const ab = await res.arrayBuffer();
    if (ab.byteLength > MAX_BYTES) throw new Error(`File too large (${(ab.byteLength/1024/1024).toFixed(1)} MB > 60 MB)`);
    return Buffer.from(ab);
}

const { spawn } = require('child_process');

function convertTo128kbps(inputBuffer) {
    return new Promise((resolve, reject) => {
        const ff = spawn('ffmpeg', ['-i','pipe:0','-vn','-ar','44100','-ac','2','-b:a','128k','-f','mp3','pipe:1']);
        const chunks = [];
        ff.stdout.on('data', c => chunks.push(c));
        ff.stdout.on('end', () => resolve(Buffer.concat(chunks)));
        ff.stderr.on('data', () => {});
        ff.on('error', reject);
        ff.on('close', code => { if (code !== 0 && !chunks.length) reject(new Error('ffmpeg exited ' + code)); });
        ff.stdin.on('error', () => {});
        ff.stdin.write(inputBuffer);
        ff.stdin.end();
    });
}

module.exports = { casperGet, keithGet, keithTry, extractUrl, dlBuffer, convertTo128kbps };
