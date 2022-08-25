import { Analise, BlazeCore, Telegram } from '../core/index.mjs';
import chalk from 'chalk';

const { ID_GROUP_MESSAGE, SAFE_AFTER_LOSS } = process.env;

/**
 * @class
 * @classdesc
 * @author Elizandro Dantas
 * 
 * @see GitHub {@link https://github.com/elizandrodantas}
 */

export function BotBlazeWithTelegram(){
    /** @api private */
    this.telegram = new Telegram();

    /** @api private */
    this.blaze = new BlazeCore();

    /** @api private */
    this.analise = new Analise();

    /**
     * @api private
     * @type {import('../core/blaze.mjs').IResponseStart}    */
    this.socket;

    this.bet = {
        phase: "pause",
        jump: null,
        color: null,
        roll: null,
        id: null
    }
}

/**
 * ### inicia o bot
 * 
 * @method run
 * @memberof BotBlazeWithTelegram
 * @instance
 * @returns {Promise<void>}
 * @api public
 */

BotBlazeWithTelegram.prototype.run = async function(){
    this.socket = this.blaze.start({ type: "doubles" });
    await this.telegram.start();

    this.socket.ev.on("game_waiting" , (data) => {
        console.log(chalk.cyan(`[${new Date().toLocaleString()}]`), chalk.yellow('status:'), 'players betting');
    });

    this.socket.ev.on("game_graphing", (data) => {
        console.log(chalk.cyan(`[${new Date().toLocaleString()}]`), chalk.yellow('status:'), 'round performed, result:', `[color: ${chalk.yellow(this._getColorNameOrEmoticon(data.color, false, true))} - roll: ${chalk.yellow(data.roll)}]`);

        Promise.resolve([ this.invokeResult(data) ]);
    });

    this.socket.ev.on('game_complete', (data) => {
        console.log(chalk.cyan(`[${new Date().toLocaleString()}]`), chalk.yellow('status:'), 'full round');

        Promise.resolve([ this.invokeAnalyst(data) ]);
    });
}

/**
 * ### analisa a possibilidade de entrar na jogada
 * 
 * @method invokeAnalyst
 * @memberof BotBlazeWithTelegram
 * @instance
 * @returns {Promise<void>}
 * @api public
 */

BotBlazeWithTelegram.prototype.invokeAnalyst = async function(){
    if(this.bet.jump) return { status: "jump" }

    let { status, response, error } = await this.blaze.recents();
    
    if(!status || !response) return { status: "error", message: error }

    let { verify, last } = this.analise.last({status: true, response});

    if(verify){
        if(this.bet.color === null){
            this._updateBet('bet', true, last.color, last.roll, last.id);
            await this.telegram.sendIn(last.color, ID_GROUP_MESSAGE, 0);
        }
    }else{ }
}

/**
 * ### trata e analisa resultado da jogada
 * 
 * @method invokeResult
 * @memberof BotBlazeWithTelegram
 * @instance
 * @param {import('../core/blaze.mjs').IDataOfResponseRecents} data 
 * @returns {Promise<void>}
 * @api public
 */

BotBlazeWithTelegram.prototype.invokeResult = async function(data){
    let { color } = data;

    if(typeof color !== "undefined" && this.bet.color !== null){
        if(color === this.bet.color || color === 0){
            let typeResult = this.bet.phase.match(/gale/g) && color !== 0 ?
                "gale" : 
                color === 0 ?
                "white" :
                "green";


            await this.telegram.sendResult(typeResult, ID_GROUP_MESSAGE, { colorBet: this.bet.color, colorLast: color }, true);
            this._resetBet();
        }else{
            if(this.bet.phase === "bet"){
                await this.telegram.sendIn(this.bet.color, ID_GROUP_MESSAGE, 0, "GALE 1");
                this._updateBet("gale-1");
            }else if(this.bet.phase === "gale-1"){
                await this.telegram.sendIn(this.bet.color, ID_GROUP_MESSAGE, 0, "GALE 2");
                this._updateBet("gale-2");
            }else{
                await this.telegram.sendResult("loss", ID_GROUP_MESSAGE, { colorBet: this.bet.color, colorLast: color}, true);
                
                if(SAFE_AFTER_LOSS){
                    this._updateBet("safe", true, null, null, null);
                    this._timeNextBetSafe(3);
                    await this.telegram.send(`⏱ ANALISANDO RESULTADOS`, ID_GROUP_MESSAGE);
                }else{
                    this._resetBet();
                }
            }
        }
    }
}

/**
 * 
 * @method _getColorNameOrEmoticon
 * @memberof BotBlazeWithTelegram
 * @interface
 * @param {0 | 1 | 2} color 
 * @param {boolean} emoticon 
 * @param {boolean} pt 
 * @returns {string}
 * @api private
 */

BotBlazeWithTelegram.prototype._getColorNameOrEmoticon = function(color, emoticon = false, pt = false){
    if(color === 0) return emoticon ? "⚪️" : pt ? "branco" : "white";
    if(color === 1) return emoticon ? "🔴" : pt ? "vermelho" : "red";
    if(color === 2) return emoticon ? "⚫" : pt ? "preto" : "black";

    return "";
}

/**
 * reseta a jogada
 * 
 * @method _resetBet
 * @memberof BotBlazeWithTelegram
 * @interface
 * @returns {void}
 * @api private
 */

BotBlazeWithTelegram.prototype._resetBet = function(){
    this.bet = {
        phase: "pause",
        jump: null,
        color: null,
        roll: null,
        id: null
    }
}

/**
 * atualiza dados da jogada
 * 
 * @param {"bet" | "gale-1" | "gale-2" | "safe"} phase 
 * @param {boolean} jump 
 * @param {number} color 
 * @param {number} roll 
 * @param {string} id 
 * @returns {void}
 */

BotBlazeWithTelegram.prototype._updateBet = function(phase, jump, color, roll, id){
    if(typeof phase !== "undefined") this.bet.phase = phase;
    if(typeof jump !== "undefined") this.bet.jump = jump;
    if(typeof color !== "undefined") this.bet.color = color;
    if(typeof roll !== "undefined") this.bet.roll = roll;
    if(typeof id !== "undefined") this.bet.id = id;
}

/**
 * tempo de segurança, apos loss, para analisar novos resultados
 * 
 * @method _timeNextBetSafe
 * @memberof BotBlazeWithTelegram
 * @instance
 * @param {number} minute - minutos de pause
 * @returns {void}
 * @api private
 */

BotBlazeWithTelegram.prototype._timeNextBetSafe = function(minute = Math.floor((Math.random() * 3) + 1)){
    setTimeout(() => {
        this._resetBet();
    }, 6e4 * minute);
}