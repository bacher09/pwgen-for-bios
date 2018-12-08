import { makeSolver } from "./utils";
/* tslint:disable:no-bitwise */

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

/* For Fujinsu-Siemens. 8 or 5x4 hexadecimal digits. */
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

/* For Fujinsu-Siemens. 5x4 dicimal digits */
function fsi20DecOldKeygen(serial: string): string {

    function swap<T>(arr: T[], i1: number, i2: number): void {
        const temp = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = temp;
    }
    // opArr - array with that operations do, ar1,ar2 - numbers */
    function interleave(opArr: number[], ar1: number[], ar2: number[]) {
        let arr = opArr.slice(0); // copy array
        arr[ar1[0]] = ((opArr[ar2[0]] >> 4) | (opArr[ar2[3]] << 4)) & 0xFF;
        arr[ar1[1]] = ((opArr[ar2[0]] & 0x0F) | (opArr[ar2[3]] & 0xF0));
        arr[ar1[2]] = ((opArr[ar2[1]] >> 4) | (opArr[ar2[2]] << 4) & 0xFF);
        arr[ar1[3]] = (opArr[ar2[1]] & 0x0F) | (opArr[ar2[2]] & 0xF0);
        return arr;
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

    function decryptCode_old(bytes: number[]) {
        const xorKey = ":3-v@e4i";
        // apply XOR key
        bytes.forEach((val, i, arr) => {
            arr[i] = val ^ xorKey.charCodeAt(i);
        });
        // swap two bytes
        swap(bytes, 2, 6);
        swap(bytes, 3, 7);
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
        // len(solution space) = 10 + 26
        bytes = bytes.map((b) => b % 36);
        return bytes.map((sbyte) => (sbyte > 9 )
            ? String.fromCharCode("a".charCodeAt(0) + sbyte - 10)
            : String.fromCharCode("0".charCodeAt(0) + sbyte)
        ).join("");
    }

    return decryptCode_old(codeToBytes(serial));
}

/* For Fujinsu-Siemens. 5x4 dicimal digits. new */
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

/* 
 * For Fujinsu-Siemens. 6x4 dicimal digits 
 * Original Python Code Copyright 2009:  dogbert <dogber1@gmail.com>
 */
function fsi24DecKeygen(serial: string): string {
    const XORkey = "<7#&9?>s";

    function codeToBytes(code: string): number[] {
        let numbers: number[] = [Number(code.substring(0, 4)), Number(code.substring(5, 8)), Number(code.substring(9, 12)),
            Number(code.substring(13, 16)), Number(code.substring(17, 20)), Number(code.substring(21, 24))];

        let bytes: number[] = [];
        for (let i of numbers) {
            bytes.push(i % 256);
            bytes.push(i / 256);
        }
  
        return bytes;
    }

    function byteToChar(byte: number) {
        if (byte > 9) {
            return String.fromCharCode(('a').charCodeAt(0) + byte - 10)
        }
        else {
            return String.fromCharCode(('0').charCodeAt(0) + byte);
        }
    }

    function decryptCode(bytes: number[]): string {
        // swap two bytes
        // bytes[2], bytes[6] = bytes[6], bytes[2]
        // bytes[3], bytes[7] = bytes[7], bytes[3]

        // interleave the nibbles
        bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7] = ((bytes[3] & 0xF0) | (bytes[0] & 0x0F), (bytes[2] & 0xF0) | (bytes[1] & 0x0F), (bytes[5] & 0xF0) | (bytes[6] & 0x0F), (bytes[4] & 0xF0) | (bytes[7] & 0x0F), (bytes[7] & 0xF0) | (bytes[4] & 0x0F), (bytes[6] & 0xF0) | (bytes[5] & 0x0F), (bytes[1] & 0xF0) | (bytes[2] & 0x0F), (bytes[0] & 0xF0) | (bytes[3] & 0x0F))

        // apply XOR key
        for (let i in bytes) {
            bytes[i] = bytes[i] ^ XORkey[i].charCodeAt(0);
        }

        // final rotations
        bytes[0] = ((bytes[0] << 1) & 0xFF) | (bytes[0] >> 7)
        bytes[1] = ((bytes[1] << 7) & 0xFF) | (bytes[1] >> 1)
        bytes[2] = ((bytes[2] << 2) & 0xFF) | (bytes[2] >> 6)
        bytes[3] = ((bytes[3] << 8) & 0xFF) | (bytes[3] >> 0)
        bytes[4] = ((bytes[4] << 3) & 0xFF) | (bytes[4] >> 5)
        bytes[5] = ((bytes[5] << 6) & 0xFF) | (bytes[5] >> 2)
        bytes[6] = ((bytes[6] << 4) & 0xFF) | (bytes[6] >> 4)
        bytes[7] = ((bytes[7] << 5) & 0xFF) | (bytes[7] >> 3)

        // len(solution space) = 10 + 26
        for (let x in bytes) {
            bytes[x] = bytes[x] % 36;
        }

        let masterPwd: string = "";
        for (let j of bytes) {
            masterPwd += byteToChar(j);
        }
            
        return masterPwd
    }

    return decryptCode(codeToBytes(serial));
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
    description: "Fujitsu-Siemens decimal new",
    examples: ["1234-4321-1234-4321-1234"],
    inputValidator: (s) => /^\d{20}$/i.test(s),
    fun: (code: string) => [fsi20DecNewKeygen(code)]
});

export let fsi20DecOldSolver = makeSolver({
    name: "fsiDecOld",
    description: "Fujitsu-Siemens decimal old",
    examples: ["1234-4321-1234-4321-1234"],
    inputValidator: (s) => /^\d{20}$/i.test(s),
    fun: (code: string) => [fsi20DecOldKeygen(code)]
});

export let fsi24DecSolver = makeSolver({
    name: "fsi24Dec",
    description: "Fujitsu-Siemens decimal 6x4",
    examples: ["1234-4321-1234-4321-1234-2351"],
    inputValidator: (s) => /^\d{20}$/i.test(s),
    fun: (code: string) => [fsi24DecKeygen(code)]
});