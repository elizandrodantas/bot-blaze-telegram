import 'dotenv/config';
import { BotBlazeWithTelegram } from '../src/index.mjs';

console.log(`pid: ${process.pid}`)

let controller = new BotBlazeWithTelegram({
    timeAfterWin: {
        pauseMessage: "analisando",
        timePaused: 3
    },
    sticker: {
        winNotGale: "win.jpg",
        winGaleOne: "win-in-gale.jpg",
        winGaleTwo: "win-in-gale.jpg",
        loss: "loss.jpg",
    },
    enterProtection: false
 });

controller.run();

process.on('SIGINT', () => {
    controller.telegram.close();
    controller.socket.closeSocket();
    process.exit();
});  // CTRL + C
process.on('SIGQUIT', () => {}); // Keyboard quit
process.on('SIGTERM', () => {}); // kill