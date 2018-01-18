/* tslint:disable:no-bitwise */
import { makeSolver } from "./utils";

const scanCodes: string =
    "\0\x1B1234567890-=\x08\x09qwertyuiop[]\x0D\xFFasdfghjkl;'`\xFF\\zxcvbnm,./";

const encscans: number[] = [
    0x05, 0x10, 0x13, 0x09, 0x32, 0x03, 0x25, 0x11, 0x1F, 0x17, 0x06, 0x15,
    0x30, 0x19, 0x26, 0x22, 0x0A, 0x02, 0x2C, 0x2F, 0x16, 0x14, 0x07, 0x18,
    0x24, 0x23, 0x31, 0x20, 0x1E, 0x08, 0x2D, 0x21, 0x04, 0x0B, 0x12, 0x2E
];

const extraCharacters: {[key: string]: string} = {
    "2A7B": "012345679abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0",
    "1D3B": "0BfIUG1kuPvc8A9Nl5DLZYSno7Ka6HMgqsJWm65yCQR94b21OTp7VFX2z0jihE33d4xtrew0",
    "1F66": "0ewr3d4xtUG1ku0BfIp7VFb21OTSno7KDLZYqsJWa6HMgCQR94m65y9Nl5Pvc8AjihE3X2z0",
    "6FF1": "08rptBxfbGVMz38IiSoeb360MKcLf4QtBCbWVzmH5wmZUcRR5DZG2xNCEv1nFtzsZB2bw1X0"
};

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

export enum DellTag {
    Tag595B = "595B",
    TagD35B = "D35B",
    Tag2A7B = "2A7B",
    TagA95B = "A95B",
    Tag1D3B = "1D3B",
    Tag6FF1 = "6FF1",
    Tag1F66 = "1F66"
}

export const enum SuffixType {
    ServiceTag,
    HDD
}

/*
 * Does this really work somewhere ?
 * Depends only in first two chars
 * Input: 11 symbols
 */
function keygenHddOld(serial: string): string {
    let serialArr: number[] = serial.split("").map((c) => c.charCodeAt(0));
    // encscans[26], encscans[0xAA % encscans.length]
    let ret: number[] = [49, 49, 49, 49, 49];
    ret.push(serialArr[1] >> 1);
    ret.push((serialArr[1] >> 6) | (serialArr[0] << 2));
    ret.push(serialArr[0] >> 3);
    // lower bits then 5 are never change
    for (let i = 0; i < 8; i++) {
        let r = 0xAA;
        if (ret[i] & 8) {
            r ^= serialArr[1];
        }
        if (ret[i] & 16) {
            r ^= serialArr[0];
        }
        ret[i] = encscans[r % encscans.length];
    }
    return ret.map((c) => scanCodes.charAt(c)).join("");
}

export function calculateSuffix(serial: number[], tag: DellTag, type: SuffixType): number[] {
    let suffix: number[] = [];
    let codesTable: number[];
    let arr1: number[];
    let arr2: number[];

    if (type === SuffixType.ServiceTag) {
        arr1 = [1, 2, 3, 4];
        arr2 = [4, 3, 2];
    } else {
        // SuffixType.HDD
        arr1 = [1, 10, 9, 8];
        arr2 = [8, 9, 10];
    }

    suffix[0] = serial[arr1[3]];
    suffix[1] = (serial[arr1[3]] >> 5) |
                (((serial[arr1[2]] >> 5) | (serial[arr1[2]] << 3)) & 0xF1);
    suffix[2] = serial[arr1[2]] >> 2;
    suffix[3] = (serial[arr1[2]] >> 7) | (serial[arr1[1]] << 1);
    suffix[4] = (serial[arr1[1]] >> 4) | (serial[arr1[0]] << 4);
    suffix[5] = serial[1] >> 1;
    suffix[6] = (serial[1] >> 6) | (serial[0] << 2);
    suffix[7] = serial[0] >> 3;

    // normalize bytes
    suffix.forEach((v, i) => {
        suffix[i] = v & 0xFF;
    });

    if ((tag as string) in extraCharacters) {
        codesTable = extraCharacters[tag as string].split("").map((s) => s.charCodeAt(0));
    } else {
        codesTable = encscans;
    }

    for (let i = 0; i < 8; i++) {
        let r = 0xAA;
        if (suffix[i] & 1) {
            r ^= serial[arr2[0] ];
        }
        if (suffix[i] & 2) {
            r ^= serial[arr2[1]];
        }
        if (suffix[i] & 4) {
            r ^= serial[arr2[2]];
        }
        if (suffix[i] & 8) {
            r ^= serial[1];
        }
        if (suffix[i] & 16) {
            r ^= serial[0];
        }

        suffix[i] = codesTable[r % codesTable.length];
    }

    return suffix;
}

function blockEncode(encBlock: number[], f1: any, f2: any, f3: any, f4: any, f5: any, repeater: number) {
    // reinit each run
    let encData = [ 0x67452301 | 0, 0xEFCDAB89 | 0, 0x98BADCFE | 0, 0x10325476 | 0];

    let A = encData[0] | 0; // For bit alignment
    let B = encData[1] | 0;
    let C = encData[2] | 0;
    let D = encData[3] | 0;

    // TODO: maybe get rid from Math.pow
    function rol(x: number, bitsrot: number): number {
        // n >>> 0 used to convert signed number to unsigned
        return ((x >>> 0) / Math.pow(2, 32 - bitsrot)) |
                (((x >>> 0) << bitsrot) | 0 );
    }
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

function choseEncode(encBlock: number[], tag: DellTag): number[] {

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

function resultToString(arr: number[], tag: DellTag): string {
    let r = arr[0] % 9;
    let result = "";
    for (let i = 0; i < 16; i++) {
        if ((tag as string) in extraCharacters) {
            let table = extraCharacters[tag as string];
            result += table.charAt(arr[i] % table.length);
        } else if (r <= i && result.length < 8) { // 595B, D35B, A95B
            result += scanCodes.charAt(encscans[arr[i] % encscans.length]);
        }
    }
    return result;
}
/*
 * 7 symbols + 4 symbols ( 595B, D35B, 2A7B, A95B, 1D3B etc...)
 * serial -- serial number without tag, 7 symbols for ServiceTag, 11 symbols for HDD
 * tag    -- tag string
 */
export function keygenDell(serial: string, tag: DellTag, type: SuffixType): string {
    let fullSerial: string;

    function byteArrayToInt(arr: number[]): number[] {
        // convert byte array to 32-bit little-endian int array
        // also will convert undefined values to 0
        let resultLength = arr.length >> 2; // divide length to 4
        let result: number[] = [];
        for (let i = 0; i <= resultLength; i++) {
            result[i] = arr[i * 4] | (arr[i * 4 + 1] << 8) |
                        (arr[i * 4 + 2] << 16) | (arr[i * 4 + 3] << 24) | 0;
        }
        return result;
    }

    function intArrayToByte(arr: number[]): number[] {
        // convert 32-bit little-endian array to byte array
        let result: number[] = [];
        arr.forEach((num) => {
            result.push(num & 0xFF);
            result.push((num >> 8) & 0xFF);
            result.push((num >> 16) & 0xFF);
            result.push((num >> 24) & 0xFF);
        });
        return result;
    }

    if (tag === DellTag.TagA95B) {

        if (type === SuffixType.ServiceTag) {
            fullSerial = serial + DellTag.Tag595B as string;
        } else { // HDD
            fullSerial = serial.slice(3) + "\0\0\0" + DellTag.Tag595B as string;
        }

    } else {
        fullSerial = serial + tag as string;
    }

    let fullSerialArray: number[] = [];
    // convert string to byte array
    for (let i = 0; i < fullSerial.length; i++) {
        // Maybe protect against unicode symbols with: charCode & 0xFF ?
        fullSerialArray.push(fullSerial.charCodeAt(i));
    }

    fullSerialArray = fullSerialArray.concat(calculateSuffix(fullSerialArray, tag, type));
    const cnt = 23;
    // NOTE: after this array might contain undefined values
    fullSerialArray[cnt] = 0x80;
    let encBlock = byteArrayToInt(fullSerialArray);
    // fill empty values with zeros
    for (let i = 0; i < 16; i++) {
        if (encBlock[i] === undefined) {
            encBlock[i] = 0;
        }
    }
    encBlock[14] = cnt << 3;
    let decodedBytes = intArrayToByte(choseEncode(encBlock, tag));
    return resultToString(decodedBytes, tag);
}

export let hddOldSolver = makeSolver({
    name: "Dell HDD Serial Number (old)",
    examples: ["12345678901"],
    inputValidator: (s) => s.length === 11,
    fun: (s) => [keygenHddOld(s)]
});
