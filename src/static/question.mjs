import chalk from 'chalk';
import { parse } from 'node:url';

export default {
    BASE_URL: {
        text: `${chalk.red("[!required]")} Digite URL HTTP da blaze: [${chalk.cyan("https://blaze.com")}] `,
        validate: (value) => {
            const { protocol, hostname } = parse(value);

            if(hostname !== "blaze.com" || protocol != "https:")
                return false;

            return true;
        },
        _default: "https://blaze.com"
    },
    URL_BLAZE: {
        text: `${chalk.red("[!required]")} Digite URL WSS da blaze: [${chalk.cyan("wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket")}] `,
        validate: (value) => {
            const { protocol, hostname } = parse(value);

            if(hostname !== "api-v2.blaze.com" || protocol != "wss:")
                return false;

            return true;
        },
        _default: "wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket"
    },
    BOT_TOKEN: {
        text: `${chalk.red("[!required]")} Token do BOT TELEGRAM: [${chalk.cyan("00000000:ad4f6a77...")}] `,
        validate: (value) => value.split(/:/g).length === 2
    },
    ID_GROUP_MESSAGE: {
        text: `${chalk.red("[!required]")} ID GRUP/CHANNEL/CHAT que ira receber os sinais: [${chalk.cyan("-999999999")}] `,
        validate: (value) => value?.length > 0
    }
}