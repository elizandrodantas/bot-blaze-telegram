import { Analise, BlazeCore, Telegram } from '../core/index.mjs';
import chalk from 'chalk';
import { question } from 'readline-sync';
import { setVariable, isNumber, isString, random, isFunction, _getColorNameOrEmoticon } from '../util/index.mjs';
import { StaticMessageEnterBet, StaticMessageGale, StaticMessageWinAndLoss } from '../static/index.mjs';
import { Messages } from '../structure/index.mjs';

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
 * @property {boolean | IOptionsSummaryOfResult} summaryOfResult - resumo dos resultados diarios
 * @property {boolean | number} gale - sem entradas na gale, apenas win de primeira
 * @property {ICBCurrentAndRecents} messageEnterBet - mensagem de entrada em aposta
 * @property {ICBCurrentAndPlayed} messageWin - mensagem de win
 * @property {ICBCurrentAndPlayedAndGale} messageOfGale - mensagem de gale .:. se gale ativo
 * @property {ICBCurrentAndPlayed} messageLoss - mensagem de loss
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
 * opções de resumo
 * 
 * @typedef {object} IOptionsSummaryOfResult
 * @property {number} interval 
 * @property {ICBMessageSummaryOfResult} message
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
 * opções de sticker/figuras
 * 
 * @typedef {object} ISticker
 * @property {string} winWhite
 * <br>
 * - Obs.: nome da imagem dentro da pasta `sticker`
 * @property {string} win - figura do win sem gale
 * <br>
 * - Obs.: nome da imagem dentro da pasta `sticker`
 * @property {string} winGale - figura do win no *GALE*
 * <br>
 * - Obs.: nome da imagem dentro da pasta `sticker`
 * @property {string} loss
 * <br>
 * - Obs.: nome da imagem dentro da pasta `sticker`
 */

/**
 * status da jogada
 * 
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
 * key number in summary
 * 
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
 * key info in summary
 * 
 * @typedef {object} IInfoSummary
 * @property {string} date
 * @property {number} lastUpdate
 * @property {number} day
 */

/**
 * 
 * @typedef {object} IGale
 * @property {number} sequence
 * @property {string} phase
 */

/**
 * interface de função [1]
 * - current data
 * 
 * @interface T
 * @typedef { (currentPlay: import('../core/blaze.mjs').IDataBlazeResponse, cb?: (message) => void) => string } ICBCurrent
 */

/**
 * interface de função [2]
 * - current data
 * - betplayed data
 * 
 * @typedef { (currentPlay: import('../core/blaze.mjs').IDataBlazeResponse, betplayed: import('../core/blaze.mjs').IDataBlazeResponse, cb?: (message) => void) => string } ICBCurrentAndPlayed
 */

/**
 * interface de função [3]
 * - current data
 * - betplayed data
 * - recents data
 * 
 * @typedef { (currentPlay: import('../core/blaze.mjs').IDataBlazeResponse, recents: import('../core/blaze.mjs').IDataBlazeResponse[], cb?: (message) => void) => string } ICBCurrentAndRecents
 */

/**
 * interface de função [4]
 * - current data
 * - betplayed data
 * - gale sequence
 * 
 * @typedef { (currentPlay: import('../core/blaze.mjs').IDataBlazeResponse, betplayed: import('../core/blaze.mjs').IDataBlazeResponse, gale: IGale, cb?: (message) => void) => string } ICBCurrentAndPlayedAndGale
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

    /** @apí private */
    this.gale = {
        sequence: 0,
        phase: "pause"
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

    this.cb = (message) => this.telegram.send(message, process.env.ID_GROUP_MESSAGE); 

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
        console.log(chalk.cyan(`[${new Date().toLocaleString()}]`), chalk.yellow('status:'), 'round performed, result:', `[color: ${chalk.yellow(_getColorNameOrEmoticon(data.color, { pt: true }))} - roll: ${chalk.yellow(data.roll)}]`);
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

    let { verify, last, recents } = this.analise.last({status: true, response});

    if(verify){
        if(this.bet.color === null){
            this._updateBet('bet', true, last.color, last.roll, last.id);

            if(isFunction(this.options?.messageEnterBet))
                return this.telegram.send(new Messages(this.options.messageEnterBet(last, recents, this.cb)).message, process.env.ID_GROUP_MESSAGE);

            return this.telegram.send(new Messages(StaticMessageEnterBet(last, recents)).message, process.env.ID_GROUP_MESSAGE);
        }
    }else{ }
}

/**
 * ### trata e analisa resultado da jogada
 * 
 * @method invokeResult
 * @memberof BotBlazeWithTelegram
 * @instance
 * @param {import('../core/blaze.mjs').IDataBlazeResponse} data 
 * @returns {Promise<void>}
 * @api public
 */

BotBlazeWithTelegram.prototype.invokeResult = async function(data){
    let { color } = data;

    if(typeof color !== "undefined" && this.bet.color !== null){
        if(color === this.bet.color || color === 0){
            let sticker = this._getStickerOfOptions(color === 0 ? "white" : this.bet.phase),
                message;

            if(sticker)
                await this.telegram.sendSticker(sticker, process.env.ID_GROUP_MESSAGE);

            if(isFunction(this.options?.messageWin))
                message = new Messages(this.options.messageWin(data, this.bet, this.cb));
            else
                message = new Messages(StaticMessageWinAndLoss(data, this.bet));

            await this.telegram.send(message.message, process.env.ID_GROUP_MESSAGE);
            
            if(this.options.timeAfterWin){
                let { timeAfterWin } = this.options,
                    { message, time } = new Messages()._extractOfOption(timeAfterWin);

                this._timeNextBetSafe(time);
                if(isString(message))
                    await this.telegram.send(message, process.env.ID_GROUP_MESSAGE);
            }

            this._summary({ status: color === 0 ? "white" : this.bet.phase, send: { sequence: "add" }});
            this.options.timeAfterWin ? this._updateBet("safe", true, null, null, null) : this._resetBet();
        }else{
            let message;

            if(this.bet.phase === "bet"){
                if(!this.options?.gale){
                    this._updateBet("loss");
                    return this.invokeResult(data);
                }

                if(isFunction(this.options?.messageOfGale))
                    message = new Messages(this.options.messageOfGale(data, this.bet, this.gale, this.cb));
                else
                    message = new Messages(StaticMessageGale(data, this.bet, this.gale));
                
                await this.telegram.send(message.message, process.env.ID_GROUP_MESSAGE);
                this._gale({ sequence: "add" });
                this._updateBet("gale");
            }else if(this.bet.phase.indexOf('gale') === 0){   
                if(this.gale.sequence + 1 >= this.options.gale){
                    this._updateBet('loss');
                    return this.invokeResult(data);
                }
                
                if(isFunction(this.options?.messageOfGale))
                    message = new Messages(this.options.messageOfGale(data, this.bet, this.gale, this.cb));
                else
                    message = new Messages(StaticMessageGale(data, this.bet, this.gale));
                
                await this.telegram.send(message.message, process.env.ID_GROUP_MESSAGE);
                this._gale({ sequence: "add" });
            }else{
                let sticker = this._getStickerOfOptions('loss');

                if(sticker)
                    await this.telegram.sendSticker(sticker, process.env.ID_GROUP_MESSAGE);
                
                if(isFunction(this.options?.messageLoss))
                    message = new Messages(this.options.messageLoss(data, this.bet, this.cb));
                else
                    message = new Messages(StaticMessageWinAndLoss(data, this.bet));

                await this.telegram.send(message.message, process.env.ID_GROUP_MESSAGE);
                this._gale({ sequence: "reset" });
                this._summary({ status: "loss", send: { sequence: "add" }});    
                this.options.timeAfterLoss ? this._updateBet("safe", true, null, null, null) : this._resetBet();
            }
        }
    }
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
 * @param {"bet" | "gale" | "loss" |"safe"} phase 
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
            { loss, winGale, win, winWhite } = sticker;

        if(phase === "bet")
            return win;
        if(phase === "gale")
            return winGale;
        if(phase === "white")
            return winWhite;
        
        return loss;
    }

    return false;
}

/**
 * opções resetar resumo de jogadas
 * 
 * @typedef {object} IOptionsResetSummary
 * @property { boolean } onlyInfo
 * @property { boolean } onlyNumber
 */

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
 * opções do resumo de jogadas
 * 
 * @typedef {object} IDataOptionUpdateSummary
 * @property {IPhaseBet | "white" | "loss"} status
 * @property {IDataOptionUpdateSummarySend} send
 * @property {boolean} verifyDate
 */

/**
 * opção para alterar play do resumo
 * 
 * @typedef {object} IDataOptionUpdateSummarySend
 * @property {number} rule
 * @property {"add" | "reset"} sequence
 */

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

/**
 * 
 * @typedef {object} IOptionsUpdateGale
 * @property {"reset" | "add"} sequence
 */

/**
 * 
 * @param {IOptionsUpdateGale} options 
 */

BotBlazeWithTelegram.prototype._gale = function(options){
    if(options?.sequence){
        if(options.sequence === "add"){
            this.gale.sequence++;
            this.gale.phase = "gale " + this.gale.sequence;
        }
        if(options.sequence === "reset"){
            this.gale.sequence = 0;
            this.gale.phase = "off";
        }
    }
}