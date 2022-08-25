import 'dotenv/config';
import { BotBlazeWithTelegram } from '../src/middleware/bot.mjs';

console.log(`pid: ${process.pid}`)

let controller = new BotBlazeWithTelegram();

controller.run();

process.on('SIGINT', () => {
    controller.telegram.close();
    controller.socket.closeSocket();
    process.exit();
});  // CTRL + C
process.on('SIGQUIT', () => {}); // Keyboard quit
process.on('SIGTERM', () => {}); // kill