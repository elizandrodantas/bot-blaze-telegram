import { Analise } from '../src/core/analise.mjs';
import { mock,recents, mockArr } from './asset/mockAnalise.mjs';

const controller = new Analise(recents);

console.log(
    controller.process(mock)
)