// import 'dotenv/config';
import { BotBlazeWithTelegram } from '../src/index.mjs';

console.log(`pid: ${process.pid}`)

let controller = new BotBlazeWithTelegram({
    timeAfterWin: {
        pauseMessage: "analisando",
        timePaused: 3
    }
 });

controller.run();

// process.on('SIGINT', () => {
//     controller.telegram.close();
//     controller.socket.closeSocket();
//     process.exit();
// });  // CTRL + C
// process.on('SIGQUIT', () => {}); // Keyboard quit
// process.on('SIGTERM', () => {}); // kill