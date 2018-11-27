import { WordArray } from './WordArray'
import { deriveKeyIVFromPassword } from './EvpKDF'
import { TextEncoder } from 'util'
const crypto: Crypto = require('@trust/webcrypto')

export class WebcryptoNodeUtils {
    public static getIV(password) {
        const keySize = 256 / 32
        const ivSize = 512 / 32
        const salt = new WordArray([0x1212121212, 0x12121212, 0x121212121, 0x121212, 0x121212])
        const wordArray = deriveKeyIVFromPassword(
            password,
            keySize,
            ivSize,
            salt
        )
        console.log(`password based: ${JSON.stringify(wordArray)}`)
        return wordArray.iv
    }
    /**
     * Import passphrase key using AES-CBC 256
     * @param passphraseKey
     */
    public static async importKey_AESCBC(passphraseKey: string) {
        const iv = WebcryptoNodeUtils.getIV(passphraseKey)
        const passphrase = (new TextEncoder()).encode(passphraseKey)
        const pwHash = await crypto.subtle.digest({ name: 'SHA-256' }, passphrase)

        const ivArr = new Uint8Array(iv.words)
        const alg = { name: 'AES-CBC', iv: ivArr, length: 256 }
        const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
            'decrypt',
            'encrypt'
        ])
        
        return { key, ivArr}
    }


    /**
     * Encrypts with AES
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    public static async encryptAES(key: CryptoKey, iv: any, buffer: string): Promise<ArrayBuffer> {
        const data: Uint8Array = new TextEncoder().encode(buffer)
        let encrypted = await crypto.subtle.encrypt(
            { ...key.algorithm, iv },
            key,
            data
        )

        return encrypted
    }

    /**
     * Decrypts with AES
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    public static async decryptAES(key: CryptoKey, iv: any, buffer: ArrayBuffer): Promise<ArrayBuffer> {
        let result = await crypto.subtle.decrypt(
            { ...key.algorithm, iv },
            key,
            buffer
        )

        return result
    }
}
