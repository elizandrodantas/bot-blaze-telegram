import 'dotenv/config';
import { Telegram } from '../src/core/telegram.mjs';

let controller = new Telegram();

controller.start().then(() => {
    controller.client.use(async (ctx, next) => {
        let { type, id } = await ctx.getChat();

        console.log('ID:', id, 'Type:', type);

        return next();
    });
});