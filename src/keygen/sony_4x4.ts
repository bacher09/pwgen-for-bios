// based on dogbert's pwgen-sony-4x4.py
/* tslint:disable:no-bitwise */
import * as Long from "long";
import { makeSolver } from "./utils";

const otpChars: string = "9DPK7V2F3RT6HX8J";
const pwdChars: string = "47592836";
const inputRe: RegExp = new RegExp(`^[${otpChars}]{16}\$`);

function arrayToNumber(arr: number[]): number {
    // same as python struct.unpack("<I", arr)
    return (arr[3] << 24 | arr[2] << 16 | arr[1] << 8 | arr[0]) >>> 0;
}

function numberToArray(num: number): number[] {
    return [num & 0xFF, (num >> 8) & 0xFF, (num >> 16) & 0xFF, (num >> 24) & 0xFF];
}

function decodeHash(hash: string): number[] {
    let temp: number[] = [];
    for (let i = 0; i < hash.length; i += 2) {
        // TODO: check values
        temp.unshift(otpChars.indexOf(hash[i]) * 16 + otpChars.indexOf(hash[i + 1]));
    }
    return temp;
}

function encodePassword(pwd: number[]): string {
    let n: number = arrayToNumber(pwd);
    let result: string = "";
    for (let i = 0; i < 8; i++) {
        result += pwdChars.charAt((n >> (21 - i * 3)) & 0x7);
    }
    return result;
}

// http://numericalrecipes.blogspot.com/2009/03/modular-multiplicative-inverse.html
function extEuclideanAlg(a: Long, b: Long): [Long, Long, Long] {
    if (b.isZero()) {
        return [new Long(1), new Long(0), a];
    } else {
        let [x, y, gcd] = extEuclideanAlg(b, a.mod(b));
        return [y, x.sub(y.mul(a.div(b))), gcd];
    }
}

function modInvEuclid(a: Long, m: Long): Long | undefined {
    let [x, , gcd] = extEuclideanAlg(a, m);
    if (gcd.eq(1)) {
        // hack for javascript modulo operation
        // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
        const temp = x.mod(m);
        return temp.gte(0) ? temp : temp.add(m);
    } else {
        return undefined;
    }
}

// https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
export function modularPow(base: Long, exponent: number, modulus: number): number {
    let result: Long = new Long(1, 0, true);

    if (modulus === 1) {
        return 0;
    }

    base = base.mod(modulus);

    while (exponent > 0) {
        if ((exponent & 1) === 1) {
           result = result.mul(base).mod(modulus);
        }
        exponent = exponent >> 1;
        base = base.mul(base).mod(modulus);
    }
    return result.toNumber();
}

function rsaDecrypt(code: number[]): number[] {
    const low: number = arrayToNumber(code.slice(0, 4));
    const high: number = arrayToNumber(code.slice(4, 8));
    const c: Long = Long.fromBits(low, high, true);

    const p: number = 2795287379;
    const q: number = 3544934711;
    const e = 41;
    const phi = (new Long(p - 1, 0, true)).mul(q - 1);
    const d: Long = modInvEuclid(new Long(e, 0, true), phi) as Long;

    const dp = d.mod(p - 1);
    const dq = d.mod(q - 1);
    const qinv: Long = modInvEuclid(new Long(q), new Long(p)) as Long;

    const m1 = modularPow(c, dp.toNumber(), p);
    const m2 = modularPow(c, dq.toNumber(), q);
    let h: Long;

    if (m1 < m2) {
        h = Long.fromValue(m1 - m2).add(p).mul(qinv).mod(p);
    } else {
        h = Long.fromValue(m1 - m2).mul(qinv).mod(p);
    }
    const m = h.mul(q).add(m2);
    return numberToArray(m.low).concat(numberToArray(m.high));
}

export function sony4x4Keygen(hash: string): string {
    const numHash = decodeHash(hash);
    const pwd = rsaDecrypt(numHash);
    return encodePassword(pwd);
}

export let sony4x4Solver = makeSolver({
    name: "sony4x4",
    description: "Sony 4x4",
    examples: ["73KR-3FP9-PVKH-K29R"],
    cleaner: (input: string) => input.trim().replace(/[-\s]/gi, "").toUpperCase(),
    inputValidator: (s) => inputRe.test(s),
    fun: (code: string) => {
        let res = sony4x4Keygen(code);
        return res ? [res] : [];
    }
});
