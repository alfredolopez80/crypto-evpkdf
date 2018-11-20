"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WordArray_1 = require("./WordArray");
const Hasher_1 = require("./Hasher");
const BufferedBlockAlgorithm_1 = require("./BufferedBlockAlgorithm");
const md5 = require('blueimp-md5');
function EvpKDF(password, salt, config = { keySize: 128 / 32, iterations: 1 }) {
    let block;
    const buffer = new BufferedBlockAlgorithm_1.BufferedBlockAlgorithm();
    const hasher = new Hasher_1.Hasher(buffer);
    // Initial values
    let derivedKey = new WordArray_1.WordArray();
    // Shortcuts
    let derivedKeyWords = derivedKey.words;
    let keySize = config.keySize;
    let iterations = config.iterations;
    // Generate key
    while (derivedKeyWords.length < keySize) {
        if (block) {
            hasher.update(block);
        }
        block = hasher.update(password).finalize(salt);
        hasher.reset();
        // Iterations
        for (let i = 1; i < iterations; i++) {
            block = hasher.finalize(block);
            hasher.reset();
        }
        derivedKey.concat(block);
    }
    derivedKey.sigBytes = keySize * 4;
    return derivedKey;
}
exports.EvpKDF = EvpKDF;
