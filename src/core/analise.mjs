
/**
 * 
 * @class
 * @classdesc
 * @author Elizandro Dantas
 * 
 * @see GitHub {@link https://github.com/elizandrodantas}
 */

export function Analise(){
    this.rule = [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14];
}

/**
 * 
 * @method last
 * @memberof Analise
 * @instance
 * @param {import("./blaze.mjs").IResponseRecents} recents 
 * @returns {{ status: "error" | "success", last: import("./blaze.mjs").IDataOfResponseRecents, verify: boolean }}
 * @api public
 */

Analise.prototype.last = function(recents){
    let { status, response } = recents;

    if(!status) return { status: 'error', message: 'error' }

    let lastNeed = response.slice(0, 16), lastAccept = lastNeed[lastNeed.length - 1];

    return {
        status: 'success',
        last: lastAccept,
        verify: this.verify(lastAccept)
    }
}

/**
 * 
 * @param {import("./blaze.mjs").IDataOfResponseRecents} last 
 * @returns {boolean}
 */

Analise.prototype.verify = function(last){
    let { roll } = last;

    return this.rule.includes(roll);
}