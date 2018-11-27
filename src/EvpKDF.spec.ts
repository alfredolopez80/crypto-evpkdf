const CryptoJS = require('crypto-js')

import { TextDecoder } from 'util'
import { WebcryptoNodeUtils } from './WebcryptoNodeUtils'
import { deriveKeyIVFromPassword } from './EvpKDF'
import { WordArray } from './WordArray';
describe('EvpKDF', () => {
    describe('#getEvpKDF()', () => {

        it('should match encrypt Webcrypto == CryptoJS', async () => {
            const password = 'password'
            const data = 'Hola Mundo'

            const key = await WebcryptoNodeUtils.importKey_AESCBC(password)
            // CryptoJS
            const ciphertext = CryptoJS.AES.encrypt(data, password).toString();

            // Webcrypto
            const encrypted: ArrayBuffer = await WebcryptoNodeUtils.encryptAES(key.key, key.ivArr, data)
            const decoded = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
            

            
            expect(ciphertext).toBe(decoded)
        })

        it('should match decrypt with AES CBC webcrypto polyfill', async () => {
            const password = 'password'
            const data = 'Hola Mundo'

            const key = await WebcryptoNodeUtils.importKey_AESCBC(password)
            
            const encrypted: ArrayBuffer = await WebcryptoNodeUtils.encryptAES(key.key, key.ivArr, data)
            const decrypted = await WebcryptoNodeUtils.decryptAES(key.key, key.ivArr, encrypted)

            const decoded = (new TextDecoder()).decode(decrypted)
            expect(data).toBe(decoded)
        })

        it('should return key, iv and salt', async () => {
            const keySize = 256 / 32
            const ivSize = 512 / 32
            const salt = new WordArray([0x1212121212])
            const wordArray = deriveKeyIVFromPassword(
                'a very long password',
                keySize,
                ivSize,
                salt,
            )
            const derivedParams = CryptoJS.kdf.OpenSSL.execute(
                'a very long password',
                keySize,
                ivSize,
                salt,
            )
            const key = deriveKeyIVFromPassword(
                'password',
                (256+128)/32,
                ivSize,
                'saltsalt',
            ).key

            expect('fdbdf3419fff98bdb0241390f62a9db35f4aba29d77566377997314ebfc709f20b5ca7b1081f94b1ac12e3c8ba87d05a')
            .toBe(key.toString());


            const password = new WordArray([0x12345678])

            const expectedPass = password.toString()
            expect(expectedPass).toBe(password.toString())
            expect(wordArray.key.words).toEqual(derivedParams.key.words)
        })
    })
})
