'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'gaaju',

    aliases: ['owner'],

    description:
        'Show information about Chris Gaaju',

    category: 'owner',

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

        try {
            await sock.sendMessage(
                chatId,
                {
                    react: {
                        text: '👑',
                        key: msg.key
                    }
                }
            );
        } catch {}

        const text = `
# 👑 ABOUT ME — CHRIS GAAJU

Hello everyone! 👋🔥

My name is **Bethel**, also known as **Chris Gaaju**, the founder and developer behind **GAAJU-MD-ULTRA** and other projects. 🤖💻

I'm a **Bot Developer**, proudly supported by **Gaaju Tech** and approved by **Xchristech2**. I'm passionate about technology, WhatsApp bot development, coding, and building powerful tools for the community. 🚀

### 👤 PERSONAL INFORMATION

- **Name:** Bethel
- **Known As:** Chris Gaaju
- **Age:** 18+
- **Origin:** Port Harcourt, Nigeria 🇳🇬
- **State:** Imo State
- **Build:** Tall
- **Relationship:** Single boy 😎❤️
- **Occupation:** Bot Developer & Creator 👨‍💻

### 🤖 MY WORK

I am the developer and owner of **GAAJU-MD-ULTRA**, along with other projects and bot systems. My goal is to keep creating, improving, and bringing new technology to the community. 🔥

### 🎵 MY DREAM — BECOMING AN ARTIST

Beyond technology and bot development, I have another big dream in my heart — **becoming a successful music artist**. 🎤🔥

I'm praying to **God Almighty** to guide me, give me strength, wisdom, talent, and the opportunity to achieve my dreams. 🙏❤️

I believe that with **God, consistency, hard work, patience, and dedication**, my dream of becoming an artist will one day become reality. 🎶🚀

From **coding and building bots** to **making music and chasing my dreams**, I'm just getting started. One day, I hope people will know **Chris Gaaju** not only as a developer, but also as an artist. 🎤👑

**Founder:** Chris Gaaju  
**Supported by:** Gaaju Tech  
**Approved by:** Xchristech2

> 🙏 One dream. One journey. One day, I'll make it.

> ⚡ Powered by Chris Gaaju 🔥
`;

        try {
            await sock.sendMessage(
                chatId,
                {
                    text: text.trim()
                },
                {
                    quoted: msg
                }
            );
        } catch (error) {
            console.error(
                '[GAAJU COMMAND ERROR]',
                error
            );
        }
    }
};
