"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function FF(a, b, c, d, x, s, t) {
    let n = a + ((b & c) | (~b & d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
}
exports.FF = FF;
function GG(a, b, c, d, x, s, t) {
    let n = a + ((b & d) | (c & ~d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
}
exports.GG = GG;
function HH(a, b, c, d, x, s, t) {
    let n = a + (b ^ c ^ d) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
}
exports.HH = HH;
function II(a, b, c, d, x, s, t) {
    let n = a + (c ^ (b | ~d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
}
exports.II = II;
