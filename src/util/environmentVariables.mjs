
/**
 * seta uma novo variavel no process
 * 
 * @param {object | string} param0
 * @param {string?} param1
 */

export function setVariable(){
    let [ param0, param1 ] = arguments;

    if(typeof param0 === "string" && typeof param1 !== "undefined"){
        process.env[param0] = param1;
        return {[param0]: param1};
    }

    if(typeof param0 === "object"){
        if(Array.isArray(param0)){
            param0.forEach(val => { typeof val === "object" && Array.isArray(val) ? param0 = param0.flat() : false });

            let l = null, object = {};

            for(let indice of param0){
                if(!l){
                    l = indice;
                    object[l] = undefined;
                }else{
                    object[l] = indice;
                    l = null;
                }
            }

            Object.keys(object).forEach(val => {
                if(typeof param0[val] === "undefined")
                    delete param0[val];
                else
                    process.env[val] = object[val];
            });

            return object;
        }else{
            let keys = Object.keys(param0);

            keys.forEach(val => {
                if(typeof param0[val] === "undefined")
                    delete param0[val];
                else
                    process.env[val] = param0[val];
            });

            return param0;
        }
    }
    
    return null;
}