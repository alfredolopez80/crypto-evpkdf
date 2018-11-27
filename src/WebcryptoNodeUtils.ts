import { WordArray } from './WordArray'
import { deriveKeyIVFromPassword } from './EvpKDF'
import { TextEncoder } from 'util'
const crypto: Crypto = require('@trust/webcrypto')

export class WebcryptoNodeUtils {
    public static getIV(password) {
        const keySize = 256 / 32
        const ivSize = 512 / 32
        const salt = new WordArray([
            0x1212121212,
            0x12121212,
            0x121212121,
            0x121212,
            0x121212
        ])
        const wordArray = deriveKeyIVFromPassword(
            password,
            keySize,
            ivSize,
            salt
        )
        return wordArray
    }
    /**
     * Import passphrase key using AES-CBC 256
     * @param passphraseKey
     */
    public static async importKey_AESCBC(
        passphraseKey: { key: WordArray; iv: WordArray, salt: any } | string
    ) {
        let iv
        let key
        if (typeof passphraseKey === 'string') {
            const wordarray = WebcryptoNodeUtils.getIV(passphraseKey)
            iv = wordarray.iv
            key = wordarray.key
        } else {
            iv = passphraseKey.iv
            key = passphraseKey.key
        }


        const ivArr = new Uint8Array(iv.words)
        const alg = { name: 'AES-CBC', iv: ivArr, length: 256 }
        const cryptokey = await crypto.subtle.importKey(
            'raw',
            key.words,
            alg,
            false,
            ['decrypt', 'encrypt']
        )

        return { key: cryptokey, ivArr }
    }

    /**
     * Encrypts with AES
     * @param key Key as string
     * @param buffer Data buffer as string
     */
    public static async encryptAES(
        key: CryptoKey,
        iv: any,
        buffer: string
    ): Promise<ArrayBuffer> {
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
    public static async decryptAES(
        key: CryptoKey,
        iv: any,
        buffer: ArrayBuffer
    ): Promise<ArrayBuffer> {
        let result = await crypto.subtle.decrypt(
            { ...key.algorithm, iv },
            key,
            buffer
        )

        return result
    }
}
