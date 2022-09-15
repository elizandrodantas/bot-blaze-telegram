import 'dotenv/config';
import { BotBlazeWithTelegram } from '../src/index.mjs';

console.log(`pid: ${process.pid}`)

let controller = new BotBlazeWithTelegram({
    // timeAfterWin: {
    //     message: "Tempo para analise apos loss",
    //     time: 5
    // },
    sticker: {
        winNotGale: "win.jpg",
        winGaleOne: "win-in-gale.jpg",
        winGaleTwo: "win-in-gale.jpg",
        winWhite: "win-white.jpg",
        loss: "loss.jpg",
    },
    enterProtection: true,
    // timeAfterLoss: {
    //     time: 5,
    //     message: "Tempo para analise apos loss"
    // },
    summaryOfResult: {
        interval: 1,
        message: (number) => {
            return `Total de jogadas: ${number.total}\nWins seguidos: ${number.consecutive} ✅\nTotal de win: ${number.win} ✅\nTotal de loss: ${number.loss} ❌\nTaxa de acertividade: ${(number.win / number.total * 100).toFixed(1)}%`
        }
    },
    // noGale: true
 });

controller.run();
// controller.

process.on('SIGINT', () => {
    controller.telegram.close();
    controller.socket.closeSocket();
    process.exit();
});  // CTRL + C
process.on('SIGQUIT', () => {}); // Keyboard quit
process.on('SIGTERM', () => {}); // kill