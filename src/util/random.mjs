import { isArray } from "./validations.mjs";

/**
 * random element in array
 * 
 * @template T
 * @param {T[]} array
 * @returns {T}
 */

export function randomArray(array){
    return isArray(array) ? array[random(array.length)] : null
}

/**
 * random number X max and optional Y to mininal
 * 
 * @param {number} max - max
 * @param {number?} min - minimal *OPTIONAL
 * @returns {number}
 */

export function random(max, min = 0){
    return Math.floor(Math.random() * (max - min) + min);
}