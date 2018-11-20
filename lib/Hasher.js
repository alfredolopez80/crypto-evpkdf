"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BufferedBlockAlgorithm_1 = require("./BufferedBlockAlgorithm");
const MD5Hasher_1 = require("./MD5Hasher");
/**
 * Abstract hasher template.
 *
 * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
 */
class Hasher {
    /**
     * Initializes a newly created hasher.
     *
     * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
     *
     * @example
     *
     *     var hasher = CryptoJS.algo.SHA256.create();
     */
    constructor(buffer) {
        this.buffer = buffer;
        this.blockSize = 512 / 32;
        this.md5 = new MD5Hasher_1.MD5(buffer);
        // Set initial values
        this.reset();
    }
    /**
     * Resets this hasher to its initial state.
     *
     * @example
     *
     *     hasher.reset();
     */
    reset() {
        // Reset data buffer
        this.reset.call(this);
        // Perform concrete-hasher logic
        this.md5._doReset();
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
    update(messageUpdate) {
        // Append
        this.buffer._append(messageUpdate);
        // Update the hash
        this.buffer._process(false, this.md5._doProcessBlock);
        // Chainable
        return this;
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
    finalize(messageUpdate) {
        // Final message update
        if (messageUpdate) {
            this.buffer._append(messageUpdate);
        }
        // Perform concrete-hasher logic
        const hash = this.md5._doFinalize();
        return hash;
    }
}
exports.Hasher = Hasher;
exports.HasherMixiin = applyMixins(Hasher, [MD5Hasher_1.MD5, BufferedBlockAlgorithm_1.BufferedBlockAlgorithm]);
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
