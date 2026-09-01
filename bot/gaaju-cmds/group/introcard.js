'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
  name: 'introcard',
  aliases: ['intro', 'welcomeintro'],
  description: 'Send an introduction card for a new group member',
  category: 'group',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    // Group only
    if (!chatId || !chatId.endsWith('@g.us')) {
      return sock.sendMessage(
        chatId,
        {
          text: '❌ This command can only be used in a group.'
        },
        { quoted: msg }
      );
    }

    // Get the person being replied to
    const quotedParticipant =
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (!quotedParticipant) {
      return sock.sendMessage(
        chatId,
        {
          text:
            '⚠️ *Reply to the new member’s message*\n\n' +
            'Example:\n' +
            'Reply to their message and send:\n' +
            '`.introcard`'
        },
        { quoted: msg }
      );
    }

    try {
      const metadata = await sock.groupMetadata(chatId);
      const groupName = metadata.subject || 'Our Group';
      const botName = getBotName();

      const mention = `@${quotedParticipant.split('@')[0].split(':')[0]}`;

      const text = `╔━━❐ 👋 *WELCOME* ❐━━╗

┃✦ 👤 Name: ${mention}
┃✦ 🎂 Age:
┃✦ ⚧️ Gender:
┃✦ 📍 From:
┃✦ 🏠 Location:
┃✦ 🎓 School/Work:
┃✦ ❤️ Relationship:
┃✦ 🎨 Hobbies:
┃✦ 🎵 Favourite Artist:
┃✦ 🍔 Favourite Food:
┃✦ ⚽ Favourite Sport:
┃✦ 🎯 Goal:
┃✦ 😎 Fun Fact:
┃✦ 📱 Social Media:
┗━━❐

✨ *Welcome to ${groupName}!*

👋 ${mention}, please introduce yourself
and make yourself comfortable here. ❤️

🤝 *Enjoy your stay!*
┗━━❐ *${botName}*`;

      await sock.sendMessage(
        chatId,
        {
          text,
          mentions: [quotedParticipant]
        },
        { quoted: msg }
      );

    } catch (error) {
      console.error('introcard error:', error);

      await sock.sendMessage(
        chatId,
        {
          text: '❌ Failed to send the introduction card.'
        },
        { quoted: msg }
      );
    }
  }
};
