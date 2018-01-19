/* tslint:disable:no-bitwise */
import { DellTag } from "./types";

const md5magic = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x4881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
].map((v) => v | 0);

const md5magic2 = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039
].map((v) => v | 0);

// TODO: maybe get rid from Math.pow
function rol(x: number, bitsrot: number): number {
    // n >>> 0 used to convert signed number to unsigned
    // (unsigned(x) >> (32 - bitsrot)) | (unsigned(x) << bitsrot);
    return ((x >>> 0) / Math.pow(2, 32 - bitsrot)) | (((x >>> 0) << bitsrot) | 0 );
}

function blockEncode(encBlock: number[], f1: any, f2: any, f3: any, f4: any, f5: any, repeater: number) {
    // reinit each run
    let encData = [ 0x67452301 | 0, 0xEFCDAB89 | 0, 0x98BADCFE | 0, 0x10325476 | 0];

    let A = encData[0] | 0; // For bit alignment
    let B = encData[1] | 0;
    let C = encData[2] | 0;
    let D = encData[3] | 0;

    function f_shortcut(func: any, key: number, num: number): number {
        return (A + f1(func, B, C , D, md5magic[num] + encBlock[ key ])) | 0;
    }
    function f_shortcut2(func: any, key: number, num: number): number {
        return (A + f1(func, B, C, D, md5magic2[num] + encBlock[key])) | 0;
    }

    const S = [ [ 7, 12, 17, 22 ],
                [ 5, 9,  14, 20 ],
                [ 4, 11, 16, 23 ],
                [ 6, 10, 15, 21 ] ];
    let t: number = 0;

    for (let j = 0; j <= repeater; j++) {
        if (repeater === 16) {          // 1f66
            A |= 0x100097;
            B ^= 0xA0008;
            C |= 0x60606161 - j;
            D ^= 0x50501010 + j;
            for (let i = 0; i < 64; i++) {
                switch (i >> 4) {
                    case 0:
                        t = f_shortcut2(f2, i & 15, i + 16 | 0);
                        break;
                    case 1:
                        t = f_shortcut2(f3, (i * 5 + 1) & 15, i + 32 | 0);
                        break;
                    case 2:
                        t = f_shortcut2(f4, (i * 3 + 5) & 15, i - 2 * (i & 12) + 12);
                        break;
                    case 3:
                        t = f_shortcut2(f5, (i * 7) & 15, 2 * (i & 3) - (i & 15) + 12);
                        break;
                }
                A = D, D = C, C = B, B = rol(t, S[i >> 4][i & 3]) + B | 0;
            }

        } else if (repeater === 22) {
            A |= 0xA08097;
            B ^= 0xA010908;
            C |= 0x60606161 - j;
            D ^= 0x50501010 + j;

            for (let i = 0; i < 64; i++) {
                let k = (i & 15) - ((i & 12) << 1) + 12;
                switch (i >> 4) {
                    case 0:
                        t = f_shortcut2(f2, i & 15, i + 32 | 0);
                        break;
                    case 1:
                        t = f_shortcut2(f3, (i * 5 + 1) & 15, (i & 15) | 0);
                        break;
                    case 2:
                        t = f_shortcut2(f4, (i * 3 + 5) & 15, k + 16 | 0);
                        break;
                    case 3:
                        t = f_shortcut2(f5, (i * 7) & 15, k + 48 | 0);
                        break;
                }
                A = D, D = C, C = B, B = rol(t, S[i >> 4][i & 3]) + B | 0;
            }
        } else {
            if (repeater) {
                A |= 0x97;
                B ^= 0x8;
                C |= (0x60606161 - j);
                D ^= (0x50501010 + j);
            }
            for (let i = 0; i < 64; i++) {
                switch (i >> 4) {
                    case 0:
                        t = f_shortcut(f2, i & 15, i); // Use half byte
                        break;
                    case 1:
                        t = f_shortcut(f3, (i * 5 + 1) & 15, i);
                        break;
                    case 2:
                        t = f_shortcut(f4, (i * 3 + 5) & 15, i);
                        break;
                    case 3:
                        t = f_shortcut(f5, (i * 7) & 15, i);
                        break;
                }
                A = D, D = C, C = B, B = (rol(t, S[i >> 4][i & 3]) + B) | 0;
            }
        }
        encData[0] += A;
        encData[1] += B;
        encData[2] += C;
        encData[3] += D;
    }
    if (repeater === 16) { // 1F66
        for (let j = 0; j <= 20; j++) { // 1D3B
            A |= 0x97;
            B ^= 0x8;
            C |= 0x50501010 - j;
            D ^= 0x60606161 + j;

            for (let i = 0; i < 64; i++) {
                switch (i >> 4) {
                    case 0:
                        t = f_shortcut2(f4, (i * 3 + 5) & 15, 2 * (i & 3) - i + 44);
                        break;
                    case 1:
                        t = f_shortcut2(f5, (i * 7) & 15, 2 * (i & 3) - i + 76);
                        break;
                    case 2:
                        t = f_shortcut2(f2, i & 15, (i & 15) | 0);
                        break;
                    case 3:
                        t = f_shortcut2(f3, (i * 5 + 1) & 15, i - 32 | 0);
                        break;
                }
                let g = (i >> 4) + 2;
                A = D, D = C, C = B, B = rol(t, S[g & 3][i & 3]) + B | 0;
            }

            encData[0] += A;
            encData[1] += B;
            encData[2] += C;
            encData[3] += D;
        }
    } else if (repeater === 22) {
        for (let j = 0; j <= 16; j++) {
            A |= 0x100097;
            B ^= 0xA0008;
            C |= 0x50501010 - j;
            D ^= 0x60606161 + j;

            for (let i = 0; i < 64; i++) {
                let k = (i & 15) - ((i & 12) << 1) + 12;
                switch (i >> 4) {
                    case 0:
                        t = f_shortcut2(f4, ((i & 15) * 3 + 5) & 15, k + 16);
                        break;
                    case 1:
                        t = f_shortcut2(f5, ((i & 3) * 7 + (i & 12) + 4) & 15, (i & 15) + 32);
                        break;
                    case 2:
                        t = f_shortcut2(f2, k & 15, k);
                        break;
                    case 3:
                        t = f_shortcut2(f3, ((i & 15) * 5 + 1) & 15, (i & 15) + 48);
                        break;
                }
                let g = (i >> 4) + 2;
                A = D, D = C, C = B, B = rol(t, S[g & 3][i & 3]) + B | 0;
            }

            encData[0] += A;
            encData[1] += B;
            encData[2] += C;
            encData[3] += D;
        }
    }
    return encData.map((v) => v | 0);
}

function encF2(num1: number, num2: number, num3: number): number {
    return ((( num3 ^ num2) & num1) ^ num3);
}

function encF3(num1: number, num2: number, num3: number): number {
    return (((num1 ^ num2) & num3) ^ num2);
}

function encF4(num1: number, num2: number, num3: number): number {
    return (( num2 ^ num1) ^ num3);
}

function encF5(num1: number, num2: number, num3: number): number {
    return (( num1 | ~num3) ^ num2);
}

function encF1(func: any, num1: number, num2: number, num3: number, key: number) {
    return (func(num1, num2, num3) + key) | 0; // For bit alignment
}

// Negative functions
function encF1N(func: any, num1: number, num2: number, num3: number, key: number) {
    return encF1(func, num1, num2, num3, -key);
}
function encF2N(num1: number, num2: number, num3: number) {
    return encF2(num1, num2, ~num3);
}

function encF4N(num1: number, num2: number, num3: number) {
    return encF4(num1, ~num2, num3);
}

function encF5N(num1: number, num2: number, num3: number) {
    return encF5(~num1, num2, num3);
}

export function choseEncode(encBlock: number[], tag: DellTag): number[] {

    /* Main part */
    if (tag === DellTag.TagD35B) {
        return blockEncode(encBlock, encF1, encF2, encF3, encF4, encF5, 0);
    } else if (tag === DellTag.Tag1D3B) {
        return blockEncode(encBlock, encF1N, encF2N, encF3, encF4N, encF5N, 20);
    } else if (tag === DellTag.Tag1F66) {
        return blockEncode(encBlock, encF1N, encF2N, encF3, encF4N, encF5N, 16);
    } else if (tag === DellTag.Tag6FF1) {
        return blockEncode(encBlock, encF1N, encF2N, encF3, encF4N, encF5N, 22);
    } else {
        return blockEncode(encBlock, encF1N, encF2N, encF3, encF4N, encF5N, 0);
    }
}
