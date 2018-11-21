import { WordArray } from './WordArray'
import { Hasher } from './Hasher'
import { BufferedBlockAlgorithm } from './BufferedBlockAlgorithm'

export interface IEvpKDFConfig {
    keySize: number
    iterations: number
}
export function EvpKDF(
    password: string,
    salt: string,
    config: IEvpKDFConfig = { keySize: 128 / 32, iterations: 1 }
) {
    let block
    const buffer = new BufferedBlockAlgorithm()
    const hasher: Hasher = new Hasher(buffer)

    // Initial values
    let derivedKey: WordArray = new WordArray()

    // Shortcuts
    let derivedKeyWords = derivedKey.words
    let keySize = config.keySize
    let iterations = config.iterations

    // Generate key
    while (derivedKeyWords.length < keySize) {
        if (block) {
            hasher.update(block)
        }
        block = hasher.update(password).finalize(salt)
        hasher.reset()

        // Iterations
        for (let i = 1; i < iterations; i++) {
            block = hasher.finalize(block)
            hasher.reset()
        }

        derivedKey.concat(block)
    }
    derivedKey.sigBytes = keySize * 4

    return derivedKey
}
