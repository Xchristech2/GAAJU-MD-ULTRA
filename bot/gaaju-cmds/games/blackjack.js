'use strict';

module.exports = {
    name: 'blackjack',
    aliases: [],
    description: 'Play a simple blackjack game',
    category: 'games',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        const cardValues = [
            'A', '2', '3', '4', '5', '6', '7',
            '8', '9', '10', 'J', 'Q', 'K'
        ];

        const randomCard = () =>
            cardValues[
                Math.floor(Math.random() * cardValues.length)
            ];

        const getValue = card => {
            if (['J', 'Q', 'K'].includes(card)) return 10;
            if (card === 'A') return 11;
            return Number(card);
        };

        const player = [randomCard(), randomCard()];
        const dealer = [randomCard(), randomCard()];

        const playerTotal =
            player.reduce((sum, card) => sum + getValue(card), 0);

        const dealerTotal =
            dealer.reduce((sum, card) => sum + getValue(card), 0);

        let result;

        if (playerTotal > 21) {
            result = '💥 You busted!';
        } else if (dealerTotal > 21) {
            result = '🎉 Dealer busted — you win!';
        } else if (playerTotal === dealerTotal) {
            result = '🤝 It\'s a draw!';
        } else if (playerTotal > dealerTotal) {
            result = '🎉 You win!';
        } else {
            result = '❌ Dealer wins!';
        }

        await sock.sendMessage(
            chatId,
            {
                text:
                    `🃏 *BLACKJACK*\n\n` +
                    `👤 Your cards: ${player.join(', ')}\n` +
                    `🔢 Your total: ${playerTotal}\n\n` +
                    `🤖 Dealer cards: ${dealer.join(', ')}\n` +
                    `🔢 Dealer total: ${dealerTotal}\n\n` +
                    `${result}`
            },
            { quoted: msg }
        );
    }
};
