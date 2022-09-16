import { Analise, BlazeCore, Telegram } from '../core/index.mjs';
import chalk from 'chalk';
import { question } from 'readline-sync';
import { setVariable, isNumber, isString, random, isFunction } from '../util/index.mjs';

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
 * @property {boolean | IOptionsSummaryOfResult} summaryOfResult - resumo dos resultados diarios
 * @property {boolean} noGale - sem entradas na gale, apenas win de primeira
 * 
 */

/**
 * opções detalhadas do tempo de pausa
 * 
 * @typedef {object} IOptionsTimePaused
 * @property {number} time - tempo que o bot ficara pausado (em minutos)
 * @property {string} message - mensagem que ira apresentar apos pausar
 */

/**
 * @typedef {object} INumberSummary
 * @property {number} win
 * @property {number} loss
 * @property {number} gale
 * @property {number} gale1
 * @property {number} gale2
 * @property {number} white
 * @property {number} consecutive
 * @property {number} total
 */

/**
 * @typedef {object} IInfoSummary
 * @property {string} date
 * @property {number} lastUpdate
 * @property {number} day
 */

/**
 * callback message summary of result
 * 
 * @callback ICBMessageSummaryOfResult
 * @param {INumberSummary} number
 * @param {IInfoSummary} info
 * @param {(message: string) => void} [cbSend]
 */

/**
 * @typedef {object} IOptionsSummaryOfResult
 * @property {number} interval 
 * @property {ICBMessageSummaryOfResult} message
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
 * @typedef {object} IOptionsResetSummary
 * @property { boolean } onlyInfo
 * @property { boolean } onlyNumber
 */

/**
 * @typedef {object} IDataOptionUpdateSummary
 * @property {IPhaseBet | "white" | "loss"} status
 * @property {IDataOptionUpdateSummarySend} send
 * @property {boolean} verifyDate
 */

/**
 * @typedef {object} IDataOptionUpdateSummarySend
 * @property {number} rule
 * @property {"add" | "reset"} sequence
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

    if(isString(options.refBlaze))
        setVariable('REF', options.refBlaze);
    else
        setVariable('REF', "dZONo");

    /** @api private */
    this.telegram = new Telegram();

    /** @api private */
    this.blaze = new BlazeCore();

    /** @api private */
    this.analise = new Analise();

    /** @api private */
    this.summaryPlays = {
        number: {
            win: 0,
            loss: 0,
            gale: 0,
            gale1: 0,
            gale2: 0,
            white: 0,
            consecutive: 0,
            total: 0
        },
        info: {
            date: new Date(),
            lastUpdate: new Date().getTime(),
            day: new Date().getDate()
        },
        send: {
            sequence: 0,
            rule: random(5, 2)
        }
    }

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

    if(Boolean(options?.summaryOfResult.interval))
        this._summary({ send: { rule: Number(options?.summaryOfResult.interval )}});
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
        this._summary({ verifyDate: true });
    });

    this.socket.ev.on("game_graphing", (data) => {
        console.log(chalk.cyan(`[${new Date().toLocaleString()}]`), chalk.yellow('status:'), 'round performed, result:', `[color: ${chalk.yellow(this._getColorNameOrEmoticon(data.color, false, true))} - roll: ${chalk.yellow(data.roll)}]`);
        this._summary({ verifyDate: true });

        Promise.resolve([ this.invokeResult(data) ]);
    });

    this.socket.ev.on('game_complete', (data) => {
        console.log(chalk.cyan(`[${new Date().toLocaleString()}]`), chalk.yellow('status:'), 'full round');
        this._summary({ verifyDate: true });

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
            
            if(this.options.timeAfterWin){
                let { timeAfterWin } = this.options,
                    time = isNumber(timeAfterWin) ?
                    timeAfterWin : (timeAfterWin.time && isNumber(timeAfterWin.time)) ?
                    timeAfterWin.time : 3,
                    message = isString(timeAfterWin) ?
                    timeAfterWin : (timeAfterWin.message && isString(timeAfterWin.message)) ?
                    timeAfterWin.message : false;
                    
                this._timeNextBetSafe(time);
                if(isString(message))
                    await this.telegram.send(message, process.env.ID_GROUP_MESSAGE);
            }

            this._summary({ status: color === 0 ? "white" : this.bet.phase, send: { sequence: "add" }});
            this.options.timeAfterWin ? this._updateBet("safe", true, null, null, null) : this._resetBet();
        }else{
            if(this.bet.phase === "bet"){
                if(this.options?.noGale){
                    this._updateBet("gale-2");
                    return this.invokeResult({ color });
                }

                await this.telegram.sendIn(this.bet.color, process.env.ID_GROUP_MESSAGE, Boolean(this.options.enterProtection) ? 0 : false, "GALE 1");
                this._updateBet("gale-1");
            }else if(this.bet.phase === "gale-1"){
                await this.telegram.sendIn(this.bet.color, process.env.ID_GROUP_MESSAGE, Boolean(this.options.enterProtection) ? 0 : false, "GALE 2");
                this._updateBet("gale-2");
            }else{
                let sticker = this._getStickerOfOptions('loss');

                await this.telegram.sendResult("loss", process.env.ID_GROUP_MESSAGE, { colorBet: this.bet.color, colorLast: color}, sticker);
                
                if(this.options.timeAfterLoss){
                    let { timeAfterLoss } = this.options,
                        time = isNumber(timeAfterLoss) ?
                        timeAfterLoss : (timeAfterLoss.time && isNumber(timeAfterLoss.time)) ?
                        timeAfterLoss.time : 3,
                        message = (timeAfterLoss.message && isString(timeAfterLoss.message)) ?
                        timeAfterLoss.message : false;
                
                    this._timeNextBetSafe(time);
                    if(isString(message))
                        await this.telegram.send(message, process.env.ID_GROUP_MESSAGE);
                }
                
                this._summary({ status: "loss", send: { sequence: "add" }});    
                this.options.timeAfterLoss ? this._updateBet("safe", true, null, null, null) : this._resetBet();
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
 * @api private
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
 * @memberof BotBlazeWithTelegram
 * @method _getStickerOfOptions
 * @instance
 * @param {IPhaseBet | "white"} phase
 * @returns {string}
 * @api private
 */

BotBlazeWithTelegram.prototype._getStickerOfOptions = function(phase){
    if(Boolean(this.options && this.options.sticker)){
        let { sticker } = this.options,
            { loss, winGaleOne, winGaleTwo, winNotGale, winWhite } = sticker;

        if(phase === "bet")
            return winNotGale
        if(phase === "gale-1")
            return winGaleOne
        if(phase === "gale-2")
            return winGaleTwo
        if(phase === "white")
            return winWhite
        
        return loss;
    }

    return false;
}

/**
 * 
 * @memberof BotBlazeWithTelegram
 * @member _resetSummary
 * @instance
 * @param {IOptionsResetSummary} options
 * @return {void}
 * @api private
 */

BotBlazeWithTelegram.prototype._resetSummary = function(options){
    if(options?.onlyInfo){
        this.summaryPlays.info = {
            date: new Date(),
            day: new Date().getDate(),
            lastUpdate: new Date().getTime()
        }
        return;
    }

    if(options?.onlyNumber){
        Object.keys(this.summaryPlays.number).forEach(val => {
            this.summaryPlays.number[val] = 0;
        });
        return;
    }

    this.summaryPlays.info = {
        date: new Date(),
        day: new Date().getDate(),
        lastUpdate: new Date().getTime()
    }

    Object.keys(this.summaryPlays.number).forEach(val => {
        this.summaryPlays.number[val] = 0;
    });
}

/**
 * 
 * @memberof BotBlazeWithTelegram
 * @method _summary
 * @instance
 * @param {IDataOptionUpdateSummary} data
 * @api private 
 */

BotBlazeWithTelegram.prototype._summary = function(data){
    if(data.verifyDate){
        if(new Date().getDate() !== this.summaryPlays.info.day)
            this._resetSummary();
    }
    
    if(data.send){
        if(isNumber(data.send.rule))
            this.summaryPlays.send.rule = data.send.rule

        if(data.send?.sequence === "add")
            this.summaryPlays.send.sequence++;
        if(data.send?.sequence === "reset")
            this.summaryPlays.send.sequence = 0;
    }

    if(data.status){
        this.summaryPlays.number.total++;

        if(data.status === "bet"){
            this.summaryPlays.number.win++;
            this.summaryPlays.number.consecutive++;
        }
    
        if(data.status.indexOf('gale') === 0){
            this.summaryPlays.number.win++;
            this.summaryPlays.number.gale++;
            this.summaryPlays.number.consecutive++;
            data.status === "gale-1" ? this.summaryPlays.number.gale1++ : this.summaryPlays.number.gale2++;
        }
    
        if(data.status === "white"){
            this.summaryPlays.number.win++;
            this.summaryPlays.number.consecutive++;
            this.summaryPlays.number.white++;
        }
    
        if(data.status === "loss"){
            this.summaryPlays.number.loss++;
            this.summaryPlays.number.consecutive = 0;
        }
    }

    if(this.options?.summaryOfResult && data.status){
        if(this.summaryPlays.send.sequence == this.summaryPlays.send.rule){
            if(isFunction(this.options.summaryOfResult.message)){
                let cbSendCustom = (message) => this.telegram.send(message, process.env.ID_GROUP_MESSAGE).then(),
                    sendMessage = this.options.summaryOfResult
                    .message(
                        this.summaryPlays.number,
                        this.summaryPlays.info,
                        cbSendCustom
                    )

                if(isString(sendMessage))
                    this.telegram.send(sendMessage, process.env.ID_GROUP_MESSAGE).then()
            }
        }
    }

    if(this.summaryPlays.send.sequence >= this.summaryPlays.send.rule)
        this._summary({ send: { sequence: "reset" }});
}