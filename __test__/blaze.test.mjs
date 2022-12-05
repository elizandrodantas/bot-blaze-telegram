import 'dotenv/config';
import { BlazeCore } from '../src/core/blaze.mjs';

let controller = new BlazeCore();

// let socket = controller.start();
// controller.recents().then(console.log)

/**
 * 
 * TEST BOT WITH ANALYSIS
 * 
 */

import { Analise } from '../src/core/analise.mjs';

controller.start();


controller.ev.on('game_complete', async function(data){
    const { response } = await controller.recents();
    const ofAnalysis = new Analise(response);
    console.log(response[0])
    const analysisResult = ofAnalysis.process({
        entryColor: "red",
        search: [
            {
                color: "black"
            },
            {
                color: "red"
            }
        ]
    });

    console.log(analysisResult)
});


controller.ev.on('game_graphing', function(data){
    data?.bets && (data.bets = null);

    console.log(data)
});
