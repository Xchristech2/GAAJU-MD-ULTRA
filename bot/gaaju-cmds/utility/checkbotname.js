'use strict';

const fs = require('fs');
const path = require('path');
const { getBotName } = require('../../lib/botname');

const CMDS_DIR = path.join(__dirname, '..');

module.exports = {
    name: 'checkbotname',

    aliases: ['botnamedebug', 'namecheck'],

    description: 'Debug bot name loading',

    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        let debugText = '🔍 *BOT NAME DEBUG INFO*\n\n';

        // =========================
        // GLOBAL VARIABLES
        // =========================

        debugText += '📊 *Global Variables:*\n';

        debugText +=
            `├─ global.BOT_NAME: ${global.BOT_NAME || '❌ Not set'}\n`;

        debugText +=
            `└─ process.env.BOT_NAME: ${process.env.BOT_NAME || '❌ Not set'}\n\n`;

        // =========================
        // FILE CHECKS
        // =========================

        debugText += '📁 *File Checks:*\n';

        const possiblePaths = [
            {
                name: 'Project root',
                path: path.join(__dirname, '../../bot_settings.json')
            },
            {
                name: 'Commands directory',
                path: path.join(CMDS_DIR, 'bot_settings.json')
            },
            {
                name: 'Owner commands',
                path: path.join(CMDS_DIR, 'owner', 'bot_settings.json')
            },
            {
                name: 'Utility commands',
                path: path.join(__dirname, 'bot_settings.json')
            },
            {
                name: 'Menu directory',
                path: path.join(CMDS_DIR, 'utility', 'bot_settings.json')
            }
        ];

        for (const pathInfo of possiblePaths) {
            if (fs.existsSync(pathInfo.path)) {
                try {
                    const settingsData = JSON.parse(
                        fs.readFileSync(pathInfo.path, 'utf8')
                    );

                    debugText +=
                        `✅ ${pathInfo.name}: ${pathInfo.path}\n`;

                    debugText +=
                        `   └─ Bot Name: ${settingsData.botName || '❌ Not found'}\n`;

                    debugText +=
                        `   └─ Updated: ${settingsData.updatedAt || 'Unknown'}\n`;

                } catch (error) {
                    debugText +=
                        `❌ ${pathInfo.name}: ${pathInfo.path} (Parse error)\n`;
                }
            } else {
                debugText +=
                    `❌ ${pathInfo.name}: ${pathInfo.path} (Not found)\n`;
            }
        }

        // =========================
        // MENU BOT NAME
        // =========================

        const menuBotName = getBotNameForMenu();

        debugText +=
            `\n📱 *Menu will show:* "${menuBotName}"`;

        await sock.sendMessage(
            chatId,
            {
                text: debugText
            },
            {
                quoted: msg
            }
        );
    },

    getBotNameForMenu() {
        try {
            const possiblePaths = [
                path.join(__dirname, '../../bot_settings.json'),
                path.join(CMDS_DIR, 'bot_settings.json'),
                path.join(CMDS_DIR, 'owner', 'bot_settings.json')
            ];

            for (const settingsPath of possiblePaths) {
                if (fs.existsSync(settingsPath)) {
                    const settings = JSON.parse(
                        fs.readFileSync(settingsPath, 'utf8')
                    );

                    if (
                        settings.botName &&
                        settings.botName.trim() !== ''
                    ) {
                        return settings.botName.trim();
                    }
                }
            }

            return global.BOT_NAME || getBotName();

        } catch (error) {
            console.error(
                '[CHECKBOTNAME ERROR]',
                error.message
            );

            return 'Error loading';
        }
    }
};
