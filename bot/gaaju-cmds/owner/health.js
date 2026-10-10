'use strict';

const { getBotName } = require('../../lib/botname.js');

function getServerPort() {
    return parseInt(
        process.env.PORT ||
        process.env.SERVER_PORT ||
        process.env.APP_PORT ||
        '3000',
        10
    );
}

async function fetchHealth(port) {
    const response = await fetch(`http://localhost:${port}/health`, {
        signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

function memoryBar(usedMB, totalMB) {
    const used = Number(usedMB) || 0;
    const total = Number(totalMB) || 0;
    const percentage = total > 0
        ? Math.min(100, Math.max(0, (used / total) * 100))
        : 0;

    const filled = Math.round(percentage / 10);

    return `${'▰'.repeat(filled)}${'▱'.repeat(10 - filled)} ${percentage.toFixed(0)}%`;
}

module.exports = {
    name: 'health',
    aliases: ['healthcheck', 'botping', 'hc'],
    description: 'Check web server health and bot status',
    category: 'owner',
    ownerOnly: false,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;
        const port = getServerPort();
        const startTime = Date.now();

        const send = (content, options = {}) =>
            sock.sendMessage(
                chatId,
                { ...content },
                { quoted: msg, ...options }
            );

        const wantsJson = ['json', 'raw', 'data', 'api'].includes(
            String(args?.[0] || '').toLowerCase()
        );

        let data;

        try {
            data = await fetchHealth(port);
        } catch (error) {
            console.error('[HEALTH] Endpoint error:', error);

            return send({
                text:
                    `❌ *Health Check Failed*\n\n` +
                    `The web server health endpoint is unreachable.\n\n` +
                    `• Port: ${port}\n` +
                    `• Error: ${error.message}\n\n` +
                    `Ensure your server is running and provides a /health endpoint.`
            });
        }

        const ping = Date.now() - startTime;

        if (wantsJson) {
            const json = JSON.stringify({ ...data, pingMs: ping }, null, 2);

            if (json.length > 3000) {
                return sock.sendMessage(
                    chatId,
                    {
                        document: Buffer.from(json, 'utf8'),
                        fileName: `health-report-${Date.now()}.json`,
                        mimetype: 'application/json',
                        caption: `📄 *Bot Health Report*\nResponse time: ${ping}ms`
                    },
                    { quoted: msg }
                );
            }

            return send({
                text: `\`\`\`json\n${json}\n\`\`\``
            });
        }

        let botName = data.botName || 'GAAJU-MD-ULTRA';

        try {
            if (!data.botName && typeof getBotName === 'function') {
                botName = getBotName() || botName;
            }
        } catch {}

        const connected = Boolean(data.connected);
        const healthy = data.status === 'ok';
        const usedMemory = data.memoryMB ?? 0;
        const totalMemory = data.memoryTotalMB ?? 0;

        let checkedAt = 'Unknown';

        if (data.timestamp) {
            const date = new Date(data.timestamp);

            if (!Number.isNaN(date.getTime())) {
                checkedAt = date.toLocaleTimeString();
            }
        }

        const text =
            `*${botName} — HEALTH REPORT*\n\n` +
            `${healthy ? '✅' : '⚠️'} *Server Status:* ${healthy ? 'Healthy' : 'Degraded'}\n` +
            `${connected ? '🟢' : '🔴'} *WhatsApp:* ${connected ? 'Connected' : 'Disconnected'}\n\n` +
            `*SYSTEM INFORMATION*\n` +
            `• Version: ${data.version || 'Unknown'}\n` +
            `• Uptime: ${data.uptime || 'Unknown'}\n` +
            `• Platform: ${data.platform || process.platform}\n` +
            `• Node.js: ${data.nodeVersion || process.version}\n\n` +
            `*MEMORY USAGE*\n` +
            `${memoryBar(usedMemory, totalMemory)}\n` +
            `Used: ${usedMemory} MB / ${totalMemory} MB\n\n` +
            `*CONNECTION DETAILS*\n` +
            `• Port: ${port}\n` +
            `• Response Time: ${ping} ms\n` +
            `• Last Checked: ${checkedAt}\n\n` +
            `*Raw report:* ${prefix}health json\n\n` +
            `_Powered by Chris Gaaju_`;

        return send({ text });
    }
};
