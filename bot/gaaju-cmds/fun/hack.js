'use strict';

const { getBotName } = require('../../lib/botname.js');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'hack',
    aliases: ['hacker', 'hackuser', 'hacktarget'],
    description: 'Animated fake hacking simulation for fun',
    category: 'fun',
    ownerOnly: false,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;

        const rawTarget = args.join(' ').trim() || 'Unknown Target';
        const target = rawTarget.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, 60);

        let botName = 'GAAJU-MD-ULTRA';

        try {
            botName = getBotName() || botName;
        } catch {}

        const send = (text) =>
            sock.sendMessage(chatId, { text }, { quoted: msg });

        const react = async (emoji) => {
            try {
                await sock.sendMessage(chatId, {
                    react: { text: emoji, key: msg.key }
                });
            } catch {}
        };

        const steps = [
            {
                progress: 5,
                title: 'Initializing simulation',
                details: [
                    'Loading visual interface...',
                    'Preparing simulated scan...',
                    `Target label: ${target}`
                ]
            },
            {
                progress: 20,
                title: 'Scanning interface',
                details: [
                    'Checking simulated network...',
                    'Analyzing demo security layers...',
                    'Simulation environment ready.'
                ]
            },
            {
                progress: 40,
                title: 'Running security diagnostics',
                details: [
                    'Testing sample encryption...',
                    'Reviewing mock access protocols...',
                    'Diagnostic sequence running...'
                ]
            },
            {
                progress: 60,
                title: 'Analyzing demo data',
                details: [
                    'Generating sample files...',
                    'Creating fictional system records...',
                    'Preparing simulation report...'
                ]
            },
            {
                progress: 75,
                title: 'Processing results',
                details: [
                    'Generating fictional device profile...',
                    'Preparing mock network report...',
                    'Finalizing demo output...'
                ]
            },
            {
                progress: 95,
                title: 'Completing simulation',
                details: [
                    'Finalizing visual effects...',
                    'Verifying demo output...',
                    'Preparing final report...'
                ]
            },
            {
                progress: 100,
                title: 'Simulation completed',
                details: [
                    'Demo sequence finished successfully.',
                    'No device was accessed.',
                    'No private information was collected.'
                ]
            }
        ];

        const renderStep = (step, index) => {
            const filled = Math.round(step.progress / 10);
            const bar = '▰'.repeat(filled) + '▱'.repeat(10 - filled);

            const details = step.details
                .map(line => `  • ${line}`)
                .join('\n');

            let output =
                `*${botName} | HACK SIMULATOR*\n\n` +
                `Target: ${target}\n` +
                `Stage: ${step.title}\n\n` +
                `${bar} ${step.progress}%\n\n` +
                `${details}`;

            if (index === steps.length - 1) {
                output +=
                    `\n\n*SIMULATION REPORT*\n\n` +
                    `Status: Complete\n` +
                    `Result: Demo only\n\n` +
                    `😂 *GOT YOU! THIS WAS A PRANK.*\n` +
                    `No hacking occurred. No messages, photos, passwords, ` +
                    `bank details, or location data were accessed.\n\n` +
                    `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`;
            }

            return output;
        };

        await react('💀');

        let simulationMessage;

        try {
            simulationMessage = await send(renderStep(steps[0], 0));
        } catch (error) {
            console.error('[HACK SIM] Initial message failed:', error);
            return;
        }

        const delays = [2000, 2500, 2500, 2500, 2000, 2500];

        for (let i = 1; i < steps.length; i++) {
            await sleep(delays[i - 1]);

            try {
                await sock.sendMessage(chatId, {
                    text: renderStep(steps[i], i),
                    edit: simulationMessage.key
                });
            } catch (error) {
                console.error('[HACK SIM] Message edit failed:', error);

                try {
                    await send(renderStep(steps[i], i));
                } catch (sendError) {
                    console.error('[HACK SIM] Fallback failed:', sendError);
                }

                break;
            }
        }
    }
};
