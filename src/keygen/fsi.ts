/* eslint-disable no-bitwise */
import { makeSolver } from "./utils";
import { Crc32 } from "./cryptoUtils";

function generateCRC16Table(): number[] {
    let table: number[] = [];
    for (let i = 0, crc = 0; i < 256; i++) {
        crc = (i << 8);
        for (let j = 0; j < 8; j++) {
            crc = (crc << 1);
            if (crc & 0x10000) {
                crc = crc ^ 0x1021;
            }
        }
        table.push(crc & 0xFFFF);
    }
    return table;
}

const crc16Table = generateCRC16Table();

/* For Fujitsu-Siemens. 8 or 5x4 hexadecimal digits. */
function fsiHexKeygen(serial: string): string {

    function hashToString(hash: number) {
        const zero = "0".charCodeAt(0);
        return [12, 8, 4, 0].reduce((acc, num) => {
            let temp = String.fromCharCode(zero + ((hash >> num) % 16) % 10);
            return acc + temp;
        }, "");
    }

    function calculateHash(word: string, table: number[]) {
        let hash = 0;
        for (let i = 0, d = 0; i < word.length; i++) {
            d = table[(word.charCodeAt(i) ^ (hash >> 8)) % 256];
            hash = ((hash << 8) ^ d) & 0xFFFF ;
        }
        return hash;
    }

    if (serial.length === 20) {
        serial = serial.slice(12, 20);
    }

    return hashToString(calculateHash(serial.slice(0, 4), crc16Table)) +
           hashToString(calculateHash(serial.slice(4, 8), crc16Table));
}

function codeToBytes(code: string): number[] {
    const numbers = [
        parseInt(code.slice(0, 5), 10),
        parseInt(code.slice(5, 10), 10),
        parseInt(code.slice(10, 15), 10),
        parseInt(code.slice(15, 20), 10)
    ];
    let acc = [];
    for (let val of numbers) {
        acc.push(val % 256);
        acc.push(Math.floor(val / 256));
    }
    return acc;
}

/* For Fujitsu-Siemens. 5x4 dicimal digits */
function fsi20DecOldKeygen(serial: string): string {

    // opArr - array with that operations do, ar1,ar2 - numbers */
    function interleave(opArr: number[], ar1: number[], ar2: number[]) {
        let arr = opArr.slice(0); // copy array
        arr[ar1[0]] = ((opArr[ar2[0]] >> 4) | (opArr[ar2[3]] << 4)) & 0xFF;
        arr[ar1[1]] = ((opArr[ar2[0]] & 0x0F) | (opArr[ar2[3]] & 0xF0));
        arr[ar1[2]] = ((opArr[ar2[1]] >> 4) | (opArr[ar2[2]] << 4) & 0xFF);
        arr[ar1[3]] = (opArr[ar2[1]] & 0x0F) | (opArr[ar2[2]] & 0xF0);
        return arr;
    }

    function decryptCodeOld(bytes: number[]) {
        const xorKey = ":3-v@e4i";
        // apply XOR key
        bytes.forEach((val, i, arr) => {
            arr[i] = val ^ xorKey.charCodeAt(i);
        });
        // swap two bytes
        [bytes[2], bytes[6]] = [bytes[6], bytes[2]];
        [bytes[3], bytes[7]] = [bytes[7], bytes[3]];
        bytes = interleave(bytes, [0, 1, 2, 3], [0, 1, 2, 3]);
        bytes = interleave(bytes, [4, 5, 6, 7], [6, 7, 4, 5]);
        // final rotations
        bytes[0] = ((bytes[0] << 3) & 0xFF) | (bytes[0] >> 5);
        bytes[1] = ((bytes[1] << 5) & 0xFF) | (bytes[1] >> 3);
        bytes[2] = ((bytes[2] << 7) & 0xFF) | (bytes[2] >> 1);
        bytes[3] = ((bytes[3] << 4) & 0xFF) | (bytes[3] >> 4);
        bytes[5] = ((bytes[5] << 6) & 0xFF) | (bytes[5] >> 2);
        bytes[6] = ((bytes[6] << 1) & 0xFF) | (bytes[6] >> 7);
        bytes[7] = ((bytes[7] << 2) & 0xFF) | (bytes[7] >> 6);
        return bytes.map((b) => (b % 36).toString(36)).join("");
    }

    return decryptCodeOld(codeToBytes(serial));
}

/* For Fujitsu-Simens. 6x4 decimal digits */
function fsi24DecKeygen(serial: string): string {
    const xorKey = "<7#&9?>s";
    const tmp = codeToBytes(serial.slice(4));
    const bytes = [
        (tmp[3] & 0xF0) | (tmp[0] & 0x0F),
        (tmp[2] & 0xF0) | (tmp[1] & 0x0F),
        (tmp[5] & 0xF0) | (tmp[6] & 0x0F),
        (tmp[4] & 0xF0) | (tmp[7] & 0x0F),
        (tmp[7] & 0xF0) | (tmp[4] & 0x0F),
        (tmp[6] & 0xF0) | (tmp[5] & 0x0F),
        (tmp[1] & 0xF0) | (tmp[2] & 0x0F),
        (tmp[0] & 0xF0) | (tmp[3] & 0x0F)
    ];

    bytes.forEach((val, i, arr) => {
        arr[i] = val ^ xorKey.charCodeAt(i);
    });

    bytes[0] = ((bytes[0] << 1) & 0xFF) | (bytes[0] >> 7);
    bytes[1] = ((bytes[1] << 7) & 0xFF) | (bytes[1] >> 1);
    bytes[2] = ((bytes[2] << 2) & 0xFF) | (bytes[2] >> 6);
    bytes[3] = ((bytes[3] << 8) & 0xFF) | (bytes[3] >> 0);
    bytes[4] = ((bytes[4] << 3) & 0xFF) | (bytes[4] >> 5);
    bytes[5] = ((bytes[5] << 6) & 0xFF) | (bytes[5] >> 2);
    bytes[6] = ((bytes[6] << 4) & 0xFF) | (bytes[6] >> 4);
    bytes[7] = ((bytes[7] << 5) & 0xFF) | (bytes[7] >> 3);
    return bytes.map((val) => (val % 36).toString(36)).join("");
}

/* For Fujitsu-Siemens. 5x4 dicimal digits. new */
function fsi20DecNewKeygen(serial: string): string {
    const fKeys = [
        "4798156302", "7201593846", "5412367098", "6587249310",
        "9137605284", "3974018625", "8052974163"
    ];

    return [0, 2, 5, 11, 13, 15, 16].map((val, i) => {
        let temp = parseInt(serial.charAt(val), 10);
        return fKeys[i].charAt(temp);
    }).join("");
}

/* For Fujitsu-Siemens. 6x4 203c-d001-xxxx-xxxx-xxxx-xxxx
 * Based on: https://gitlab.com/polloloco/fujitsu-bios-unlocker/
 */
function fsiHex203Cd001Keygen(serial: string): string[] {
    if (serial.length !== 24) {
        return [];
    }
    serial = serial.toLowerCase();
    if (serial.slice(0, 8) !== "203cd001") {
        return [];
    }
    let crc = new Crc32();
    crc.update(serial.slice(8).split("").map(c => c.charCodeAt(0)));
    // JAMCRC
    const output = ("0".repeat(8) + ((~crc.digest()) >>> 0).toString(16)).slice(-8);
    return [output];
}

export let fsiHexSolver = makeSolver({
    name: "fsiHex",
    description: "Fujitsu-Siemens hexdigits",
    examples: ["DEADBEEF", "AAAA-BBBB-CCCC-DEAD-BEEF"],
    inputValidator: (s) => /^([0-9ABCDEF]{20}|[0-9ABCDEF]{8})$/i.test(s),
    fun: (code: string) => [fsiHexKeygen(code)]
});

export let fsi20DecNewSolver = makeSolver({
    name: "fsiDecNew",
    description: "Fujitsu-Siemens decimal new (5x4)",
    examples: ["1234-4321-1234-4321-1234"],
    inputValidator: (s) => /^\d{20}$/i.test(s),
    fun: (code: string) => [fsi20DecNewKeygen(code)]
});

export let fsi20DecOldSolver = makeSolver({
    name: "fsiDecOld",
    description: "Fujitsu-Siemens decimal old (5x4)",
    examples: ["1234-4321-1234-4321-1234"],
    inputValidator: (s) => /^\d{20}$/i.test(s),
    fun: (code: string) => [fsi20DecOldKeygen(code)]
});

export let fsi24DecSolver = makeSolver({
    name: "fsi24Dec",
    description: "Fujitsu-Siemens decimal old (6x4)",
    examples: ["8F16-1234-4321-1234-4321-1234"],
    inputValidator: (s) => /^[0-9ABCDEF]{4}\d{20}$/i.test(s),
    fun: (code: string) => [fsi24DecKeygen(code)]
});

export let fsi24Hex203cSolver = makeSolver({
    name: "fsi24Hex203c",
    description: "Fujitsu-Siemens Hex (6x4) 203c-d001-xxxx-xxxx-xxxx-xxxx",
    examples: ["203c-d001-0000-001d-e960-227d"],
    inputValidator: (s) => /^[0-9ABCDEF]{24}$/i.test(s),
    fun: (code: string) => fsiHex203Cd001Keygen(code)
});
