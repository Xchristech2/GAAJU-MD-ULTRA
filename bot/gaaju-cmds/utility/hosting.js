'use strict';

module.exports = {
    name: 'hosting',
    aliases: ['host'],
    description: 'Show the hosting service running the bot',

    async execute(sock, m) {
        try {
            let hosting = 'Unknown';

            // Common hosting providers
            if (process.env.RENDER_SERVICE_NAME || process.env.RENDER) {
                hosting = 'Render';
            } else if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID) {
                hosting = 'Railway';
            } else if (process.env.KOYEB_APP_NAME || process.env.KOYEB_APP_ID) {
                hosting = 'Koyeb';
            } else if (process.env.REPL_ID || process.env.REPL_SLUG) {
                hosting = 'Replit';
            } else if (process.env.HEROKU_APP_NAME) {
                hosting = 'Heroku';
            } else if (process.env.VERCEL) {
                hosting = 'Vercel';
            } else if (
                process.env.PTERODACTYL ||
                process.env.P_SERVER_UUID ||
                process.env.P_SERVER_LOCATION
            ) {
                hosting = 'Pterodactyl / Panel';
            } else if (process.env.CODESPACES) {
                hosting = 'GitHub Codespaces';
            } else if (process.env.DOCKER_CONTAINER) {
                hosting = 'Docker';
            } else if (process.env.VPS) {
                hosting = 'VPS';
            }

            const text = `╭━━━〔 🖥️ *HOSTING* 〕
┃ ➽ *Bot running on:* ${hosting}
╰━━━━━━━━━━━`;

            await sock.sendMessage(
                m.key.remoteJid,
                { text },
                { quoted: m }
            );

        } catch (error) {
            console.error('Hosting command error:', error);

            await sock.sendMessage(
                m.key.remoteJid,
                {
                    text: '❌ Unable to detect hosting service.'
                },
                { quoted: m }
            );
        }
    }
};
