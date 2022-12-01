import { BlazeCore } from '../src/core/blaze.mjs';
import { it } from 'node:test';
import { deepEqual } from 'node:assert';

const controller = new BlazeCore();

it('should generate 40 previous rounds', () => {
    const generated = controller.generateRecents('016e142e5827689dbfcfcfdb6aff8ed0bfdb3ca6499013ef1e03fbddbffd6d82');
    deepEqual(generated.length, 41);
});
