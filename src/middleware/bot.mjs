import { Analise, BlazeCore, Telegram } from '../core/index.mjs';
import chalk from 'chalk';
import { question } from 'readline-sync';
import { setVariable } from '../util/index.mjs';

const { 
    ID_GROUP_MESSAGE,
    URL_BLAZE,
    BASE_URL,
    BOT_TOKEN
} = process.env;

/**
 * opções de uso do bot
 * 
 * @typedef {object} IConstructorClassDad
 * @property {boolean | IOptionsTimePaused} timeAfterWin - pausar apos uma vitoria
 * @property {boolean | IOptionsTimePaused} timeAfterLoss - pausar apos uma perca
 * @property {string} refBlaze - referencia de link do site da blaze
 * @property {ISticker} sticker - figurinhas/imagens enviadas no resultado
 * @property {boolean} enterProtection - enviar entrada na proteção
 */

/**
 * opções detalhadas do tempo de pausa
 * 
 * @typedef {object} IOptionsTimePaused
 * @property {number} timePaused - tempo que o bot ficara pausado (em minutos)
 * @property {string} pauseMessage - mensagem que ira apresentar apos pausar
 */

/**
 * @typedef {object} ISticker
 * @property {string} winWhite
 * <br>
 * - Obs.: Campo aceita uma `URL` ou nome da imagem dentro da pasta `sticker`
 * @property {string} winNotGale - figura do win sem gale
 * <br>
 * - Obs.: Campo aceita uma `URL` ou nome da imagem dentro da pasta `sticker`
 * @property {string} winGaleOne - figura do win no *GALE 1*
 * <br>
 * - Obs.: Campo aceita uma `URL` ou nome da imagem dentro da pasta `sticker`
 * @property {string} winGaleTwo - figura do win no *GALE 2*
 * <br>
 * - Obs.: Campo aceita uma `URL` ou nome da imagem dentro da pasta `sticker`
 * @property {string} loss
 * <br>
 * - Obs.: Campo aceita uma `URL` ou nome da imagem dentro da pasta `sticker`
 */

/**
 * @typedef {"pause" | "bet" | "gale-1" | "gale-2" | "safe"} IPhaseBet
 */

/**
 * @typedef {object} ITypeBet
 * @property {IPhaseBet} phase
 * @property {number} color
 * @property {number} roll
 * @property {boolean} jump
 * @property {string} id
 */

/**
 * @class
 * @classdesc
 * @author Elizandro Dantas
 * @param {IConstructorClassDad} options
 * 
 * @see GitHub {@link https://github.com/elizandrodantas}
 */

export function BotBlazeWithTelegram(options){
    if(!URL_BLAZE){
        let VALUE = question(`${chalk.red("[!required]")} Digite URL WSS da blaze: [${chalk.cyan("wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket")}] `, {
            defaultInput: "wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket",
            validate: (value) => value.indexOf("wss://") && value.match(/blaze.com/g)
        });

        setVariable('URL_BLAZE', VALUE);
    }
        

    if(!BASE_URL){
        let VALUE = question(`${chalk.red("[!required]")} Digite URL HTTP da blaze: [${chalk.cyan("https://blaze.com")}] `, {
            defaultInput: "https://blaze.com",
            validate: (value) => value.indexOf("https://") && value.match(/blaze.com/g)
        });

        setVariable('BASE_URL', VALUE);
    }

    if(!BOT_TOKEN){
        let VALUE = question(`${chalk.red("[!required]")} Token do BOT TELEGRAM: [${chalk.cyan("00000000:ad4f6a77...")}] `, {
            validate: (value) => value.split(/:/g).length === 2
        });

        setVariable('BOT_TOKEN', VALUE);
    }
        

    if(!ID_GROUP_MESSAGE){
        let VALUE = question(`${chalk.red("[!required]")} ID GRUP/CHANNEL/CHAT que ira receber os sinais: [${chalk.cyan("-999999999")}] `, {
            validate: (value) => value
        });

        setVariable('ID_GROUP_MESSAGE', VALUE);
    }

    if(Boolean(typeof options.refBlaze === "string"))
        setVariable('REF', options.refBlaze);
    else
        setVariable('REF', "dZONo");

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

    /**
     * @api private
     * @type {IConstructorClassDad} 
    */
    this.options = options;

    /** @type {ITypeBet} */
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
            await this.telegram.sendIn(last.color, process.env.ID_GROUP_MESSAGE, Boolean(this.options.enterProtection) ? 0 : false);
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
                    "green",
                sticker = this._getStickerOfOptions(color === 0 ? "white" : this.bet.phase);

            await this.telegram.sendResult(typeResult, process.env.ID_GROUP_MESSAGE, { colorBet: this.bet.color, colorLast: color }, sticker);
            
            if(Boolean(this.options && this.options.timeAfterWin)){
                let { timeAfterWin } = this.options,
                    time = typeof timeAfterWin?.timePaused === "number" ?
                    Number(timeAfterWin?.timePaused) : 3,
                    message = timeAfterWin?.pauseMessage ?
                    String(timeAfterWin?.pauseMessage) : false;

                this._updateBet("safe", true, null, null, null);
                this._timeNextBetSafe(time);
                if(typeof message === "string")
                    await this.telegram.send(message, process.env.ID_GROUP_MESSAGE);
            }else{
                this._resetBet();
            }
        }else{
            if(this.bet.phase === "bet"){
                await this.telegram.sendIn(this.bet.color, process.env.ID_GROUP_MESSAGE, Boolean(this.options.enterProtection) ? 0 : false, "GALE 1");
                this._updateBet("gale-1");
            }else if(this.bet.phase === "gale-1"){
                await this.telegram.sendIn(this.bet.color, process.env.ID_GROUP_MESSAGE, Boolean(this.options.enterProtection) ? 0 : false, "GALE 2");
                this._updateBet("gale-2");
            }else{
                let sticker = this._getStickerOfOptions('loss');

                await this.telegram.sendResult("loss", process.env.ID_GROUP_MESSAGE, { colorBet: this.bet.color, colorLast: color}, sticker);
                
                if(Boolean(this.options && this.options.timeAfterLoss)){
                    let { timeAfterLoss } = this.options,
                        time = typeof timeAfterLoss?.timePaused === "number" ?
                        Number(timeAfterLoss.timePaused) : 3,
                        message = timeAfterLoss?.pauseMessage ?
                        String(timeAfterLoss?.pauseMessage) : false;
                
                    this._updateBet("safe", true, null, null, null);
                    this._timeNextBetSafe(time);
                    if(typeof message === "string")
                        await this.telegram.send(message, process.env.ID_GROUP_MESSAGE);
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

/**
 * 
 * @param {IPhaseBet | "white"} phase 
 */

BotBlazeWithTelegram.prototype._getStickerOfOptions = function(phase){
    if(Boolean(this.options && this.options.sticker)){
        let { sticker } = this.options,
            { loss, winGaleOne, winGaleTwo, winNotGale } = sticker;

        if(phase === "bet")
            return winNotGale
        if(phase === "gale-1")
            return winGaleOne
        if(phase === "gale-2")
            return winGaleTwo
        if(phase === "white")
            return winGaleTwo
        
        return loss;
    }

    return false;
}