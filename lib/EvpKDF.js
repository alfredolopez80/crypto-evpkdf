"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WordArray_1 = require("./WordArray");
const Hasher_1 = require("./Hasher");
const BufferedBlockAlgorithm_1 = require("./BufferedBlockAlgorithm");
function createEvpKDF(password, salt, config = { keySize: 128 / 32, iterations: 1 }) {
    let block;
    const buffer = new BufferedBlockAlgorithm_1.BufferedBlockAlgorithm();
    const hasher = new Hasher_1.Hasher(buffer);
    // Initial values
    let derivedKey = new WordArray_1.WordArray();
    // Shortcuts
    let derivedKeyWords = derivedKey.words;
    let keySize = config.keySize;
    let iterations = config.iterations;
    console.log(derivedKeyWords.length, keySize);
    // Generate key
    while (derivedKeyWords.length < keySize) {
        console.log('block', block);
        if (block) {
            hasher.update(block);
        }
        block = hasher.update(password).finalize(salt);
        hasher.reset();
        // Iterations
        for (let i = 1; i < iterations; i++) {
            block = hasher.finalize(block);
            console.log('block finalized', block);
            hasher.reset();
        }
        derivedKey.concat(block);
        console.log('derived', derivedKey);
    }
    derivedKey.sigBytes = keySize * 4;
    return derivedKey;
}
exports.createEvpKDF = createEvpKDF;
function deriveKeyIVFromPassword(password, keySize, ivSize, salt) {
    // Generate random salt
    if (!salt) {
        salt = WordArray_1.WordArray.random(64 / 8);
    }
    // Derive key and IV
    var key = createEvpKDF(password, salt, { keySize: keySize + ivSize });
    // Separate key and IV
    var iv = new WordArray_1.WordArray(key.words.slice(keySize), ivSize * 4);
    key.sigBytes = keySize * 4;
    // Return params
    return { key: key, iv: iv, salt: salt };
}
exports.deriveKeyIVFromPassword = deriveKeyIVFromPassword;
