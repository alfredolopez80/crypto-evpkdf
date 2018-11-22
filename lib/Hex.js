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
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;
        // Convert
        var hexChars = [];
        for (var i = 0; i < sigBytes; i++) {
            var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
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
     *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
     */
    static parse(hexStr) {
        // Shortcut
        var hexStrLength = hexStr.length;
        // Convert
        var words = [];
        for (var i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
        }
        return new WordArray_1.WordArray(words, hexStrLength / 2);
    }
}
exports.Hex = Hex;
