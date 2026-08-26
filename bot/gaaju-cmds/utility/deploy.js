'use strict';

const { getBotName } = require('../../lib/botname');

/*
|--------------------------------------------------------------------------
| 🚀 GAAJU-MD ULTRA DEPLOYMENT LINKS
|--------------------------------------------------------------------------
|
| You can change these 3 links whenever you want.
|
*/

const REPO_URL =
    'https://github.com/Xchristech2/GAAJU-MD-ULTRA';

const SESSION_URL =
    'https://gaaju-ultra-pair-ljtv.onrender.com';

const TUTORIAL_URL =
    'https://youtu.be/jHYSN3vUJec';


/*
|--------------------------------------------------------------------------
| 🚀 DEPLOY COMMAND
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

        /*
        |--------------------------------------------------------------------------
        | REACTION
        |--------------------------------------------------------------------------
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
        |--------------------------------------------------------------------------
        | DEPLOYMENT GUIDE
        |--------------------------------------------------------------------------
        */

        const text =
`┏━━❐ 🚀 ${botName} ❐
┃✦ DEPLOYMENT GUIDE
┗━━❐

┏━━❐ 📦 STEP 1 — FORK REPOSITORY ❐
┃✦ Open the GAAJU-MD ULTRA repo
┃✦ Login to your GitHub account
┃✦ Tap the Fork button
┃✦ Choose your GitHub account
┃✦ Wait for the fork to finish
┃✦ Use your own fork for deployment
┗━━❐

┏━━❐ 🔗 REPOSITORY ❐
┃✦ ${REPO_URL}
┗━━❐

┏━━❐ 🔑 STEP 2 — GET SESSION ID ❐
┃✦ Open the Session ID website
┃✦ Enter your WhatsApp number
┃✦ Pair your WhatsApp account
┃✦ Generate your Session ID
┃✦ Copy the complete Session ID
┃✦ Keep your Session ID PRIVATE
┗━━❐

┏━━❐ 🔗 SESSION ID ❐
┃✦ ${SESSION_URL}
┗━━❐

┏━━❐ ⚙️ STEP 3 — DEPLOY BOT ❐
┃✦ Open your hosting panel
┃✦ Create a new service
┃✦ Connect your GitHub account
┃✦ Select your forked repository
┃✦ Select the main branch
┃✦ Add the required environment
┃  variables
┃✦ Add your SESSION_ID
┃✦ Save the settings
┃✦ Start / Deploy the bot
┗━━❐

┏━━❐ 🎥 STEP 4 — VIDEO TUTORIAL ❐
┃✦ Watch the deployment tutorial
┃✦ Follow each step in the video
┃✦ Make sure your Session ID
┃  is correctly configured
┗━━❐

┏━━❐ 🔗 TUTORIAL ❐
┃✦ ${TUTORIAL_URL}
┗━━❐

┏━━❐ ⚠️ IMPORTANT ❐
┃✦ Never share your Session ID
┃✦ Never post your Session ID publicly
┃✦ Deploy from your own fork
┃✦ Use the main branch
┃✦ Make sure your environment
┃  variables are correct
┗━━❐

┏━━❐ ✦ COMMAND INFORMATION ✦ ❐
┃✦ ${p}deploy
┃✦ ${p}howtodeploy
┃✦ ${p}deployment
┃✦ ${p}deployguide
┗━━❐

┏━━❐ ✦ ${botName} ✦ ❐
┃✦ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
┗━━❐`;


        /*
        |--------------------------------------------------------------------------
        | SEND MESSAGE
        |--------------------------------------------------------------------------
        */

        try {

            await sock.sendMessage(
                chatId,
                {
                    text: text
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

            try {

                await sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ 🚀 DEPLOY ❐
┃✦ Status : ❌ Failed
┃✦ Reason : ${error?.message || error}
┗━━❐`
                    },
                    {
                        quoted: msg
                    }
                );

            } catch {}

        }
    }
};
