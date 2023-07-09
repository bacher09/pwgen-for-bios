// based on dogbert's pwgen-sony-4x4.py
/* eslint-disable no-bitwise */
import JSBI from "jsbi";
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
function extEuclideanAlg(a: JSBI, b: JSBI): [JSBI, JSBI, JSBI] {
    if (JSBI.EQ(b, 0)) {
        return [JSBI.BigInt(1), JSBI.BigInt(0), a];
    } else {
        let [x, y, gcd] = extEuclideanAlg(b, JSBI.remainder(a, b));
        return [y, JSBI.subtract(x, JSBI.multiply(y, JSBI.divide(a, b))), gcd];
    }
}

function modInvEuclid(a: JSBI, m: JSBI): JSBI | undefined {
    let [x, , gcd] = extEuclideanAlg(a, m);
    if (JSBI.EQ(gcd, 1)) {
        // hack for javascript modulo operation
        // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
        const temp = JSBI.remainder(x, m);
        return JSBI.GE(temp, 0) ? temp : JSBI.ADD(temp, m) as JSBI;
    } else {
        return undefined;
    }
}

// https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
export function modularPow(base: JSBI, exponent: number, modulus: number | JSBI): number {
    let result: JSBI = JSBI.BigInt(1);

    if (!(modulus instanceof JSBI)) {
        modulus = JSBI.BigInt(modulus);
    }

    if (JSBI.EQ(modulus, 1)) {
        return 0;
    }

    base = JSBI.remainder(base, modulus);

    while (exponent > 0) {
        if ((exponent & 1) === 1) {
            result = JSBI.remainder(JSBI.multiply(result, base), modulus);
        }
        exponent = exponent >> 1;
        base = JSBI.remainder(JSBI.multiply(base, base), modulus);
    }
    return JSBI.toNumber(result);
}

function rsaDecrypt(code: number[]): number[] {
    const low: JSBI = JSBI.BigInt(arrayToNumber(code.slice(0, 4)));
    const high: JSBI = JSBI.BigInt(arrayToNumber(code.slice(4, 8)));
    const c: JSBI = JSBI.bitwiseOr(JSBI.leftShift(high, JSBI.BigInt(32)), low);

    const p: number = 2795287379;
    const q: number = 3544934711;
    const e = 41;
    const phi: JSBI = JSBI.multiply(JSBI.BigInt(p - 1), JSBI.BigInt(q - 1));
    const d: JSBI = modInvEuclid(JSBI.BigInt(e), phi) as JSBI;

    const dp: JSBI = JSBI.remainder(d, JSBI.BigInt(p - 1));
    const dq: JSBI = JSBI.remainder(d, JSBI.BigInt(q - 1));
    const qinv: JSBI = modInvEuclid(JSBI.BigInt(q), JSBI.BigInt(p)) as JSBI;

    const m1 = modularPow(c, JSBI.toNumber(dp), p);
    const m2 = modularPow(c, JSBI.toNumber(dq), q);
    let h: JSBI;

    if (m1 < m2) {
        h = JSBI.remainder(JSBI.multiply(JSBI.add(JSBI.BigInt(m1 - m2), JSBI.BigInt(p)), qinv), JSBI.BigInt(p));
    } else {
        h = JSBI.remainder(JSBI.multiply(JSBI.BigInt(m1 - m2), qinv), JSBI.BigInt(p));
    }
    const m: JSBI = JSBI.add(JSBI.multiply(h, JSBI.BigInt(q)), JSBI.BigInt(m2));
    return numberToArray(JSBI.toNumber(JSBI.asUintN(32, m))).concat(
        numberToArray(JSBI.toNumber(JSBI.signedRightShift(m, JSBI.BigInt(32))))
    );
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
