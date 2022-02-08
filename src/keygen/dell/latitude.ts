/* eslint-disable no-bitwise */

export class DES {
    // DES ECB mode
    // Initial permutation table
    private static readonly IP: Uint8Array = Uint8Array.from([
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17,  9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7,
    ]);

    // final permutation table
    private static readonly FP: Uint8Array = Uint8Array.from([
        40,  8, 48, 16, 56, 24, 64, 32,
        39,  7, 47, 15, 55, 23, 63, 31,
        38,  6, 46, 14, 54, 22, 62, 30,
        37,  5, 45, 13, 53, 21, 61, 29,
        36,  4, 44, 12, 52, 20, 60, 28,
        35,  3, 43, 11, 51, 19, 59, 27,
        34,  2, 42, 10, 50, 18, 58, 26,
        33,  1, 41,  9, 49, 17, 57, 25,
    ]);

    // permutation choice 1
    private static readonly PC1: Uint8Array = Uint8Array.from([
        57, 49, 41, 33, 25, 17,  9,
        1,  58, 50, 42, 34, 26, 18,
        10,  2, 59, 51, 43, 35, 27,
        19, 11,  3, 60, 52, 44, 36,
        63, 55, 47, 39, 31, 23, 15,
        7,  62, 54, 46, 38, 30, 22,
        14,  6, 61, 53, 45, 37, 29,
        21, 13,  5, 28, 20, 12,  4,
    ]);

    // permutation choice 2
    private static readonly PC2: Uint8Array = Uint8Array.from([
        14, 17, 11, 24,  1,  5,  3, 28,
        15,  6, 21, 10, 23, 19, 12,  4,
        26,  8, 16,  7, 27, 20, 13,  2,
        41, 52, 31, 37, 47, 55, 30, 40,
        51, 45, 33, 48, 44, 49, 39, 56,
        34, 53, 46, 42, 50, 36, 29, 32,
    ]);

    // expansion table (E table)
    private static readonly EXPANSION: Uint8Array = Uint8Array.from([
        32,  1,  2,  3,  4,  5,
        4,  5,  6,  7,  8,  9,
        8,  9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
        28, 29, 30, 31, 32,  1,
    ]);

    // Post S-Box permutation (P table)
    private static readonly POST_SBOX: Uint8Array = Uint8Array.from([
        16,  7, 20, 21,
        29, 12, 28, 17,
        1, 15, 23, 26,
        5, 18, 31, 10,
        2,  8, 24, 14,
        32, 27,  3,  9,
        19, 13, 30,  6,
        22, 11,  4, 25,
    ]);

    private static readonly ITERATION_SHIFT: Uint8Array = Uint8Array.from([
        1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1
    ]);

    private static readonly SBOX: Uint8Array = Uint8Array.from([
        // S1
        14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
        0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
        4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
        15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13,
        // S2
        15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
        3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5,
        0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
        13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9,
        // S3
        10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
        13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
        13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
        1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12,
        // S4
        7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
        13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
        10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
        3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14,
        // S5
        2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
        14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
        4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
        11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3,
        // S6
        12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
        10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
        9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
        4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13,
        // S7
        4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
        13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
        1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
        6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12,
        // S8
        13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
        1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
        7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
        2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11,
    ]);

    private key: Uint8Array;
    private subKeys: Uint32Array;

    constructor(key: Uint8Array) {
        if (key.length !== 8) {
            throw new Error("DES key should be 8 bytes long");
        }

        this.key = Uint8Array.from(key);
        this.subKeys = new Uint32Array(16 * 2);
        this.generateSubkeys();
    }

    private static FUNC(data: number, subkey2: number, subkey1: number): number {
        let part1: number = 0;
        let part2: number = 0;
        let temp: number = 0;
        let output: number = 0;

        for (let i = 0; i < 48; i++) {
            const index = DES.EXPANSION[i] - 1;
            if (i < 32) {
                part1 |= ((data >>> index) & 1) << i;
            } else {
                part2 |= ((data >>> index) & 1) << (i - 32);
            }
        }
        part2 ^= subkey2;
        part1 ^= subkey1;

        function getEBit(index: number): number {
            if (index < 32) {
                return (part1 >>> index) & 1;
            } else {
                return (part2 >>> (index - 32)) & 1;
            }
        }

        for (let i = 0, level = 0; i < 48; i += 6, level++) {
            const row = getEBit(i) << 1 | getEBit(i + 5);
            const col = getEBit(i + 1) << 3 | getEBit(i + 2) << 2 | getEBit(i + 3) << 1 | getEBit(i + 4);
            const num = DES.SBOX[level << 6 | row << 4 | col];
            // outputut in reverse order
            temp = (temp << 4) | num;
        }

        for (let i = 0; i < 32; i++) {
            const index = 32 - DES.POST_SBOX[i];
            output |= ((temp >>> index) & 1) << i;
        }
        return output;
    }

    public encryptBlock(input: Uint8Array): Uint8Array {
        return this.cryptBlock(input, true);
    }

    public decryptBlock(input: Uint8Array): Uint8Array {
        return this.cryptBlock(input, false);
    }

    private generateSubkeys() {
        let leftpart: number = 0;
        let rightpart: number = 0;

        for (let i = 0; i < 56; i++) {
            const index = DES.PC1[i] - 1;
            const bit = (this.key[index >>> 3] >>> (7 - (index & 0b111))) & 1;
            if (i < 28) {
                leftpart |= (bit << i);
            } else {
                rightpart |= (bit << (i - 28));
            }
        }
        function rightShift(part: number, val: number) {
            return (part >>> val | part << (28 - val)) & 0xfffffff;
        }

        for (let round = 0; round < 16; round++) {
            let subkeyPart1: number = 0;
            let subkeyPart2: number = 0;

            leftpart = rightShift(leftpart, DES.ITERATION_SHIFT[round]);
            rightpart = rightShift(rightpart, DES.ITERATION_SHIFT[round]);
            for (let i = 0; i < 48; i++) {
                const index = DES.PC2[i] - 1;
                const bit = ((index < 28) ? (leftpart >>> index) : (rightpart >>> (index - 28))) & 1;
                if (i < 32) {
                    subkeyPart1 |= (bit << i);
                } else {
                    subkeyPart2 |= (bit << (i - 32));
                }
            }
            this.subKeys[round << 1] = subkeyPart2;
            this.subKeys[round << 1 | 1] = subkeyPart1;
        }
    }

    private cryptBlock(input: Uint8Array, encrypt: boolean = true): Uint8Array {
        if (input.length !== 8) {
            throw new Error("Input should be 8 bytes long");
        }
        let leftpart: number = 0;
        let rightpart: number = 0;
        // initial permutation
        for (let i = 0; i < 64; i++) {
            const index = DES.IP[i] - 1;
            const bit = (input[index >>> 3] >>> (7 - (index & 0b111))) & 1;
            if (i < 32) {
                leftpart |= (bit << i);
            } else {
                rightpart |= (bit << (i - 32));
            }
        }
        if (encrypt) {
            for (let round = 0; round < 16; round++) {
                const temp = rightpart;
                rightpart = leftpart ^ DES.FUNC(rightpart, this.subKeys[round << 1],
                    this.subKeys[round << 1 | 1]);
                leftpart = temp;
            }
        } else {
            // reverse order
            for (let round = 15; round >= 0; round--) {
                const temp = rightpart;
                rightpart = leftpart ^ DES.FUNC(rightpart, this.subKeys[round << 1],
                    this.subKeys[round << 1 | 1]);
                leftpart = temp;
            }
        }

        // final permutation
        let output: Uint8Array = new Uint8Array(8);
        for (let i = 0; i < 64; i++) {
            const index = DES.FP[i] - 1;
            let bit: number;
            if (index < 32) {
                bit = (rightpart >>> index) & 1;
            } else {
                bit = (leftpart >>> (index - 32)) & 1;
            }
            output[i >>> 3] |= (bit << (7 - (i & 0b111)));
        }
        return output;
    }
}


/*
 * Latitude 3540 keygen
 * hash -- 16 digit hexdeciman number
 * tag -- 7 chars length string
 */
export function latitude3540Keygen(hash: string, tag: string): string | undefined {
    const checkRe = /^[0-9A-Fa-f]$/;
    const masterKey = Uint8Array.from("23AAFFAD".split("").map(v => v.charCodeAt(0)));
    const enc1 = new DES(masterKey);
    let block1 = new Uint8Array(8);
    let block2 = new Uint8Array(8);
    let pwd: string = "";
    // read hex encoded 8 byte block
    for (let i = 0; i < 8; i++) {
        block2[i] = parseInt(hash.slice(i * 2, i * 2 + 2), 16);
    }
    block1[0] = tag.charCodeAt(tag.length - 1);
    const key2 = enc1.encryptBlock(block1);
    const enc2 = new DES(key2);
    const encodedPwd = enc2.decryptBlock(block2);
    for (let i = 0; i < 8; i++) {
        const sym = String.fromCharCode(encodedPwd[i]);
        if (checkRe.test(sym)) {
            pwd += sym;
        } else {
            return undefined;
        }
    }
    return pwd;
}
