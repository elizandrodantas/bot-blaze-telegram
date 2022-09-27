import { _getColorNameOrEmoticon } from '../util/index.mjs';

/**
 * 
 * @param { import('../core/blaze.mjs').IDataBlazeResponse } current 
 */

export const StaticMessageEnterBet = (current) => {
    return "🔎 <b>SINAL ENCONTRADO:</b>\n" +
        `\nENTRE NO ${_getColorNameOrEmoticon(current.color, { emoticon: true })} ${_getColorNameOrEmoticon(current.color, { pt: true, upper: true })}` +
        `\nPROTEJA NO ${_getColorNameOrEmoticon(0, { emoticon: true })} ${_getColorNameOrEmoticon(0, { pt: true, upper: true })}` +
        `\n\n<pre>https://blaze.com/${process.env.REF ? "r/" + process.env.REF : ""}</pre>`;
}

/**
 * 
 * @param {import('../core/blaze.mjs').IDataBlazeResponse} current 
 * @param {import('../core/blaze.mjs').IDataBlazeResponse} betplayed 
 * @return {string} 
 */

export const StaticMessageWinAndLoss = (current, betplayed, recents) => {
    return `🔸 ENTRAMOS NO ${_getColorNameOrEmoticon(betplayed.color, { emoticon: true })}` +
        `\n🔹 RESULTADO FOI ${_getColorNameOrEmoticon(current.color, { emoticon: true })}`
}

/**
 * 
 * @param {import('../core/blaze.mjs').IDataBlazeResponse} current 
 * @param {import('../core/blaze.mjs').IDataBlazeResponse} betplayed 
 * @param {import('../middleware/bot.mjs').IGale} gale
 * @return {string} 
 */

export const StaticMessageGale = (current, betplayed, gale) => {
    return `⚠️ <b>ENTROU PRA GALE ${gale.sequence + 1}:</b>\n` +
    `\nENTRE NO ${_getColorNameOrEmoticon(betplayed.color, { emoticon: true })} ${_getColorNameOrEmoticon(betplayed.color, { pt: true, upper: true })}` +
    `\nPROTEJA NO ${_getColorNameOrEmoticon(0, { emoticon: true })} ${_getColorNameOrEmoticon(0, { pt: true, upper: true })}`;
}