'use strict';

const axios = require('axios');
const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

const { uploadImage } =
    require('../../lib/uploadImage');

const { getBotName } =
    require('../../lib/botname');


/*
|--------------------------------------------------------------------------
| GET IMAGE / AVATAR
|--------------------------------------------------------------------------
*/

async function getQuotedOrOwnImageUrl(
    sock,
    message
) {
    /*
    |--------------------------------------------------------------------------
    | 1. QUOTED IMAGE
    |--------------------------------------------------------------------------
    */

    const quoted =
        message?.message
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


    /*
    |--------------------------------------------------------------------------
    | 2. IMAGE SENT WITH COMMAND
    |--------------------------------------------------------------------------
    */

    if (
        message?.message
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


    /*
    |--------------------------------------------------------------------------
    | 3. PROFILE PICTURE
    |--------------------------------------------------------------------------
    */

    const ctx =
        message?.message
            ?.extendedTextMessage
            ?.contextInfo;

    let targetJid;

    if (
        ctx?.mentionedJid &&
        ctx.mentionedJid.length
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
            message?.key?.participant ||
            message?.key?.remoteJid;
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
| SIMPLE MISC IMAGE
|--------------------------------------------------------------------------
*/

async function simpleAvatar(
    sock,
    msg,
    endpoint
) {
    const chatId =
        msg.key.remoteJid;

    const avatarUrl =
        await getQuotedOrOwnImageUrl(
            sock,
            msg
        );

    const url =
        `https://api.some-random-api.com/canvas/misc/${endpoint}?avatar=${encodeURIComponent(avatarUrl)}`;

    const response =
        await axios.get(
            url,
            {
                responseType:
                    'arraybuffer',
                timeout: 60000
            }
        );

    return sock.sendMessage(
        chatId,
        {
            image:
                Buffer.from(
                    response.data
                )
        },
        {
            quoted: msg
        }
    );
}


/*
|--------------------------------------------------------------------------
| OVERLAY IMAGE
|--------------------------------------------------------------------------
*/

async function overlayImage(
    sock,
    msg,
    endpoint
) {
    const chatId =
        msg.key.remoteJid;

    const avatarUrl =
        await getQuotedOrOwnImageUrl(
            sock,
            msg
        );

    const url =
        `https://api.some-random-api.com/canvas/overlay/${endpoint}?avatar=${encodeURIComponent(avatarUrl)}`;

    const response =
        await axios.get(
            url,
            {
                responseType:
                    'arraybuffer',
                timeout: 60000
            }
        );

    return sock.sendMessage(
        chatId,
        {
            image:
                Buffer.from(
                    response.data
                )
        },
        {
            quoted: msg
        }
    );
}


/*
|--------------------------------------------------------------------------
| COMMAND
|--------------------------------------------------------------------------
*/

module.exports = {

    name: 'misc',

    aliases: [
        'miscimage'
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

        const botName =
            getBotName();

        const p =
            prefix || '.';

        const sub =
            String(
                args?.[0] || ''
            )
                .toLowerCase()
                .trim();

        const rest =
            args?.slice(1) || [];


        /*
        |--------------------------------------------------------------------------
        | HELP
        |--------------------------------------------------------------------------
        */

        if (!sub) {

            return sock.sendMessage(
                chatId,
                {
                    text:
`╭━━━〔 🖼️ MISC IMAGE 〕━━━╮
┃
┃ ✦ ${p}misc heart
┃ ✦ ${p}misc horny
┃ ✦ ${p}misc circle
┃ ✦ ${p}misc lgbt
┃ ✦ ${p}misc lied
┃ ✦ ${p}misc lolice
┃ ✦ ${p}misc simpcard
┃ ✦ ${p}misc tonikawa
┃
┃ ✦ ${p}misc its-so-stupid
┃ ✦ ${p}misc namecard
┃ ✦ ${p}misc oogway
┃ ✦ ${p}misc oogway2
┃ ✦ ${p}misc tweet
┃ ✦ ${p}misc youtube-comment
┃
┃ ✦ ${p}misc comrade
┃ ✦ ${p}misc gay
┃ ✦ ${p}misc lesbian
┃ ✦ ${p}misc glass
┃ ✦ ${p}misc jail
┃ ✦ ${p}misc passed
┃ ✦ ${p}misc triggered
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`
                },
                {
                    quoted: msg
                }
            );
        }


        try {

            /*
            |--------------------------------------------------------------------------
            | SIMPLE EFFECTS
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
                return await simpleAvatar(
                    sock,
                    msg,
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
                    rest
                        .join(' ')
                        .trim();

                if (!dog) {

                    return sock.sendMessage(
                        chatId,
                        {
                            text:
`╭━━━〔 🐶 ITS SO STUPID 〕━━━╮
┃
┃ ❌ Enter a target name.
┃
┃ Example:
┃ ${p}misc its-so-stupid John
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                        },
                        {
                            quoted: msg
                        }
                    );
                }

                const avatarUrl =
                    await getQuotedOrOwnImageUrl(
                        sock,
                        msg
                    );

                const url =
                    `https://api.some-random-api.com/canvas/misc/its-so-stupid?dog=${encodeURIComponent(dog)}&avatar=${encodeURIComponent(avatarUrl)}`;

                const response =
                    await axios.get(
                        url,
                        {
                            responseType:
                                'arraybuffer',
                            timeout: 60000
                        }
                    );

                return sock.sendMessage(
                    chatId,
                    {
                        image:
                            Buffer.from(
                                response.data
                            )
                    },
                    {
                        quoted: msg
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
                            value =>
                                (
                                    value || ''
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
`╭━━━〔 🪪 NAME CARD 〕━━━╮
┃
┃ ❌ Missing information.
┃
┃ Usage:
┃ ${p}misc namecard username|birthday|description
┃
┃ Example:
┃ ${p}misc namecard Chris|26/03/2004|Bot Developer
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                        },
                        {
                            quoted: msg
                        }
                    );
                }

                const avatarUrl =
                    await getQuotedOrOwnImageUrl(
                        sock,
                        msg
                    );

                const params =
                    new URLSearchParams({
                        username,
                        birthday,
                        avatar: avatarUrl
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

                return sock.sendMessage(
                    chatId,
                    {
                        image:
                            Buffer.from(
                                response.data
                            )
                    },
                    {
                        quoted: msg
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
                    rest
                        .join(' ')
                        .trim();

                if (!quote) {

                    return sock.sendMessage(
                        chatId,
                        {
                            text:
`╭━━━〔 🐢 ${sub.toUpperCase()} 〕━━━╮
┃
┃ ❌ Enter a quote.
┃
┃ Example:
┃ ${p}misc ${sub} Never give up
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                        },
                        {
                            quoted: msg
                        }
                    );
                }

                const avatarUrl =
                    await getQuotedOrOwnImageUrl(
                        sock,
                        msg
                    );

                const url =
                    `https://api.some-random-api.com/canvas/misc/${sub}?quote=${encodeURIComponent(quote)}&avatar=${encodeURIComponent(avatarUrl)}`;

                const response =
                    await axios.get(
                        url,
                        {
                            responseType:
                                'arraybuffer',
                            timeout: 60000
                        }
                    );

                return sock.sendMessage(
                    chatId,
                    {
                        image:
                            Buffer.from(
                                response.data
                            )
                    },
                    {
                        quoted: msg
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
                            value =>
                                (
                                    value || ''
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
`╭━━━〔 🐦 TWEET 〕━━━╮
┃
┃ Usage:
┃ ${p}misc tweet name|username|comment|theme
┃
┃ Example:
┃ ${p}misc tweet Chris|@chris|Hello|dark
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                        },
                        {
                            quoted: msg
                        }
                    );
                }

                const avatarUrl =
                    await getQuotedOrOwnImageUrl(
                        sock,
                        msg
                    );

                const params =
                    new URLSearchParams({
                        displayname,
                        username,
                        comment,
                        avatar: avatarUrl
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

                return sock.sendMessage(
                    chatId,
                    {
                        image:
                            Buffer.from(
                                response.data
                            )
                    },
                    {
                        quoted: msg
                    }
                );
            }


            /*
            |--------------------------------------------------------------------------
            | YOUTUBE COMMENT
            |--------------------------------------------------------------------------
            */

            if (
                sub === 'youtube-comment' ||
                sub === 'ytcomment'
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
                            value =>
                                (
                                    value || ''
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
`╭━━━〔 ▶️ YOUTUBE COMMENT 〕━━━╮
┃
┃ Usage:
┃ ${p}misc youtube-comment username|comment
┃
┃ Example:
┃ ${p}misc youtube-comment Chris|Nice video!
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                        },
                        {
                            quoted: msg
                        }
                    );
                }

                const avatarUrl =
                    await getQuotedOrOwnImageUrl(
                        sock,
                        msg
                    );

                const params =
                    new URLSearchParams({
                        username,
                        comment,
                        avatar: avatarUrl
                    });

                const url =
                    `https://api.some-random-api.com/canvas/misc/youtube-comment?${params.toString()}`;

                const response =
                    await axios.get(
                        url,
                        {
                            responseType:
                                'arraybuffer',
                            timeout: 60000
                        }
                    );

                return sock.sendMessage(
                    chatId,
                    {
                        image:
                            Buffer.from(
                                response.data
                            )
                    },
                    {
                        quoted: msg
                    }
                );
            }


            /*
            |--------------------------------------------------------------------------
            | OVERLAYS
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

                return await overlayImage(
                    sock,
                    msg,
                    sub
                );
            }


            /*
            |--------------------------------------------------------------------------
            | UNKNOWN OPTION
            |--------------------------------------------------------------------------
            */

            return sock.sendMessage(
                chatId,
                {
                    text:
`╭━━━〔 🖼️ MISC IMAGE 〕━━━╮
┃
┃ ❌ Unknown option:
┃    ${sub}
┃
┃ Use:
┃ ${p}misc
┃
┃ to view all available
┃ image options.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`
                },
                {
                    quoted: msg
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
`╭━━━〔 🖼️ MISC IMAGE 〕━━━╮
┃
┃ ❌ Failed to generate image.
┃
┃ ⚠️ ${
    error?.message ||
    'Unknown error'
}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
