import { BufferedBlockAlgorithm } from './BufferedBlockAlgorithm'
import { MD5 } from './MD5Hasher'

/**
 * Abstract hasher template.
 *
 * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
 */
export class Hasher {
    /**
     * Configuration options.
     */

    private md5: MD5
    

    /**
     * Initializes a newly created hasher.
     *
     * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
     *
     * @example
     *
     *     var hasher = CryptoJS.algo.SHA256.create();
     */
    constructor(private buffer: BufferedBlockAlgorithm) {
        this.md5 = new MD5(buffer)
        // Set initial values
        this.reset()
    }

    /**
     * Resets this hasher to its initial state.
     *
     * @example
     *
     *     hasher.reset();
     */
    public reset() {
        // Reset data buffer
        this.buffer.reset() // call
        // Perform concrete-hasher logic
        this.md5.doReset()
    }

    /**
     * Updates this hasher with a message.
     *
     * @param {WordArray|string} messageUpdate The message to append.
     *
     * @return {Hasher} This hasher.
     *
     * @example
     *
     *     hasher.update('message');
     *     hasher.update(wordArray);
     */
    public update(messageUpdate) {
        // Append
        this.buffer.append(messageUpdate)

        // Update the hash
        this.buffer.process(false, this.md5)

        // Chainable
        return this
    }

    /**
     * Finalizes the hash computation.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param {WordArray|string} messageUpdate (Optional) A final message update.
     *
     * @return {WordArray} The hash.
     *
     * @example
     *
     *     var hash = hasher.finalize();
     *     var hash = hasher.finalize('message');
     *     var hash = hasher.finalize(wordArray);
     */
    public finalize(messageUpdate) {
        // Final message update
        if (messageUpdate) {
            this.buffer.append(messageUpdate)
        }

        // Perform concrete-hasher logic
        const hash = this.md5.doFinalize()

        return hash
    }

    // /**
    //  * Creates a shortcut function to a hasher's object interface.
    //  *
    //  * @param {Hasher} hasher The hasher to create a helper for.
    //  *
    //  * @return {Function} The shortcut function.
    //  *
    //  * @static
    //  *
    //  * @example
    //  *
    //  *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
    //  */
    // public _createHelper(hasher) {
    //     return function(message, cfg) {
    //         return new hasher.init(cfg).finalize(message)
    //     }
    // }

    // /**
    //  * Creates a shortcut function to the HMAC's object interface.
    //  *
    //  * @param {Hasher} hasher The hasher to use in this HMAC helper.
    //  *
    //  * @return {Function} The shortcut function.
    //  *
    //  * @static
    //  *
    //  * @example
    //  *
    //  *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
    //  */
    // public _createHmacHelper(hasher) {
    //     return function(message, key) {
    //         return new C_algo.HMAC.init(hasher, key).finalize(message)
    //     }
    // }
}
