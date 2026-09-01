'use strict';

const fs = require('fs');
const path = require('path');
const { getBotName } = require('../../lib/botname');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'readreceipt.json');

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify({ enabled: true }, null, 2)
        );
    }
}

function loadSettings() {
    ensureDataFile();

    try {
        return JSON.parse(
            fs.readFileSync(DATA_FILE, 'utf8')
        );
    } catch {
        return { enabled: true };
    }
}

function saveSettings(settings) {
    ensureDataFile();

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(settings, null, 2)
    );
}

module.exports = {
    name: 'readreceipt',

    aliases: [
        'read',
        'readstatus',
        'readmsg'
    ],

    description:
        'Turn automatic message read receipts on or off',

    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        if (!chatId) return;

        try {
            const settings = loadSettings();
            const option = (args[0] || '').toLowerCase();

            // Show current status
            if (!option) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `┏━━❐ *READ RECEIPT* ❐━━\n` +
                            `┃\n` +
                            `┃✦ Status: *${settings.enabled ? 'ON 🟢' : 'OFF 🔴'}*\n` +
                            `┃\n` +
                            `┃✦ Usage:\n` +
                            `┃  • .readreceipt on\n` +
                            `┃  • .readreceipt off\n` +
                            `┃\n` +
                            `┗━━❐ *${botName}* ❐`
                    },
                    { quoted: msg }
                );
            }

            if (!['on', 'off'].includes(option)) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ Invalid option.\n\n` +
                            `Use:\n` +
                            `• *.readreceipt on*\n` +
                            `• *.readreceipt off*`
                    },
                    { quoted: msg }
                );
            }

            settings.enabled = option === 'on';
            saveSettings(settings);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *READ RECEIPT* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: *${settings.enabled ? 'ON 🟢' : 'OFF 🔴'}*\n` +
                        `┃✦ Result: ✅ Setting saved\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error(
                '[READRECEIPT ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *READ RECEIPT* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Failed\n` +
                        `┃✦ Reason: ${error.message || 'Unknown error'}\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }
    }
};
