'use strict';

const fs = require('fs');
const path = require('path');

const {
    getBotName
} = require('../../lib/botname');

module.exports = {
    name: ''use strict';

const fs = require('fs');
const path = require('path');

const {
    getBotName
} = require('../../lib/botname');

module.exports = {
    name: 'checkbotname',

    aliases: [
        'botnamedebug',
        'namecheck'
    ],

    description: 'Debug bot name loading',

    category: 'utility',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        const chatId =
            msg.key.remoteJid;

        let debugText =
            `╭━━━〔 🔍 *BOT NAME DEBUG* 〕\n┃\n`;

        // Global variables
        debugText +=
            `┃ *Global Variables:*\n`;

        debugText +=
            `┃ ➽ global.BOT_NAME: ${
                global.BOT_NAME || '❌ Not set'
            }\n`;

        debugText +=
            `┃ ➽ process.env.BOT_NAME: ${
                process.env.BOT_NAME || '❌ Not set'
            }\n┃\n`;

        // File checks
        debugText +=
            `┃ *File Checks:*\n`;

        const possiblePaths = [
            {
                name: 'Root',
                file: path.join(
                    process.cwd(),
                    'bot_settings.json'
                )
            },
            {
                name: 'Commands',
                file: path.join(
                    __dirname,
                    '../bot_settings.json'
                )
            },
            {
                name: 'Owner commands',
                file: path.join(
                    __dirname,
                    '../owner/bot_settings.json'
                )
            },
            {
                name: 'Current utility folder',
                file: path.join(
                    __dirname,
                    'bot_settings.json'
                )
            },
            {
                name: 'Bot directory',
                file: path.join(
                    __dirname,
                    '../../bot_settings.json'
                )
            }
        ];

        for (
            const pathInfo
            of possiblePaths
        ) {
            if (
                fs.existsSync(
                    pathInfo.file
                )
            ) {
                try {
                    const settings =
                        JSON.parse(
                            fs.readFileSync(
                                pathInfo.file,
                                'utf8'
                            )
                        );

                    debugText +=
                        `┃ ✅ *${pathInfo.name}:*\n`;

                    debugText +=
                        `┃ ➽ Path: \`${pathInfo.file}\`\n`;

                    debugText +=
                        `┃ ➽ Bot Name: ${
                            settings.botName ||
                            '❌ Not found'
                        }\n`;

                    debugText +=
                        `┃ ➽ Updated: ${
                            settings.updatedAt ||
                            'Unknown'
                        }\n`;
                } catch (error) {
                    debugText +=
                        `┃ ❌ *${pathInfo.name}:* Parse error\n`;
                }
            } else {
                debugText +=
                    `┃ ❌ *${pathInfo.name}:* Not found\n`;
            }
        }

        // Menu bot name
        const menuBotName =
            getBotNameForMenu();

        debugText +=
            `┃\n┃ 📱 *Menu will show:*\n`;

        debugText +=
            `┃ ➽ "${menuBotName}"\n`;

        debugText +=
            `┃\n╰━━━━━━━━━━━`;

        try {
            await sock.sendMessage(
                chatId,
                {
                    text: debugText
                },
                {
                    quoted: msg
                }
            );
        } catch (error) {
            console.error(
                '[CHECKBOTNAME ERROR]',
                error
            );
        }
    }
};

function getBotNameForMenu() {
    try {
        const possiblePaths = [
            path.join(
                process.cwd(),
                'bot_settings.json'
            ),
            path.join(
                __dirname,
                '../../bot_settings.json'
            ),
            path.join(
                __dirname,
                '../owner/bot_settings.json'
            )
        ];

        for (
            const settingsPath
            of possiblePaths
        ) {
            if (
                fs.existsSync(
                    settingsPath
                )
            ) {
                try {
                    const settings =
                        JSON.parse(
                            fs.readFileSync(
                                settingsPath,
                                'utf8'
                            )
                        );

                    if (
                        settings.botName &&
                        settings.botName
                            .trim() !== ''
                    ) {
                        return settings.botName
                            .trim();
                    }
                } catch {}
            }
        }

        return (
            global.BOT_NAME ||
            getBotName()
        );

    } catch (error) {
        return 'Error loading';
    }
}',

    aliases: [
        'botnamedebug',
        'namecheck'
    ],

    description: 'Debug bot name loading',

    category: 'utility',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        const chatId =
            msg.key.remoteJid;

        let debugText =
            `╭━━━〔 🔍 *BOT NAME DEBUG* 〕\n┃\n`;

        // Global variables
        debugText +=
            `┃ *Global Variables:*\n`;

        debugText +=
            `┃ ➽ global.BOT_NAME: ${
                global.BOT_NAME || '❌ Not set'
            }\n`;

        debugText +=
            `┃ ➽ process.env.BOT_NAME: ${
                process.env.BOT_NAME || '❌ Not set'
            }\n┃\n`;

        // File checks
        debugText +=
            `┃ *File Checks:*\n`;

        const possiblePaths = [
            {
                name: 'Root',
                file: path.join(
                    process.cwd(),
                    'bot_settings.json'
                )
            },
            {
                name: 'Commands',
                file: path.join(
                    __dirname,
                    '../bot_settings.json'
                )
            },
            {
                name: 'Owner commands',
                file: path.join(
                    __dirname,
                    '../owner/bot_settings.json'
                )
            },
            {
                name: 'Current utility folder',
                file: path.join(
                    __dirname,
                    'bot_settings.json'
                )
            },
            {
                name: 'Bot directory',
                file: path.join(
                    __dirname,
                    '../../bot_settings.json'
                )
            }
        ];

        for (
            const pathInfo
            of possiblePaths
        ) {
            if (
                fs.existsSync(
                    pathInfo.file
                )
            ) {
                try {
                    const settings =
                        JSON.parse(
                            fs.readFileSync(
                                pathInfo.file,
                                'utf8'
                            )
                        );

                    debugText +=
                        `┃ ✅ *${pathInfo.name}:*\n`;

                    debugText +=
                        `┃ ➽ Path: \`${pathInfo.file}\`\n`;

                    debugText +=
                        `┃ ➽ Bot Name: ${
                            settings.botName ||
                            '❌ Not found'
                        }\n`;

                    debugText +=
                        `┃ ➽ Updated: ${
                            settings.updatedAt ||
                            'Unknown'
                        }\n`;
                } catch (error) {
                    debugText +=
                        `┃ ❌ *${pathInfo.name}:* Parse error\n`;
                }
            } else {
                debugText +=
                    `┃ ❌ *${pathInfo.name}:* Not found\n`;
            }
        }

        // Menu bot name
        const menuBotName =
            getBotNameForMenu();

        debugText +=
            `┃\n┃ 📱 *Menu will show:*\n`;

        debugText +=
            `┃ ➽ "${menuBotName}"\n`;

        debugText +=
            `┃\n╰━━━━━━━━━━━`;

        try {
            await sock.sendMessage(
                chatId,
                {
                    text: debugText
                },
                {
                    quoted: msg
                }
            );
        } catch (error) {
            console.error(
                '[CHECKBOTNAME ERROR]',
                error
            );
        }
    }
};

function getBotNameForMenu() {
    try {
        const possiblePaths = [
            path.join(
                process.cwd(),
                'bot_settings.json'
            ),
            path.join(
                __dirname,
                '../../bot_settings.json'
            ),
            path.join(
                __dirname,
                '../owner/bot_settings.json'
            )
        ];

        for (
            const settingsPath
            of possiblePaths
        ) {
            if (
                fs.existsSync(
                    settingsPath
                )
            ) {
                try {
                    const settings =
                        JSON.parse(
                            fs.readFileSync(
                                settingsPath,
                                'utf8'
                            )
                        );

                    if (
                        settings.botName &&
                        settings.botName
                            .trim() !== ''
                    ) {
                        return settings.botName
                            .trim();
                    }
                } catch {}
            }
        }

        return (
            global.BOT_NAME ||
            getBotName()
        );

    } catch (error) {
        return 'Error loading';
    }
}
