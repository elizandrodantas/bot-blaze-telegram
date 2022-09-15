
export function isString(string){
    return typeof string === "string";
}

export function isArray(array){
    return Array.isArray(array);
}

export function isObject(object){
    return typeof object === "object" && !Array.isArray(object);
}

export function isNumber(number){
    return typeof number === "number";
}

export function isBoolean(boolean){
    return typeof boolean === "boolean";
}

export function isFunction(fun){
    return typeof fun === "function";
}