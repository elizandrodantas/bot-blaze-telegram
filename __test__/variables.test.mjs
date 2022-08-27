import { setVariable } from '../src/util/environmentVariables.mjs';

//test with string
console.log(
    setVariable("key", "valueWithString"),
    process.env
);

// test with object
console.log(
    setVariable({key1: "valueWithObject1", key2: "valueWithObject2"}),
    process.env
);

// // test with array
console.log(
    setVariable([["key1", "valueWithArray1"], ["key2", "valueWithArray2"], ["key3", '["key313", "keyadw"]']]),
    process.env
);