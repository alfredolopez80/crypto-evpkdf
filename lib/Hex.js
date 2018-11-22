"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-bitwise
const WordArray_1 = require("./WordArray");
/**
 * Hex encoding strategy.
 */
class Hex {
    static stringify(wordArray) {
        // Shortcuts
        let words = wordArray.words;
        let sigBytes = wordArray.sigBytes;
        // Convert
        let hexChars = [];
        for (let i = 0; i < sigBytes; i++) {
            let bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 0x0f).toString(16));
        }
        return hexChars.join('');
    }
    /**
     * Converts a hex string to a word array.
     *
     * @param {string} hexStr The hex string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     let wordArray = CryptoJS.enc.Hex.parse(hexString);
     */
    static parse(hexStr) {
        // Shortcut
        let hexStrLength = hexStr.length;
        // Convert
        let words = [];
        for (let i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
        }
        return new WordArray_1.WordArray(words, hexStrLength / 2);
    }
}
exports.Hex = Hex;
