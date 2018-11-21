import { deriveKeyIVFromPassword } from './EvpKDF'
describe('EvpKDF', () => {
    describe('#getEvpKDF()', () => {
        it('should return ...', async () => {
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
    })
})
