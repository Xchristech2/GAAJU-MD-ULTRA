'use strict';

module.exports = {
    name: 'slot',
    aliases: [],
    description: 'Play a simple slot machine',
    category: 'games',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'];

        const spin = () =>
            symbols[Math.floor(Math.random() * symbols.length)];

        const a = spin();
        const b = spin();
        const c = spin();

        let result;

        if (a === b && b === c) {
            result = '🎉 JACKPOT! You won!';
        } else if (a === b || b === c || a === c) {
            result = '✨ Two matched! Nice!';
        } else {
            result = '😅 No match. Try again!';
        }

        await sock.sendMessage(
            chatId,
            {
                text:
                    `🎰 *SLOT MACHINE*\n\n` +
                    `${a} | ${b} | ${c}\n\n` +
                    result
            },
            { quoted: msg }
        );
    }
};
