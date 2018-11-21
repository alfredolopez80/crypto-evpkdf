const CryptoJS = require('crypto-js')

import { deriveKeyIVFromPassword } from './EvpKDF'
import { WordArray } from './WordArray';
describe('EvpKDF', () => {
    describe('#getEvpKDF()', () => {
        it('should return key, iv and salt', async () => {
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
            const salt = WordArray.random(64 / 8)
            const wordArray = deriveKeyIVFromPassword(
                'a very long password........',
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
            const derivedParams2 = CryptoJS.kdf.OpenSSL.execute(
                'a very long password',
                keySize,
                ivSize,
                salt,
            )


            // expect(wordArray.key.words).toBe(derivedParams.key.words)
            expect(derivedParams.key.words).toBe(derivedParams2.key.words)
        })
    })
})
