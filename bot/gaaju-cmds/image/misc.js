'use strict';

const axios = require('axios');
const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

const {
    uploadImage
} = require('../../lib/uploadImage');

const {
    getBotName
} = require('../../lib/botname');


/*
|--------------------------------------------------------------------------
| GET IMAGE / AVATAR
|--------------------------------------------------------------------------
*/

async function getQuotedOrOwnImageUrl(
    sock,
    message
) {

    // 1. Quoted image
    const quoted =
        message.message
            ?.extendedTextMessage
            ?.contextInfo
            ?.quotedMessage;

    if (quoted?.imageMessage) {

        const stream =
            await downloadContentFromMessage(
                quoted.imageMessage,
                'image'
            );

        const chunks = [];

        for await (
            const chunk of stream
        ) {
            chunks.push(chunk);
        }

        const buffer =
            Buffer.concat(chunks);

        return await uploadImage(
            buffer
        );
    }


    // 2. Image sent directly
    if (
        message.message
            ?.imageMessage
    ) {

        const stream =
            await downloadContentFromMessage(
                message.message.imageMessage,
                'image'
            );

        const chunks = [];

        for await (
            const chunk of stream
        ) {
            chunks.push(chunk);
        }

        const buffer =
            Buffer.concat(chunks);

        return await uploadImage(
            buffer
        );
    }


    // 3. Mentioned / replied user
    let targetJid;

    const ctx =
        message.message
            ?.extendedTextMessage
            ?.contextInfo;


    if (
        ctx?.mentionedJid &&
        ctx.mentionedJid.length > 0
    ) {

        targetJid =
            ctx.mentionedJid[0];

    } else if (
        ctx?.participant
    ) {

        targetJid =
            ctx.participant;

    } else {

        targetJid =
            message.key.participant ||
            message.key.remoteJid;
    }


    try {

        return await sock.profilePictureUrl(
            targetJid,
            'image'
        );

    } catch {

        return 'https://i.imgur.com/2wzGhpF.png';
    }
}


/*
|--------------------------------------------------------------------------
| SEND GENERATED IMAGE
|--------------------------------------------------------------------------
*/

async function sendCanvasImage(
    sock,
    chatId,
    message,
    endpoint,
    params = {}
) {

    const avatarUrl =
        await getQuotedOrOwnImageUrl(
            sock,
            message
        );


    const searchParams =
        new URLSearchParams({
            avatar: avatarUrl,
            ...params
        });


    const url =
        `https://api.some-random-api.com/canvas/misc/${endpoint}?${searchParams.toString()}`;


    const response =
        await axios.get(
            url,
            {
                responseType:
                    'arraybuffer',
                timeout: 60000
            }
        );


    await sock.sendMessage(
        chatId,
        {
            image:
                Buffer.from(
                    response.data
                )
        },
        {
            quoted: message
        }
    );
}


/*
|--------------------------------------------------------------------------
| HEART
|--------------------------------------------------------------------------
*/

async function handleHeart(
    sock,
    chatId,
    message
) {

    try {

        await sendCanvasImage(
            sock,
            chatId,
            message,
            'heart'
        );

    } catch (error) {

        console.error(
            'Error in misc heart:',
            error
        );

        await sock.sendMessage(
            chatId,
            {
                text:
                    '*❌ Failed to create heart image. Try again later.*'
            },
            {
                quoted: message
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| MISC COMMAND
|--------------------------------------------------------------------------
*/

async function miscCommand(
    sock,
    chatId,
    message,
    args,
    prefix = '.'
) {

    const sub =
        (
            args[0] || ''
        ).toLowerCase();

    const rest =
        args.slice(1);


    /*
    |--------------------------------------------------------------------------
    | HELP
    |--------------------------------------------------------------------------
    */

    if (!sub) {

        const botName =
            getBotName();

        return sock.sendMessage(
            chatId,
            {
                text:
`╭━━━〔 🖼️ MISC IMAGE 〕━━━╮
┃
┃ ✦ ${prefix}misc heart
┃ ✦ ${prefix}misc horny
┃ ✦ ${prefix}misc circle
┃ ✦ ${prefix}misc lgbt
┃ ✦ ${prefix}misc lied
┃ ✦ ${prefix}misc lolice
┃ ✦ ${prefix}misc simpcard
┃ ✦ ${prefix}misc tonikawa
┃
┃ ✦ ${prefix}misc its-so-stupid
┃ ✦ ${prefix}misc namecard
┃ ✦ ${prefix}misc oogway
┃ ✦ ${prefix}misc oogway2
┃ ✦ ${prefix}misc tweet
┃ ✦ ${prefix}misc youtube-comment
┃
┃ ✦ ${prefix}misc comrade
┃ ✦ ${prefix}misc gay
┃ ✦ ${prefix}misc lesbian
┃ ✦ ${prefix}misc glass
┃ ✦ ${prefix}misc jail
┃ ✦ ${prefix}misc passed
┃ ✦ ${prefix}misc triggered
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`
            },
            {
                quoted: message
            }
        );
    }


    try {

        /*
        |--------------------------------------------------------------------------
        | SIMPLE AVATAR EFFECTS
        |--------------------------------------------------------------------------
        */

        const simpleEffects = [
            'heart',
            'horny',
            'circle',
            'lgbt',
            'lied',
            'lolice',
            'simpcard',
            'tonikawa'
        ];


        if (
            simpleEffects.includes(sub)
        ) {

            return await sendCanvasImage(
                sock,
                chatId,
                message,
                sub
            );
        }


        /*
        |--------------------------------------------------------------------------
        | ITS SO STUPID
        |--------------------------------------------------------------------------
        */

        if (
            sub === 'its-so-stupid'
        ) {

            const dog =
                rest.join(' ').trim();


            if (!dog) {

                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `*Usage: ${prefix}misc its-so-stupid <target name>*`
                    },
                    {
                        quoted: message
                    }
                );
            }


            return await sendCanvasImage(
                sock,
                chatId,
                message,
                'its-so-stupid',
                {
                    dog
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | NAMECARD
        |--------------------------------------------------------------------------
        */

        if (
            sub === 'namecard'
        ) {

            const joined =
                rest.join(' ');


            const [
                username,
                birthday,
                description
            ] =
                joined
                    .split('|')
                    .map(
                        s =>
                            (
                                s || ''
                            ).trim()
                    );


            if (
                !username ||
                !birthday
            ) {

                return sock.sendMessage(
                    chatId,
                    {
                        text:
`*Usage: ${prefix}misc namecard username|birthday|description*

Example:
${prefix}misc namecard wallyjaytech|26/03/2004|tech guy`
                    },
                    {
                        quoted: message
                    }
                );
            }


            const avatarUrl =
                await getQuotedOrOwnImageUrl(
                    sock,
                    message
                );


            const params =
                new URLSearchParams({
                    username,
                    birthday,
                    avatar:
                        avatarUrl
                });


            if (description) {

                params.append(
                    'description',
                    description
                );
            }


            const url =
                `https://api.some-random-api.com/canvas/misc/namecard?${params.toString()}`;


            const response =
                await axios.get(
                    url,
                    {
                        responseType:
                            'arraybuffer',
                        timeout: 60000
                    }
                );


            return await sock.sendMessage(
                chatId,
                {
                    image:
                        Buffer.from(
                            response.data
                        )
                },
                {
                    quoted: message
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | OOGWAY
        |--------------------------------------------------------------------------
        */

        if (
            sub === 'oogway' ||
            sub === 'oogway2'
        ) {

            const quote =
                rest.join(' ').trim();


            if (!quote) {

                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `*Usage: ${prefix}misc ${sub} <give quote>*`
                    },
                    {
                        quoted: message
                    }
                );
            }


            return await sendCanvasImage(
                sock,
                chatId,
                message,
                sub,
                {
                    quote
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | TWEET
        |--------------------------------------------------------------------------
        */

        if (
            sub === 'tweet'
        ) {

            const joined =
                rest.join(' ');


            const [
                displayname,
                username,
                comment,
                theme
            ] =
                joined
                    .split('|')
                    .map(
                        s =>
                            (
                                s || ''
                            ).trim()
                    );


            if (
                !displayname ||
                !username ||
                !comment
            ) {

                return sock.sendMessage(
                    chatId,
                    {
                        text:
`*Usage: ${prefix}misc tweet displayname|username|comment|theme*

Example:
${prefix}misc tweet Chris|chrisgaaju|Hello world|dark`
                    },
                    {
                        quoted: message
                    }
                );
            }


            const avatarUrl =
                await getQuotedOrOwnImageUrl(
                    sock,
                    message
                );


            const params =
                new URLSearchParams({
                    displayname,
                    username,
                    comment,
                    avatar:
                        avatarUrl
                });


            if (theme) {

                params.append(
                    'theme',
                    theme
                );
            }


            const url =
                `https://api.some-random-api.com/canvas/misc/tweet?${params.toString()}`;


            const response =
                await axios.get(
                    url,
                    {
                        responseType:
                            'arraybuffer',
                        timeout: 60000
                    }
                );


            return await sock.sendMessage(
                chatId,
                {
                    image:
                        Buffer.from(
                            response.data
                        )
                },
                {
                    quoted: message
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | YOUTUBE COMMENT
        |--------------------------------------------------------------------------
        */

        if (
            sub === 'youtube-comment'
        ) {

            const joined =
                rest.join(' ');


            const [
                username,
                comment
            ] =
                joined
                    .split('|')
                    .map(
                        s =>
                            (
                                s || ''
                            ).trim()
                    );


            if (
                !username ||
                !comment
            ) {

                return sock.sendMessage(
                    chatId,
                    {
                        text:
`*Usage: ${prefix}misc youtube-comment username|comment*

Example:
${prefix}misc youtube-comment Chris|Nice video`
                    },
                    {
                        quoted: message
                    }
                );
            }


            return await sendCanvasImage(
                sock,
                chatId,
                message,
                'youtube-comment',
                {
                    username,
                    comment
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | OVERLAY EFFECTS
        |--------------------------------------------------------------------------
        */

        const overlays = [
            'comrade',
            'gay',
            'lesbian',
            'glass',
            'jail',
            'passed',
            'triggered'
        ];


        if (
            overlays.includes(sub)
        ) {

            const avatarUrl =
                await getQuotedOrOwnImageUrl(
                    sock,
                    message
                );


            const url =
                `https://api.some-random-api.com/canvas/overlay/${sub}?avatar=${encodeURIComponent(avatarUrl)}`;


            const response =
                await axios.get(
                    url,
                    {
                        responseType:
                            'arraybuffer',
                        timeout: 60000
                    }
                );


            return await sock.sendMessage(
                chatId,
                {
                    image:
                        Buffer.from(
                            response.data
                        )
                },
                {
                    quoted: message
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | UNKNOWN SUBCOMMAND
        |--------------------------------------------------------------------------
        */

        return sock.sendMessage(
            chatId,
            {
                text:
`❌ Unknown misc command.

Use:
${prefix}misc`
            },
            {
                quoted: message
            }
        );


    } catch (error) {

        console.error(
            '[MISC ERROR]',
            error
        );


        return sock.sendMessage(
            chatId,
            {
                text:
                    '❌ Failed to generate image. Check your parameters and try again.'
            },
            {
                quoted: message
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| NORMAL BOT COMMAND EXPORT
|--------------------------------------------------------------------------
|
| THIS IS THE IMPORTANT PART.
|
*/

module.exports = {

    name: 'misc',

    aliases: [
        'canvas',
        'meme'
    ],

    description:
        'Generate miscellaneous image effects',

    category: 'image',

    async execute(
        sock,
        msg,
        args,
        prefix
    ) {

        const chatId =
            msg.key.remoteJid;


        return miscCommand(
            sock,
            chatId,
            msg,
            args,
            prefix
        );
    }
};
