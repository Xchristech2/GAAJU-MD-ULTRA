'use strict';
  module.exports = {
      name: 'imagine', aliases: ['draw','paint','aiart','aiimage','generate'],
      description: 'Generate an AI image from a text prompt',
      category: 'ai',
      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;
          if (!args.length)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  AI IMAGE 〕\n║\n║ ▸ Usage: ${prefix}imagine <prompt>\n║ ▸ Example: ${prefix}imagine lion at sunset\n║\n╚═╝`
              }, { quoted: msg });

          const prompt = args.join(' ');
          const encoded = encodeURIComponent(prompt);
          const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&enhance=true`;

          await sock.sendMessage(chatId, {
              text: `╔═|〔  AI IMAGE 〕\n║\n║ ▸ Generating: "${prompt}"\n║ ▸ Please wait…\n║\n╚═╝`
          }, { quoted: msg });

          try {
              const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const buf = Buffer.from(await res.arrayBuffer());
              await sock.sendMessage(chatId, {
                  image: buf,
                  caption: `╔═|〔  AI IMAGE 〕\n║\n║ ▸ *Prompt* : ${prompt}\n║\n╚═╝`
              }, { quoted: msg });
          } catch (e) {
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  AI IMAGE 〕\n║\n║ ▸ ❌ Failed to generate image\n║ ▸ Try a simpler prompt\n║\n╚═╝`
              }, { quoted: msg });
          }
      }
  };