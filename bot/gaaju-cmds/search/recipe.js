'use strict';

const { getBotName } = require('../../lib/botname');

async function mealSearch(query) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'ToosiiBot/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.meals || [];
}

async function imgBuf(url) {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } });
    if (!res.ok) throw new Error(`Image HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
}

function buildIngredients(meal) {
    const list = [];
    for (let i = 1; i <= 20; i++) {
        const ing  = meal[`strIngredient${i}`]?.trim();
        const meas = meal[`strMeasure${i}`]?.trim();
        if (ing) list.push(`${meas ? meas + ' ' : ''}${ing}`);
    }
    return list;
}

module.exports = [
    {
        name: 'recipe',
        aliases: ['recipes', 'meal', 'food', 'cook', 'howto cook'],
        description: 'Get a recipe for any dish — .recipe <dish name>',
        category: 'search',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const query  = args.join(' ').trim();
            try { await sock.sendMessage(chatId, { react: { text: '🍽️', key: msg.key } }); } catch {}

            if (!query) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  RECIPE 🍽️ 〕\n║\n║ ▸ *Usage*   : ${prefix}recipe <dish>\n║ ▸ *Example* : ${prefix}recipe jollof rice\n║ ▸ *Example* : ${prefix}recipe pasta\n║ ▸ Tip: ${prefix}mealsearch — browse by category\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            try {
                const meals = await mealSearch(query);
                if (!meals.length) throw new Error(`No recipe found for: ${query}`);

                const meal = meals[0];
                const ings  = buildIngredients(meal);
                const instructions = (meal.strInstructions || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
                const steps = instructions.split('\n').filter(Boolean).slice(0, 8);

                const ingText  = ings.slice(0, 12).map(i => `║   • ${i}`).join('\n');
                const stepText = steps.map((s, i) => `║ ${i + 1}. ${s.slice(0, 120)}`).join('\n');

                const caption = [
                    `╔═|〔  RECIPE 🍽️ 〕`,
                    `║`,
                    `║ ▸ *Dish*     : ${meal.strMeal}`,
                    `║ ▸ *Category* : ${meal.strCategory || 'N/A'}`,
                    `║ ▸ *Cuisine*  : ${meal.strArea || 'N/A'}`,
                    `║`,
                    `║ 🧂 *Ingredients (${ings.length}):*`,
                    ingText,
                    ings.length > 12 ? `║   + ${ings.length - 12} more…` : null,
                    `║`,
                    `║ 👨‍🍳 *Instructions:*`,
                    stepText,
                    steps.length < instructions.split('\n').filter(Boolean).length ? `║ ▸ [recipe continues — see full online]` : null,
                    meal.strSource ? `║\n║ 🔗 ${meal.strSource}` : null,
                    `║`,
                    `╚═|〔 ${name} 〕`,
                ].filter(Boolean).join('\n');

                if (meal.strMealThumb) {
                    try {
                        const buf = await imgBuf(meal.strMealThumb);
                        await sock.sendMessage(chatId, { image: buf, caption }, { quoted: msg });
                        return;
                    } catch {}
                }
                await sock.sendMessage(chatId, { text: caption }, { quoted: msg });

            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  RECIPE 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }
        }
    },

    {
        name: 'mealsearch',
        aliases: ['foodlist', 'meallist', 'browsemeals'],
        description: 'List meal results for a search term — .mealsearch <dish>',
        category: 'search',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const query  = args.join(' ').trim();
            try { await sock.sendMessage(chatId, { react: { text: '🔍', key: msg.key } }); } catch {}

            if (!query) return sock.sendMessage(chatId, {
                text: `╔═|〔  MEAL SEARCH 〕\n║\n║ ▸ *Usage* : ${prefix}mealsearch <dish>\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });

            try {
                const meals = await mealSearch(query);
                if (!meals.length) throw new Error(`No meals found for: ${query}`);

                const list = meals.slice(0, 8).map((m, i) =>
                    `║ ▸ [${i + 1}] *${m.strMeal}* — ${m.strCategory || 'N/A'} (${m.strArea || 'N/A'})`
                ).join('\n');

                await sock.sendMessage(chatId, {
                    text: `╔═|〔  MEAL SEARCH 🔍 〕\n║\n║ 🔍 *${query}* — ${meals.length} result${meals.length > 1 ? 's' : ''}\n║\n${list}\n║\n║ 💡 ${prefix}recipe <name> for full recipe\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });

            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  MEAL SEARCH 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }
        }
    }
];
