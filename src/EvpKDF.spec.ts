const CryptoJS = require('crypto-js')

import { deriveKeyIVFromPassword } from './EvpKDF'
import { WordArray } from './WordArray';
describe('EvpKDF', () => {
    describe('#getEvpKDF()', () => {
        xit('should return key, iv and salt', async () => {
            const keySize = 256 / 32
            const ivSize = 128 / 32
            const wordArray = deriveKeyIVFromPassword(
                'a very long password........',
                keySize,
                ivSize,
                null
            )

            const expectedResult = {
                iv: {
                    sigBytes: 16,
                    words: [19088743, -1985229329, -19088744, 1985229328]
                },
                key: {
                    sigBytes: 32,
                    words: [
                        19088743,
                        -1985229329,
                        -19088744,
                        1985229328,
                        19088743,
                        -1985229329,
                        -19088744,
                        1985229328,
                        19088743,
                        -1985229329,
                        -19088744,
                        1985229328
                    ]
                },
                salt: { sigBytes: 8, words: [-1600982938, 1452500692] }
            }
            expect(wordArray.iv.words).toEqual(expectedResult.iv.words)
            expect(wordArray.key.words).toEqual(expectedResult.key.words)
            expect(wordArray.salt.words).not.toEqual(expectedResult.salt.words)
        })

        it('should return key, iv and salt', async () => {
            const keySize = 256 / 32
            const ivSize = 128 / 32
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

            expect('fdbdf3419fff98bdb0241390f62a9db35f4aba29d77566377997314ebfc709f20b5ca7b1081f94b1ac12e3c8ba87d05a').toBe(key.toString());


            const password = new WordArray([0x12345678])

            const expectedPass = password.toString()
            expect(expectedPass).toBe(password.toString())
            expect(wordArray.key.words).toEqual(derivedParams.key.words)
        })
    })
})
