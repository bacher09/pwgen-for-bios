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

const rotationTable = [
    [7, 12, 17, 22],
    [5, 9,  14, 20],
    [4, 11, 16, 23],
    [6, 10, 15, 21]
];

const initialData = [
    0x67452301 | 0,
    0xEFCDAB89 | 0,
    0x98BADCFE | 0,
    0x10325476 | 0
];

type SumFunction = (a: number, b: number) => number;
type EncFunction = (a: number, b: number, c: number) => number;
interface Encoder {
    encode(data: number[]): number[];
}

function rol(x: number, bitsrot: number): number {
    // n >>> 0 used to convert signed number to unsigned
    // (unsigned(x) >> (32 - bitsrot)) | (unsigned(x) << bitsrot);
    return ((x >>> 0) / Math.pow(2, 32 - bitsrot)) | (((x >>> 0) << bitsrot) | 0 );
}

function encF2(num1: number, num2: number, num3: number): number {
    return ((num3 ^ num2) & num1) ^ num3;
}

function encF3(num1: number, num2: number, num3: number): number {
    return ((num1 ^ num2) & num3) ^ num2;
}

function encF4(num1: number, num2: number, num3: number): number {
    return (num2 ^ num1) ^ num3;
}

function encF5(num1: number, num2: number, num3: number): number {
    return (num1 | ~num3) ^ num2;
}

function encF1(num1: number, num2: number): number {
    return (num1 + num2) | 0;
}

// Negative functions
function encF1N(num1: number, num2: number): number {
    return (num1 - num2) | 0;
}

function encF2N(num1: number, num2: number, num3: number): number {
    return encF2(num1, num2, ~num3);
}

function encF4N(num1: number, num2: number, num3: number): number {
    return encF4(num1, ~num2, num3);
}

function encF5N(num1: number, num2: number, num3: number): number {
    return encF5(~num1, num2, num3);
}

class Tag595BEncoder {
    protected encBlock: number[];
    protected encData: number[];
    protected A: number;
    protected B: number;
    protected C: number;
    protected D: number;
    protected f1: SumFunction = encF1N;
    protected f2: EncFunction = encF2N;
    protected f3: EncFunction = encF3;
    protected f4: EncFunction = encF4N;
    protected f5: EncFunction = encF5N;
    protected md5table: number[] = md5magic;

    constructor(encBlock: number[]) {
        this.encBlock = encBlock;
        this.encData = initialData.slice();
        this.A = this.encData[0];
        this.B = this.encData[1];
        this.C = this.encData[2];
        this.D = this.encData[3];
    }

    protected calculate(func: EncFunction, key1: number, key2: number): number {
        let temp = func(this.B, this.C, this.D);
        return this.A + this.f1(temp, this.md5table[key2] + this.encBlock[key1]) | 0;
    }

    protected incrementData() {
        this.encData[0] += this.A;
        this.encData[1] += this.B;
        this.encData[2] += this.C;
        this.encData[3] += this.D;

        this.encData.forEach((val, index) => {
            this.encData[index] = val | 0;
        });
    }

    public makeEncode(): void {
        let t: number = 0;
        for (let i = 0; i < 64; i++) {
            switch (i >> 4) {
                case 0:
                    t = this.calculate(this.f2, i & 15, i); // Use half byte
                    break;
                case 1:
                    t = this.calculate(this.f3, (i * 5 + 1) & 15, i);
                    break;
                case 2:
                    t = this.calculate(this.f4, (i * 3 + 5) & 15, i);
                    break;
                case 3:
                    t = this.calculate(this.f5, (i * 7) & 15, i);
                    break;
            }
            this.A = this.D;
            this.D = this.C;
            this.C = this.B;
            this.B = rol(t, rotationTable[i >> 4][i & 3]) + this.B | 0;
        }

        this.incrementData();
    }

    public result(): number[] {
        return this.encData.map((v) => v | 0);
    }

    public static encode(encBlock: number[]): number[] {
        let obj = new this(encBlock);
        obj.makeEncode();
        return obj.result();
    }
}

class TagD35BEncoder extends Tag595BEncoder {
    protected f1 = encF1;
    protected f2 = encF2;
    protected f3 = encF3;
    protected f4 = encF4;
    protected f5 = encF5;
}

class Tag1D3BEncoder extends Tag595BEncoder {
    protected f1 = encF1N;
    protected f2 = encF2N;
    protected f3 = encF3;
    protected f4 = encF4N;
    protected f5 = encF5N;

    public makeEncode(): void {
        for (let j = 0; j < 21; j++) {
            this.A |= 0x97;
            this.B ^= 0x8;
            this.C |= 0x60606161 - j;
            this.D ^= 0x50501010 + j;
            super.makeEncode();
        }
    }
}

class Tag1F66Encoder extends Tag595BEncoder {
    protected f1 = encF1N;
    protected f2 = encF2N;
    protected f3 = encF3;
    protected f4 = encF4N;
    protected f5 = encF5N;
    protected md5table = md5magic2;

    public makeEncode(): void {
        let t: number = 0;

        for (let j = 0; j < 17; j++) {
            this.A |= 0x100097;
            this.B ^= 0xA0008;
            this.C |= 0x60606161 - j;
            this.D ^= 0x50501010 + j;

            for (let i = 0; i < 64; i++) {
                switch (i >> 4) {
                    case 0:
                        t = this.calculate(this.f2, i & 15, i + 16 | 0);
                        break;
                    case 1:
                        t = this.calculate(this.f3, (i * 5 + 1) & 15, i + 32 | 0);
                        break;
                    case 2:
                        t = this.calculate(this.f4, (i * 3 + 5) & 15, i - 2 * (i & 12) + 12);
                        break;
                    case 3:
                        t = this.calculate(this.f5, (i * 7) & 15, 2 * (i & 3) - (i & 15) + 12);
                        break;
                }
                this.A = this.D;
                this.D = this.C;
                this.C = this.B;
                this.B = rol(t, rotationTable[i >> 4][i & 3]) + this.B | 0;
            }

            this.incrementData();
        }

        for (let j = 0; j < 21; j++) {

            this.A |= 0x97;
            this.B ^= 0x8;
            this.C |= 0x50501010 - j;
            this.D ^= 0x60606161 + j;

            for (let i = 0; i < 64; i++) {
                switch (i >> 4) {
                    case 0:
                        t = this.calculate(this.f4, (i * 3 + 5) & 15, 2 * (i & 3) - i + 44);
                        break;
                    case 1:
                        t = this.calculate(this.f5, (i * 7) & 15, 2 * (i & 3) - i + 76);
                        break;
                    case 2:
                        t = this.calculate(this.f2, i & 15, (i & 15) | 0);
                        break;
                    case 3:
                        t = this.calculate(this.f3, (i * 5 + 1) & 15, i - 32 | 0);
                        break;
                }
                let g = (i >> 4) + 2;
                this.A = this.D;
                this.D = this.C;
                this.C = this.B;
                this.B = rol(t, rotationTable[g & 3][i & 3]) + this.B | 0;
            }

            this.incrementData();
        }
    }
}

class Tag6FF1Encoder extends Tag595BEncoder {
    protected f1 = encF1N;
    protected f2 = encF2N;
    protected f3 = encF3;
    protected f4 = encF4N;
    protected f5 = encF5N;
    protected md5table = md5magic2;

    public makeEncode(): void {
        let t: number = 0;

        for (let j = 0; j < 23; j++) {
            this.A |= 0xA08097;
            this.B ^= 0xA010908;
            this.C |= 0x60606161 - j;
            this.D ^= 0x50501010 + j;

            for (let i = 0; i < 64; i++) {
                let k = (i & 15) - ((i & 12) << 1) + 12;
                switch (i >> 4) {
                    case 0:
                        t = this.calculate(this.f2, i & 15, i + 32 | 0);
                        break;
                    case 1:
                        t = this.calculate(this.f3, (i * 5 + 1) & 15, (i & 15) | 0);
                        break;
                    case 2:
                        t = this.calculate(this.f4, (i * 3 + 5) & 15, k + 16 | 0);
                        break;
                    case 3:
                        t = this.calculate(this.f5, (i * 7) & 15, k + 48 | 0);
                        break;
                }
                this.A = this.D;
                this.D = this.C;
                this.C = this.B;
                this.B = rol(t, rotationTable[i >> 4][i & 3]) + this.B | 0;
            }

            this.incrementData();
        }

        for (let j = 0; j < 17; j++) {
            this.A |= 0x100097;
            this.B ^= 0xA0008;
            this.C |= 0x50501010 - j;
            this.D ^= 0x60606161 + j;

            for (let i = 0; i < 64; i++) {
                let k = (i & 15) - ((i & 12) << 1) + 12;
                switch (i >> 4) {
                    case 0:
                        t = this.calculate(this.f4, ((i & 15) * 3 + 5) & 15, k + 16);
                        break;
                    case 1:
                        t = this.calculate(this.f5, ((i & 3) * 7 + (i & 12) + 4) & 15, (i & 15) + 32);
                        break;
                    case 2:
                        t = this.calculate(this.f2, k & 15, k);
                        break;
                    case 3:
                        t = this.calculate(this.f3, ((i & 15) * 5 + 1) & 15, (i & 15) + 48);
                        break;
                }
                let g = (i >> 4) + 2;
                this.A = this.D;
                this.D = this.C;
                this.C = this.B;
                this.B = rol(t, rotationTable[g & 3][i & 3]) + this.B | 0;
            }

            this.incrementData();
        }
    }
}

const encoders: {readonly [P in DellTag]: Encoder} = {
    "595B": Tag595BEncoder,
    "2A7B": Tag595BEncoder, // same as 595B
    "A95B": Tag595BEncoder, // same as 595B
    "1D3B": Tag1D3BEncoder,
    "D35B": TagD35BEncoder,
    "1F66": Tag1F66Encoder,
    "6FF1": Tag6FF1Encoder
};

export function blockEncode(encBlock: number[], tag: DellTag): number[] {
    return encoders[tag].encode(encBlock);
}
