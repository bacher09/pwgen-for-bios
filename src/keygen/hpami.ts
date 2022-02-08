/* eslint-disable no-bitwise */
import { makeSolver } from "./utils";

export class Crc32 {

    public static readonly IEEE_POLYNOMIAL = 0xEDB88320;
    private static tableCache: {[key: string]: Uint32Array} = {};

    private table: Uint32Array;
    private crc: number;

    constructor(poly?: number) {
        if (poly === undefined) {
            poly = Crc32.IEEE_POLYNOMIAL;
        }
        this.table = Crc32.getCRC32Table(poly);
        this.crc = 0;
    }

    private static makeTable(poly: number): Uint32Array {
        let crcTable = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let crc = i;
            for (let j = 0; j < 8; j++) {
                crc = (crc & 1) ? (poly ^ (crc >>> 1)) : (crc >>> 1);
            }
            crcTable[i] = crc;
        }
        return crcTable;
    }

    private static getCRC32Table(poly: number): Uint32Array {
        const key = poly.toString(10);
        const val = Crc32.tableCache[key];
        if (val !== undefined && val instanceof Uint32Array) {
            return val;
        } else {
            const table = Crc32.makeTable(poly);
            // save only IEEE table
            if (poly === Crc32.IEEE_POLYNOMIAL) {
                Crc32.tableCache[key] = table;
            }
            return table;
        }
    }

    public reset() {
        this.crc = 0;
    }

    public update(input: Uint8Array | number[]) {
        this.crc ^= -1;

        for (let i = 0; i < input.length; i++) {
            const b = input[i] & 0xFF;
            const index = (this.crc ^ b) & 0xFF;
            this.crc = (this.crc >>> 8) ^ this.table[index];
        }

        this.crc = ((this.crc ^ (-1)) >>> 0);
    }

    public digest(): number {
        return this.crc;
    }

    public hexdigest(): string {
        return ("0".repeat(8) + this.digest().toString(16)).slice(-8);
    }
}

function hpAmiKeygen(input: string): string | undefined {
    if (input.length !== 8) {
        return undefined;
    }

    const salt = Uint8Array.from([
        0xb9, 0xed, 0xf5, 0x69, 0x9d, 0x16, 0x49, 0xf9,
        0x8c, 0x5f, 0x7c, 0xb3, 0x68, 0x3c, 0xd4, 0xa7
    ]);

    const backdoor = parseInt(input, 16);
    let temp = new Uint8Array(20);
    let crc = new Crc32();
    for (let i = 0; i < 0x10; i++) {
        temp[i] = salt[i] ^ 0x36;
    }
    // pack value in little-endian format
    temp[0x10] = backdoor & 0xFF;
    temp[0x11] = (backdoor >>> 8) & 0xFF;
    temp[0x12] = (backdoor >>> 16) & 0xFF;
    temp[0x13] = (backdoor >>> 24) & 0xFF;
    crc.update(temp);
    const next = crc.digest();

    for (let i = 0; i < 0x10; i++) {
        temp[i] = salt[i] ^ 0x5C;
    }
    // pack value in little-endian format
    temp[0x10] = next & 0xFF;
    temp[0x11] = (next >>> 8) & 0xFF;
    temp[0x12] = (next >>> 16) & 0xFF;
    temp[0x13] = (next >>> 24) & 0xFF;
    crc.reset();
    crc.update(temp);
    return crc.hexdigest();
}

export let hpAMISolver = makeSolver({
    name: "hpAMI",
    description: "HP AMI",
    examples: ["A7AF422F"],
    inputValidator: (s) => /^[0-9ABCDEF]{8}$/i.test(s),
    fun: (input: string) => {
        const output = hpAmiKeygen(input);
        return (output) ? [output] : [];
    }
});
