import readline, { question } from 'readline-sync';
import { isFunction } from './validations.mjs';

/**
 * @callback iCallbackValidation
 * @param {string} output
 * @return {void}
 */

/**
 * 
 * @typedef { object } iOptionsQuestionClass
 * @property { string } default
 * @property { iCallbackValidation } validation
 */

class Question {
    /**
     * 
     * @param {string} text 
     * @param {iOptionsQuestionClass} options 
     */

    static text(text, options){
        /**
         * @type { readline.BasicOptions }
         */
        const childerOptions = {};

        if(options?.default)
            childerOptions.defaultInput = options.default;

        const output = question(text, childerOptions);
        
        if(options?.validation && isFunction(options.validation)){
            if(!options.validation(output))
                return false;
        }

        return output;
    }
}

export { Question }