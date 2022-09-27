

/**
 * 
 * @typedef { object } IOptionsColorInfo
 * @property {boolean} upper
 * @property {boolean} pt
 * @property {boolean} emoticon
 * 
 */

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