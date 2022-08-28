
/**
 *  determina se uma string começa com os caracteres especificados
 * 
 * @param {string} string
 * @param {string} search - Os caracteres a serem pesquisados no final da string.
 * @param {number} [position=] - Se fornecido, substitui o tamanho da string passada. Se omitido, o valor padrão é o tamanho da `search`. 
 * @param {boolean} [match=] - Se `true` ele vai procurar em qualquer posição da string. Default: `false`
 * 
 * #### Example:
 * 
 * ```javascript
 * const str1 = 'Saturday night plans';
 *
 * console.log(startsWith(str1, 'Sat'));
 * // expected output: true
 *
 * console.log(startsWith(str1, 'Sat', 3));
 * // expected output: false
 * ```
 * 
 * função modificada de {@link https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith}
 */

export function startWith(string, search, position, match = false){
    if(position > string.length) position = string.length;
    if(position < 0) position = search.length;

    let sub = String(string).substring(string.length - position, string.length);
    
    return match ? Boolean(sub.includes(search)) : Boolean(sub.indexOf(search) === 0);
}