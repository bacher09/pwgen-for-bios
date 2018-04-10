/* tslint:disable:no-bitwise */
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

    // TODO: This might require polyfil
    return [scanCodePassword, asciiPassword1, asciiPassword2].
        filter((code) => code ? true : false) as string[];
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
