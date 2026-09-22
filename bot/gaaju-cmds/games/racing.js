'use strict';

module.exports = {
    name: 'racing',
    aliases: [],
    description: 'Start a simple random racing game',
    category: 'games',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        const racers = [
            '🏎️ Racer 1',
            '🏎️ Racer 2',
            '🏎️ Racer 3',
            '🏎️ Racer 4'
        ];

        const winner =
            racers[Math.floor(Math.random() * racers.length)];

        await sock.sendMessage(
            chatId,
            {
                text:
                    `🏁 *RACING GAME*\n\n` +
                    `🏎️ Racer 1\n` +
                    `🏎️ Racer 2\n` +
                    `🏎️ Racer 3\n` +
                    `🏎️ Racer 4\n\n` +
                    `🏆 Winner: ${winner}\n\n` +
                    `🎉 Congratulations!`
            },
            { quoted: msg }
        );
    }
};
