/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-shadow */
import JSBI from "jsbi";

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

export class Crc64 {
    // ECMA 182 0xC96C5795D7870F42
    public static readonly ECMA_POLYNOMIAL = JSBI.BigInt("14514072000185962306");

    private static tableCache: {[key: string]: JSBI[]} = {};

    public readonly polynom: JSBI;

    private table: JSBI[];
    private crc: JSBI;

    constructor(poly: JSBI, table?: JSBI[]) {
        this.polynom = poly;
        if (table && Array.isArray(table)) {
            this.table = table;
        } else {
            this.table = Crc64.getCRC64Table(poly);
        }
        this.crc = JSBI.BigInt(0);
    }

    private static makeTable(poly: JSBI): JSBI[] {
        let table: JSBI[] = [];
        for (let i = 0; i < 256; i++) {
            let crc: JSBI = JSBI.BigInt(i);
            for (let j = 0; j < 8; j++) {
                if (JSBI.EQ(JSBI.bitwiseAnd(crc, JSBI.BigInt(1)), 1)) {
                    crc = JSBI.bitwiseXor(JSBI.signedRightShift(crc, JSBI.BigInt(1)), poly);
                } else {
                    crc = JSBI.signedRightShift(crc, JSBI.BigInt(1));
                }
            }
            table.push(JSBI.asUintN(64, crc));
        }
        return table;
    }
    private static getCRC64Table(poly: JSBI) {
        const key = poly.toString(10);
        const val = Crc64.tableCache[key];
        if (val !== undefined && Array.isArray(val)) {
            return val;
        } else {
            const table = Crc64.makeTable(poly);
            // save only ECMA table
            if (JSBI.EQ(poly, Crc64.ECMA_POLYNOMIAL)) {
                Crc64.tableCache[key] = table;
            }
            return table;
        }
    }

    public reset() {
        this.crc = JSBI.BigInt(0);
    }

    public update(input: Uint8Array | number[]) {
        for (let i = 0; i < input.length; i++) {
            const b = input[i] & 0xFF;
            const index = JSBI.toNumber(JSBI.asUintN(8, JSBI.bitwiseXor(this.crc, JSBI.BigInt(b))));
            const temp = JSBI.bitwiseXor(this.table[index], JSBI.signedRightShift(this.crc, JSBI.BigInt(8)));
            this.crc = JSBI.asUintN(64, temp);
        }
    }

    public digest(): JSBI {
        return this.crc;
    }

    public hexdigest(): string {
        return ("0".repeat(16) + this.digest().toString(16)).slice(-16);
    }
}

export class Sha256 {
    private static readonly SHA256_CONSTANTS: Uint32Array = Uint32Array.from([
        0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
        0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
        0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
        0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
        0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
        0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
        0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
        0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
        0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ]);

    private static readonly SHA256_IV: Uint32Array = Uint32Array.from([
        0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
        0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
    ]);

    private state: Uint32Array;
    private data: Uint8Array;
    private bitlen: JSBI;
    private datalen: number;

    constructor(input?: Uint8Array) {
        this.bitlen = JSBI.BigInt(0);
        this.datalen = 0;
        this.data = new Uint8Array(64);
        this.state = Sha256.SHA256_IV.slice();

        if (input && (input instanceof Uint8Array || Array.isArray(input))) {
            this.update(input);
        }
    }

    public update(input: Uint8Array) {
        for (let i = 0; i < input.length; i++) {
            const b = input[i];
            this.data[this.datalen] = b;
            this.datalen++;

            if (this.datalen >= 64) {
                this.transform();
                this.bitlen = JSBI.add(this.bitlen, JSBI.BigInt(512));
                this.datalen = 0;
            }
        }
    }

    public digest(): Uint8Array {
        let item = this.copy();
        return item.final();
    }

    public hexdigest() {
        return Array.from(this.digest()).map((x) => {
            x = x & 0xFF;
            return (x < 0xf) ? "0" + x.toString(16) : x.toString(16);
        }).join("");
    }

    private transform() {
        let m: Uint32Array = new Uint32Array(64);

        function ROTRIGHT(a: number, b: number): number {
            return (a >>> b) | (a << (32 - b));
        }
        function CH(a: number, b: number, c: number): number {
            return (a & b) ^ (~a & c);
        }
        function MAJ(a: number, b: number, c: number): number {
            return (a & b) ^ (a & c) ^ (b & c);
        }
        function EP0(a: number) {
            return ROTRIGHT(a, 2) ^ ROTRIGHT(a, 13) ^ ROTRIGHT(a, 22);
        }
        function EP1(a: number) {
            return ROTRIGHT(a, 6) ^ ROTRIGHT(a, 11) ^ ROTRIGHT(a, 25);
        }
        function SIG0(a: number): number {
            return ROTRIGHT(a, 7) ^ ROTRIGHT(a, 18) ^ (a >>> 3);
        }
        function SIG1(a: number): number {
            return ROTRIGHT(a, 17) ^ ROTRIGHT(a, 19) ^ (a >>> 10);
        }
        for (let i = 0, j = 0; i < 16; i++, j += 4) {
            m[i] = (this.data[j] << 24) | (this.data[j + 1] << 16) | (this.data[j + 2] << 8) |
                (this.data[j + 3]);
        }
        for (let i = 16; i < 64; i++) {
            m[i] = (SIG1(m[i - 2]) + m[i - 7] + SIG0(m[i - 15]) + m[i - 16]) >>> 0;
        }
        let [a, b, c, d, e, f, g, h] = this.state;
        for (let i = 0; i < 64; i++) {
            const t1 = h + EP1(e) + CH(e, f, g) + Sha256.SHA256_CONSTANTS[i] + m[i];
            const t2 = EP0(a) + MAJ(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + t1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) >>> 0;
        }
        this.state[0] += a;
        this.state[1] += b;
        this.state[2] += c;
        this.state[3] += d;
        this.state[4] += e;
        this.state[5] += f;
        this.state[6] += g;
        this.state[7] += h;
    }

    private copy(): Sha256 {
        let item = new Sha256();
        item.state = this.state.slice();
        item.data = this.data.slice();
        item.bitlen = this.bitlen;
        item.datalen = this.datalen;
        return item;
    }

    private final(): Uint8Array {
        let i = this.datalen & 63;
        if (this.datalen < 56) {
            this.data[i++] = 0x80;
            while (i < 56) {
                this.data[i++] = 0;
            }
        } else {
            this.data[i++] = 0x80;
            while (i < 64) {
                this.data[i++] = 0;
            }
            this.transform();
            for (let i = 0; i < 56; i++) {
                this.data[i] = 0;
            }
        }
        this.bitlen = JSBI.add(this.bitlen, JSBI.BigInt(this.datalen * 8));
        for (let i = 63, j = 0; i >= 56; i--, j += 8) {
            // val = (this.bitlen >> j) & 0xFF
            const val = JSBI.asUintN(8, JSBI.signedRightShift(this.bitlen, JSBI.BigInt(j)));
            this.data[i] = JSBI.toNumber(val);
        }
        this.transform();
        let hash = new Uint8Array(32);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 8; j++) {
                hash[i + j * 4] = (this.state[j] >>> (24 - i * 8)) & 0xFF;
            }
        }
        return hash;
    }
}

export class AES128 {
    // AES128 ECB mode
    private static readonly NB = 4;
    private static readonly NK = 4;
    private static readonly NR = 10;

    private static readonly sbox: Uint8Array = Uint8Array.from([
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
        0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
        0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
        0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
        0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
        0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
        0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
        0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
        0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
        0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
        0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
    ]);

    private static readonly rcon: Uint8Array = Uint8Array.from([
        0x8D, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36, 0x6C, 0xD8, 0xAB, 0x4D, 0x9A
    ]);

    private roundKey: Uint8Array;

    constructor(key: Uint8Array) {
        this.roundKey = AES128.keyExpansion(key);
    }

    private static keyExpansion(key: Uint8Array): Uint8Array {
        if (key.length !== 16) {
            throw new Error("Key should be 16 bytes");
        }

        let roundKey = new Uint8Array(176);
        // first round key is the key itself
        for (let i = 0; i < AES128.NK * 4; i++) {
            roundKey[i] = key[i];
        }
        let temp = new Uint8Array(4);
        // all other round keys generated from previous ones
        for (let i = AES128.NK; i < AES128.NB * (AES128.NR + 1); i++) {
            const k = (i - 1) * 4;
            temp[0] = roundKey[k + 0];
            temp[1] = roundKey[k + 1];
            temp[2] = roundKey[k + 2];
            temp[3] = roundKey[k + 3];

            if (i % AES128.NK === 0) {
                // AES RotWord()
                {
                    const first = temp[0];
                    temp[0] = temp[1];
                    temp[1] = temp[2];
                    temp[2] = temp[3];
                    temp[3] = first;
                }
                // AES SubWord()
                {
                    temp[0] = AES128.sbox[temp[0]];
                    temp[1] = AES128.sbox[temp[1]];
                    temp[2] = AES128.sbox[temp[2]];
                    temp[3] = AES128.sbox[temp[3]];
                }

                temp[0] ^= AES128.rcon[i / AES128.NK];
            }
            {
                const j = i * 4;
                const k = (i - AES128.NK) * 4;
                roundKey[j + 0] = roundKey[k + 0] ^ temp[0];
                roundKey[j + 1] = roundKey[k + 1] ^ temp[1];
                roundKey[j + 2] = roundKey[k + 2] ^ temp[2];
                roundKey[j + 3] = roundKey[k + 3] ^ temp[3];
            }
        }
        return roundKey;
    }

    private static addRoundKey(round: number, state: Uint8Array, roundKey: Uint8Array) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                state[i * 4 + j] ^= roundKey[(round * AES128.NB * 4) + (i * AES128.NB) + j];
                state[i * 4 + j] &= 0xFF;
            }
        }
    }

    private static subBytes(state: Uint8Array) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                state[j * 4 + i] = AES128.sbox[state[j * 4 + i]];
            }
        }
    }

    private static shiftRows(state: Uint8Array) {
        // rotate first row 1 columns to left
        let temp: number = state[0 * 4 + 1];
        state[0 * 4 + 1] = state[1 * 4 + 1];
        state[1 * 4 + 1] = state[2 * 4 + 1];
        state[2 * 4 + 1] = state[3 * 4 + 1];
        state[3 * 4 + 1] = temp;
        // rotate second row 2 columns to left
        temp = state[0 * 4 + 2];
        state[0 * 4 + 2] = state[2 * 4 + 2];
        state[2 * 4 + 2] = temp;
        temp = state[1 * 4 + 2];
        state[1 * 4 + 2] = state[3 * 4 + 2];
        state[3 * 4 + 2] = temp;
        // rotate thirdd row 3 columns to left
        temp = state[0 * 4 + 3];
        state[0 * 4 + 3] = state[3 * 4 + 3];
        state[3 * 4 + 3] = state[2 * 4 + 3];
        state[2 * 4 + 3] = state[1 * 4 + 3];
        state[1 * 4 + 3] = temp;
    }

    private static mixColumns(state: Uint8Array) {
        let tmp1: number;
        let tmp2: number;

        function xtime(x: number): number {
            return (x << 1) ^ (((x >>> 7) & 1) * 0x1B);
        }

        for (let i = 0; i < 4; i++) {
            const t = state[i * 4 + 0];
            tmp1 = state[i * 4 + 0] ^ state[i * 4 + 1] ^ state[i * 4 + 2] ^ state[i * 4 + 3];
            tmp2 = xtime(state[i * 4 + 0] ^ state[i * 4 + 1]);
            state[i * 4 + 0] ^= tmp2 ^ tmp1;
            tmp2 = xtime(state[i * 4 + 1] ^ state[i * 4 + 2]);
            state[i * 4 + 1] ^= tmp2 ^ tmp1;
            tmp2 = xtime(state[i * 4 + 2] ^ state[i * 4 + 3]);
            state[i * 4 + 2] ^= tmp2 ^ tmp1;
            tmp2 = xtime(state[i * 4 + 3] ^ t);
            state[i * 4 + 3] ^= tmp2 ^ tmp1;
        }
    }

    public encryptBlock(input: Uint8Array): Uint8Array {
        if (input.length !== 16) {
            throw new Error("Invalid block length");
        }
        let state = input.slice();
        AES128.addRoundKey(0, state, this.roundKey);
        for (let round = 1; ; round++) {
            AES128.subBytes(state);
            AES128.shiftRows(state);
            if (round === 10) {
                break;
            }
            AES128.mixColumns(state);
            AES128.addRoundKey(round, state, this.roundKey);
        }
        AES128.addRoundKey(AES128.NR, state, this.roundKey);
        return state;
    }
}
