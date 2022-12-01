

/**
 * 
 * @typedef { object } IOptionsColorInfo
 * @property {boolean} upper
 * @property {boolean} pt
 * @property {boolean} emoticon
 * 
 */

import { random } from "./random.mjs";
import { isString } from "./validations.mjs";

/**
 * retorna informações de acordo com o numero da cor
 * - possiveis numeros: [0, 1, 2]
 * 
 * @param { 0 | 1 | 2 } color - numero da cor
 * @param { IOptionsColorInfo } option
 * @return { string }
 */

export function _getColorNameOrEmoticon(color, option){
    let x = { 0: { e: '⚪️', pt: 'branco', text: 'white' }, 1: { e: '🔴', pt: 'vermelho', text: 'red' }, 2: { e: '⚫', pt: 'preto', text: 'black' } }

    if(option.emoticon)
        return x[color]?.e;
    let text = option.pt ? x[color]?.pt : x[color]?.text;
    return option.upper ? text?.toUpperCase() : text;
}

/**
 * ### transforma o nome da cor, no seu determinado numero
 * 
 * @param {string} str 
 * @return {number}
 */

export function transformStringToNumberColor(str){
    if(["white", "branco", "brancos"].includes(str.toLowerCase())) return 0
    if(["red", "vermelho", "vermelhos"].includes(str.toLowerCase())) return 1
    if(["black", "preto", "pretos", "preta"].includes(str.toLowerCase())) return 2

    return 3;
}

/**
 * ### busca por a cor de acordo com numero da rodada
 * 
 * @param {number} roll - numero da rodada
 * @return {number}
 */

export function getColorWithRoll(roll){
    return roll > 0 && roll <= 7 ? 1 : roll > 7 && roll < 15 ? 2 : roll === 0 ? 0 : 3
}

/**
 * ### busca por o numero da rodada de forma randomica de acordo com a cor
 * 
 * @param {number | "white" | "black" | "red"} color - cor ou numero da cor
 * @return {number}
 */

export function getRollRandomWithColor(color){
    if(isString(color))
        color = transformStringToNumberColor(color);

    if(color < 0 || color > 14)
        return 15;

    return color === 0 ? 0 : color === 1 ? random(1, 7) : color === 2 ? random(8, 14) : 15;
}