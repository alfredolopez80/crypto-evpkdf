"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WordArray_1 = require("./WordArray");
const EvpKDF_1 = require("./EvpKDF");
const util_1 = require("util");
const crypto = require('@trust/webcrypto');
class WebcryptoNodeUtils {
    static getIV(password) {
        const keySize = 256 / 32;
        const ivSize = 512 / 32;
        const salt = new WordArray_1.WordArray([0x1212121212, 0x12121212, 0x121212121, 0x121212, 0x121212]);
        const wordArray = EvpKDF_1.deriveKeyIVFromPassword(password, keySize, ivSize, salt);
        return wordArray.iv;
    }
    /**
     * Import passphrase key using AES-CBC 256
     * @param passphraseKey
     */
    static async importKey_AESCBC(passphraseKey) {
        const iv = WebcryptoNodeUtils.getIV(passphraseKey);
        const passphrase = (new util_1.TextEncoder()).encode(passphraseKey);
        const pwHash = await crypto.subtle.digest({ name: 'SHA-256' }, passphrase);
        const ivArr = new Uint8Array(iv.words);
        const alg = { name: 'AES-CBC', iv: ivArr, length: 256 };
        const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
            'decrypt',
            'encrypt'
        ]);
        return { key, ivArr };
    }
    /**
     * Encrypts with AES
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    static async encryptAES(key, iv, buffer) {
        const data = new util_1.TextEncoder().encode(buffer);
        let encrypted = await crypto.subtle.encrypt(Object.assign({}, key.algorithm, { iv }), key, data);
        return encrypted;
    }
    /**
     * Decrypts with AES
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    static async decryptAES(key, iv, buffer) {
        let result = await crypto.subtle.decrypt(Object.assign({}, key.algorithm, { iv }), key, buffer);
        return result;
    }
}
exports.WebcryptoNodeUtils = WebcryptoNodeUtils;
