import 'dotenv/config';
import { Telegram } from '../src/core/telegram.mjs';

let controller = new Telegram();

controller.start().then(() => {
    // controller.sendSticker('win-in-gale.jpg', ['']).then(console.log)
});