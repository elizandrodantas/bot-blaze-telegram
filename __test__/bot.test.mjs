import 'dotenv/config';
import { BotBlazeWithTelegram } from '../src/index.mjs';
import { _getColorNameOrEmoticon } from '../src/util/index.mjs';

console.log(`pid: ${process.pid}`)

let controller = new BotBlazeWithTelegram({
    // timeAfterWin: {
    //     // message: "Tempo para analise apos win",
    //     time: 1
    // },
    sticker: {
        win: "win.jpg",
        winGale: "win-in-gale.jpg",
        winWhite: "win-white.jpg",
        loss: "loss.jpg",
    },
    // timeAfterLoss: {
    //     time: 1,
    //     message: "Tempo para analise apos loss"
    // },
    summaryOfResult: {
        interval: 1,
        message: (number) => {
            return `Total de jogadas: ${number.total}` +
                `\nWins seguidos: ${number.consecutive} ✅` +
                `\nTotal de win: ${number.win} ✅` +
                `\nTotal de loss: ${number.loss} ❌` +
                `\nTaxa de acertividade: ${(number.win / number.total * 100).toFixed(1)}%`
        }
    },
    messageEnterBet: (current, recents, cb) => {
        // cb('test callback');

        return "🔎 <b>SINAL ENCONTRADO:</b>\n" +
            `\nENTRE NO ${_getColorNameOrEmoticon(current.color, { emoticon: true })} ${_getColorNameOrEmoticon(current.color, { pt: true, upper: true })}` +
            `\nPROTEJA NO ${_getColorNameOrEmoticon(0, { emoticon: true })} ${_getColorNameOrEmoticon(0, { pt: true, upper: true })}` +
            `\n\n<pre>https://blaze.com/${process.env.REF ? "r/" + process.env.REF : ""}</pre>`;
    },
    gale: 1
 });

controller.run();
// controller.

process.on('SIGINT', () => {
    controller.telegram.close();
    controller.blaze.socket.closeSocket();
    process.exit();
});  // CTRL + C
process.on('SIGQUIT', () => {}); // Keyboard quit
process.on('SIGTERM', () => {}); // kill