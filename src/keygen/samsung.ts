/* eslint-disable no-bitwise */
/* Return password for samsung laptops
 * 12 or 18 hexhecimal digits like 07088120410C0000
 */

import { makeSolver } from "./utils";
import { keyboardEncToAscii } from "./utils";

const rotationMatrix1 = [
    7, 1, 5, 3, 0, 6, 2, 5, 2, 3, 0, 6, 1, 7, 6, 1, 5, 2, 7, 1, 0, 3, 7,
    6, 1, 0, 5, 2, 1, 5, 7, 3, 2, 0, 6
];
const rotationMatrix2 = [
    1, 6, 2, 5, 7, 3, 0, 7, 1, 6, 2, 5, 0, 3, 0, 6, 5, 1, 1, 7, 2, 5, 2,
    3, 7, 6, 2, 1, 3, 7, 6, 5, 0, 1, 7
];

const rotationMatrix3: Uint8Array = Uint8Array.from([
    3, 6, 3, 1, 6, 7, 7, 7, 2, 6, 4, 3, 4, 6, 1, 7, 2, 1, 7, 7,
    5, 3, 3, 1, 2, 3, 1, 2, 1, 7, 4, 7, 6, 2, 4, 4, 1, 6, 1, 5,
    6, 6, 7, 5, 7, 7, 4, 3, 1, 1, 1, 6, 3, 2, 7, 3, 7, 3, 7, 3,
    5, 6, 4, 1, 1, 3, 6, 6, 1, 4, 3, 7, 6, 7, 5, 3, 6, 7, 6, 3,
    1, 3, 5, 7, 5, 6, 2, 2, 7, 5, 7, 1, 2, 3, 2, 1, 6, 4, 5, 3
]);

function keyToAscii(intKeys: number[]): string | undefined {
    let out = "";

    for (let intKey of intKeys) {
        if (intKey === 0) {
            return out;
        }
        if (intKey < 32 || intKey > 127) {
            return undefined;
        }
        out += String.fromCharCode(intKey);
    }

    return out;
}

function decryptHash(hash: number[], key: number, rotationMatrix: number[]): number[] {
    let outhash: number[] = [];

    for (let i = 0; i < hash.length; i++) {
        const val = ((hash[i] << (rotationMatrix[7 * key + i])) & 0xFF) |
                    (hash[i] >> (8 - rotationMatrix[7 * key + i]));
        outhash.push(val);
    }

    return outhash;
}

function samsungKeygen(serial: string): string[] {
    let hash: number[] = [];

    for (let i = 1; i < Math.floor(serial.length / 2); i++) {
        let val = parseInt(serial.charAt(2 * i) + serial.charAt(2 * i + 1), 16);
        hash.push(val);
    }
    let key = parseInt(serial.substring(0, 2), 16) % 5;

    let calcScanCodePwd = (matrix: number[]) =>
        keyboardEncToAscii(decryptHash(hash, key, matrix));

    let scanCodePassword = calcScanCodePwd(rotationMatrix1);
    if (scanCodePassword === "") {
        scanCodePassword = calcScanCodePwd(rotationMatrix2);
    }

    const asciiPassword1 = keyToAscii(decryptHash(hash, key, rotationMatrix1));
    const asciiPassword2 = keyToAscii(decryptHash(hash, key, rotationMatrix2));

    return [scanCodePassword, asciiPassword1, asciiPassword2].
        filter((code) => code ? true : false) as string[];
}

function byteRol(val: number, shift: number): number {
    return ((val << shift) & 0xff) | (val >> (8 - shift));
}

function nonprintable(sym: number): boolean {
    return sym >= 127 || sym < 32;
}

/* Samsung 44 HEX keys */
export function samsung44HexKeygen(serial: string): string | undefined {
    if (serial.length !== 44) {
        return undefined;
    }

    let hash = new Uint8Array(22);
    let password = "";
    for (let i = 21; i >= 0; i--) {
        const low = parseInt(serial[i * 2], 16);
        const high = parseInt(serial[i * 2 + 1], 16);
        hash[21 - i] = (high << 4) | low;
    }
    const pwdLength = hash[0] >> 3;
    if (pwdLength > 20) {
        // length to big, probably other algorithm
        return undefined;
    }
    const key = (hash[1] % 5) * 20;
    for (let i = 0; i < pwdLength; i++) {
        const shift = rotationMatrix3[key + i];
        const sym = byteRol(byteRol(hash[i + 2], shift), 4);
        if (nonprintable(sym)) {
            return undefined;
        }
        password += String.fromCharCode(sym);
    }
    return password;
}

export let samsungSolver = makeSolver({
    name: "samsung",
    description: "Samsung",
    examples: ["07088120410C0000"],
    inputValidator: (s) => /^[0-9ABCDEF]+$/i.test(s) && (
        s.length === 12 || s.length === 14 || s.length === 16 || s.length === 18
    ),
    fun: samsungKeygen
});

export let samsung44HexSolver = makeSolver({
    name: "samsung44Hex",
    description: "Samsung 44 Hexdecimal",
    examples: ["54574AAD6A8B1B9353F6FA66DCD2DA91B06DBD8E3204"],
    inputValidator: (s) => /^[0-9ABCDEF]{44}$/i.test(s),
    fun: (hash: string) => {
        const pwd = samsung44HexKeygen(hash);
        return (pwd) ? [pwd] : [];
    }
});
