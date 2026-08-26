'use strict';

const { getBotName } = require('../../lib/botname');

/*
|--------------------------------------------------------------------------
| ✏️ EDIT THESE 3 LINKS
|--------------------------------------------------------------------------
*/

const REPO_URL =
    'https://github.com/Xchristech2/GAAJU-MD-ULTRA';

const SESSION_URL =
    'https://gaaju-ultra-pair-ljtv.onrender.com';

const TUTORIAL_URL =
    'https://youtu.be/jHYSN3vUJec';


/*
|--------------------------------------------------------------------------
| DEPLOY COMMAND
|--------------------------------------------------------------------------
*/

module.exports = {

    name: 'deploy',

    aliases: [
        'howtodeploy',
        'deployment',
        'deployguide'
    ],

    description:
        'Show GAAJU-MD ULTRA deployment guide',

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

        const botName =
            getBotName();

        const p =
            prefix || '.';

        try {

            /*
             * REACTION
             */
            try {
                await sock.sendMessage(
                    chatId,
                    {
                        react: {
                            text: '🚀',
                            key: msg.key
                        }
                    }
                );
            } catch {}


            /*
             * DEPLOYMENT GUIDE
             */
            const text =

`┏━━❐ 🚀 ${botName} ❐
┃✦ DEPLOYMENT GUIDE
┗━━❐

┏━━❐ 📦 STEP 1 — REPOSITORY ❐
┃✦ Open the official repository
┃✦ Fork the repository to your
┃  own GitHub account
┃✦ After forking, use YOUR fork
┃  for deployment
┗━━❐

┏━━❐ 🔗 REPOSITORY ❐
┃✦ ${https://github.com/Xchristech2/GAAJU-MD-ULTRA}
┗━━❐

┏━━❐ 🔑 STEP 2 — SESSION ID ❐
┃✦ Open the Session ID website
┃✦ Pair your WhatsApp account
┃✦ Generate your Session ID
┃✦ Copy the complete Session ID
┃✦ Keep your Session ID private
┗━━❐

┏━━❐ 🔗 SESSION ID ❐
┃✦ ${https://gaaju-ultra-pair-ljtv.onrender.com}
┗━━❐

┏━━❐ ⚙️ STEP 3 — DEPLOY ❐
┃✦ Open your hosting panel
┃✦ Create a new service
┃✦ Connect your GitHub account
┃✦ Select your forked repository
┃✦ Select the correct branch
┃✦ Add the required environment
┃  variables
┃✦ Add your SESSION_ID
┃✦ Save your settings
┃✦ Start / Deploy the bot
┗━━❐

┏━━❐ 🎥 STEP 4 — VIDEO ❐
┃✦ Watch the complete tutorial
┃✦ Follow the steps shown in
┃  the video
┗━━❐

┏━━❐ 🔗 TUTORIAL ❐
┃✦ ${https://youtu.be/jHYSN3vUJec}
┗━━❐

┏━━❐ ⚠️ IMPORTANT ❐
┃✦ Never share your Session ID
┃✦ Use your own fork when deploying
┃✦ Make sure all required variables
┃  are correctly configured
┗━━❐

┏━━❐ ✦ INFORMATION ✦ ❐
┃✦ Command: ${p}deploy
┃✦ Aliases: ${p}howtodeploy
┃✦ ${botName}
┗━━❐`;

            await sock.sendMessage(
                chatId,
                {
                    text
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {

            console.error(
                '[DEPLOY COMMAND ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 🚀 DEPLOY ❐
┃✦ Status: ❌ Failed
┃✦ Reason: ${error?.message || error}
┗━━❐`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
