import 'dotenv/config';
import { BotBlazeWithTelegram } from '../src/index.mjs';
import { _getColorNameOrEmoticon } from '../src/util/index.mjs';

console.log(`pid: ${process.pid}`)

let controller = new BotBlazeWithTelegram({
    sticker: {
        win: "win.jpg",
        winGale: "win-in-gale.jpg",
        winWhite: "win-white.jpg",
        loss: "loss.jpg",
    },
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
        return "🔎 <b>SINAL ENCONTRADO:</b>\n" +
            `\nENTRE NO ${_getColorNameOrEmoticon(current.color, { emoticon: true })} ${_getColorNameOrEmoticon(current.color, { pt: true, upper: true })}` +
            `\nPROTEJA NO ${_getColorNameOrEmoticon(0, { emoticon: true })} ${_getColorNameOrEmoticon(0, { pt: true, upper: true })}` +
            `\n\n<pre>⚠️ EM DESENVOLVIMENTO ⚠️</pre>`;
    },
    gale: 2,
    analysis: [
        {
            entryColor: "white",
            search: [
                {
                    color: "white"
                }
            ]
        },
        {
            entryColor: "black",
            search: [
                { color: "red" },
                { color: "black" },
                { color: "red" },
                { color: "black" },
            ]
        },
        {
            entryColor: "red",
            search: [
                { color: "black" },
                { color: "red" },
                { color: "red" },
                { color: "black" },
            ]
        },
        {
            entryColor: "red",
            search: [
                { color: "red" },
                { color: "black" },
            ]
        }
    ]
 });

controller.run();

process.on('SIGINT', () => {
    controller.telegram.close();
    controller.blaze.socket.closeSocket();
    process.exit();
});  // CTRL + C
process.on('SIGQUIT', () => {}); // Keyboard quit
process.on('SIGTERM', () => {}); // kill