/* eslint-disable no-bitwise */
import { makeSolver } from "../utils";
import { blockEncode, TagE7A8Encoder, TagE7A8EncoderSecond } from "./encode";
import { DES, latitude3540Keygen } from "./latitude";
import { DellTag, SuffixType } from "./types";
export { DellTag, SuffixType, DES, latitude3540Keygen };
import { Sha256 } from "../cryptoUtils";

const scanCodes: string =
    "\0\x1B1234567890-=\x08\x09qwertyuiop[]\x0D\xFFasdfghjkl;'`\xFF\\zxcvbnm,./";

const encscans: number[] = [
    0x05, 0x10, 0x13, 0x09, 0x32, 0x03, 0x25, 0x11, 0x1F, 0x17, 0x06, 0x15,
    0x30, 0x19, 0x26, 0x22, 0x0A, 0x02, 0x2C, 0x2F, 0x16, 0x14, 0x07, 0x18,
    0x24, 0x23, 0x31, 0x20, 0x1E, 0x08, 0x2D, 0x21, 0x04, 0x0B, 0x12, 0x2E
];

const asciiPrintable = "012345679abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0";

const extraCharacters: {readonly [P in DellTag]?: string} = {
    "2A7B": asciiPrintable,
    "1F5A": asciiPrintable,
    "1D3B": "0BfIUG1kuPvc8A9Nl5DLZYSno7Ka6HMgqsJWm65yCQR94b21OTp7VFX2z0jihE33d4xtrew0",
    "1F66": "0ewr3d4xtUG1ku0BfIp7VFb21OTSno7KDLZYqsJWa6HMgCQR94m65y9Nl5Pvc8AjihE3X2z0",
    "6FF1": "08rptBxfbGVMz38IiSoeb360MKcLf4QtBCbWVzmH5wmZUcRR5DZG2xNCEv1nFtzsZB2bw1X0",
    "BF97": "0Q2drGk99rkQFMxN[Z5y3DGr16h638myIL2rzz2pzcU7JWLJ1EGnqRN4seZPRM2aBXIjbkGZ"
};

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

    let table = extraCharacters[tag];
    if (table !== undefined) {
        codesTable = table.split("").map((s) => s.charCodeAt(0));
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

function resultToString(arr: number[] | Uint8Array, tag: DellTag): string {
    let r = arr[0] % 9;
    let result = "";
    let table = extraCharacters[tag];
    for (let i = 0; i < 16; i++) {
        if (table !== undefined) {
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
export function keygenDell(serial: string, tag: DellTag, type: SuffixType): string[] {
    let fullSerial: string;
    let encBlock: number[];

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

    function calculateE7A8(block: number[], klass: {encode(data: number[]): number[]}): string {
        // TODO: refactor this
        const table = "Q92G0drk9y63r5DG1hLqJGW1EnRk[QxrFMNZ328I6myLr4MsPNeZR2z72czpzUJBGXbaIjkZ";
        const res = intArrayToByte(klass.encode(block));
        const digest = new Sha256(Uint8Array.from(res));
        const out = digest.digest();
        let out_str = "";
        for (let i = 0; i < 16; i++) {
            out_str += table[(out[i + 16] + out[i]) % table.length];
        }
        return out_str;
    }

    if (tag === DellTag.TagA95B) {

        if (type === SuffixType.ServiceTag) {
            fullSerial = serial + DellTag.Tag595B;
        } else { // HDD
            fullSerial = serial.slice(3) + "\0\0\0" + DellTag.Tag595B;
        }

    } else {
        fullSerial = serial + tag;
    }

    let fullSerialArray: number[] = [];
    // convert string to byte array
    for (let i = 0; i < fullSerial.length; i++) {
        // Maybe protect against unicode symbols with: charCode & 0xFF ?
        fullSerialArray.push(fullSerial.charCodeAt(i));
    }
    if (tag === DellTag.TagE7A8) {
        // TODO: refactor all this
        encBlock = byteArrayToInt(fullSerialArray);
        for (let i = 0; i < 16; i++) {
            if (encBlock[i] === undefined) {
                encBlock[i] = 0;
            }
        }
        const out_str1 = calculateE7A8(encBlock, TagE7A8Encoder);
        const out_str2 = calculateE7A8(encBlock, TagE7A8EncoderSecond);
        let output = [];
        if (out_str1) {
            output.push(out_str1);
        }
        if (out_str2) {
            output.push(out_str2);
        }
        return output;
    }

    fullSerialArray = fullSerialArray.concat(calculateSuffix(fullSerialArray, tag, type));
    const cnt = 23;
    // NOTE: after this array might contain undefined values
    fullSerialArray[cnt] = 0x80;
    encBlock = byteArrayToInt(fullSerialArray);
    // fill empty values with zeros
    for (let i = 0; i < 16; i++) {
        if (encBlock[i] === undefined) {
            encBlock[i] = 0;
        }
    }
    encBlock[14] = cnt << 3;
    let decodedBytes = intArrayToByte(blockEncode(encBlock, tag));
    const outputResult = resultToString(decodedBytes, tag);
    return (outputResult) ? [outputResult] : [];
}

function checkDellTag(tag: string): boolean {
    tag = tag.toUpperCase();
    for (let tagItem in DellTag) {
        if (tag === (DellTag[tagItem as keyof typeof DellTag])) {
            return true;
        }
    }
    return false;
}

export let hddOldSolver = makeSolver({
    name: "dellHDDOld",
    description: "Dell HDD Serial Number (old)",
    examples: ["12345678901"],
    inputValidator: (s) => s.length === 11,
    fun: (s) => [keygenHddOld(s)]
});

export let dellSolver = makeSolver({
    name: "dellTag",
    description: "Dell from serial number",
    examples: ["1234567-595B", "1234567-1D3B"],
    inputValidator: (password: string) => {
        if (password.length !== 11) {
            return false;
        } else {
            return checkDellTag(password.slice(7, 11));
        }
    },
    fun: (password: string) => {
        const suffix = password.slice(7, 11).toUpperCase();
        return keygenDell(password.slice(0, 7).toUpperCase(), suffix as DellTag, SuffixType.ServiceTag);
    }
});

export let dellHddSolver = makeSolver({
    name: "dellHddNew",
    description: "Dell from hdd serial number",
    examples: ["1234567890A-595B"],
    inputValidator: (password: string) => {
        if (password.length !== 15) {
            return false;
        } else {
            return checkDellTag(password.slice(11, 15));
        }
    },
    fun: (password: string) => {
        const suffix = password.slice(11, 15).toUpperCase();
        return keygenDell(password.slice(0, 11).toUpperCase(), suffix as DellTag, SuffixType.HDD);
    }
});

const latitude3540RE = /^([0-9A-F]{16})([0-9A-Z]{7})$/i;

// TODO: implement solver with 2 inputs
export let dellLatitude3540Solver = makeSolver({
    name: "dellLatitude3540",
    description: "Dell Latitude 3540",
    examples: ["5F3988D5E0ACE4BF-7QH8602"],
    inputValidator: (pwd) => latitude3540RE.test(pwd),
    fun: (input: string) => {
        const match = latitude3540RE.exec(input);
        if (match && match.length === 3) {
            const output = latitude3540Keygen(match[1], match[2]);
            if (output) {
                return [output];
            }
        }
        return [];
    }
});
