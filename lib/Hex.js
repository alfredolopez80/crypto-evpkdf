"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WordArray_1 = require("./WordArray");
// From https://github.com/brix/crypto-js/blob/89ce2460ab1a10cdd0cefb686966414ce6a2ee6e/src/core.js
/**
 * Hex encoding strategy.
 */
class Hex {
    /**
     * Converts a word array to a hex string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The hex string.
     *
     * @static
     *
     * @example
     *
     *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
     */
    stringify(wordArray) {
        // Shortcuts
        let words = wordArray.words;
        let sigBytes = wordArray.sigBytes;
        // Convert
        let hexChars = [];
        for (let i = 0; i < sigBytes; i++) {
            // tslint:disable-next-line:no-bitwise
            let bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            // @ts-ignore
            // tslint:disable-next-line:no-bitwise
            hexChars.push((bite >>> 4).toString(16));
            // @ts-ignore
            // tslint:disable-next-line:no-bitwise
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
     *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
     */
    parse(hexStr) {
        // Shortcut
        let hexStrLength = hexStr.length;
        // Convert
        let words = [];
        for (let i = 0; i < hexStrLength; i += 2) {
            // @ts-ignore
            // tslint:disable:no-bitwise
            words[i >>> 3] =
                parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
        }
        return new WordArray_1.WordArray(words, hexStrLength / 2);
    }
}
exports.Hex = Hex;
