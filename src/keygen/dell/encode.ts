/* eslint-disable no-bitwise  */
import { DellTag } from "./types";

const md5magic = Uint32Array.from([
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
]);

const md5magic2 = Uint32Array.from([
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
]);

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

// Maybe optimize ? return (((param2 >>> (0x20 - param7))) | (param2 << param7)) + num1;
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
    protected readonly md5table: Uint32Array = md5magic;

    constructor(encBlock: number[]) {
        this.encBlock = encBlock;
        this.encData = this.initialData();
        this.A = this.encData[0];
        this.B = this.encData[1];
        this.C = this.encData[2];
        this.D = this.encData[3];
    }

    public static encode(encBlock: number[]): number[] {
        let obj = new this(encBlock);
        obj.makeEncode();
        return obj.result();
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
        return this.encData.map((v) => (v | 0) >>> 0);
    }

    protected initialData(): number[] {
        return initialData.slice();
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
}

class TagD35BEncoder extends Tag595BEncoder {
    protected f1 = encF1;
    protected f2 = encF2;
    protected f3 = encF3;
    protected f4 = encF4;
    protected f5 = encF5;
}

class Tag1D3BEncoder extends Tag595BEncoder {

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
    protected md5table = md5magic2;

    protected counter1: number = 23;

    public makeEncode(): void {
        let t: number = 0;

        for (let j = 0; j < this.counter1; j++) {
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

class Tag1F5AEncoder extends Tag595BEncoder {
    protected readonly md5table = md5magic2;

    public makeEncode(): void {
        let t: number = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 64; j++) {
                let k = 12 + (j & 3) - (j & 12);
                switch (j >> 4) {
                    case 0:
                        t = this.calculate(this.f2, j & 15, j);
                        break;
                    case 1:
                        t = this.calculate(this.f3, (j * 5 + 1) & 15, j);
                        break;
                    case 2:
                        t = this.calculate(this.f4, (j * 3 + 5) & 15, k + 0x20);
                        break;
                    case 3:
                        t = this.calculate(this.f5, (j * 7) & 15, k + 0x30);
                        break;
                }
                this.B = this.D;
                this.D = this.A;
                this.A = this.C;
                this.C = rol(t, rotationTable[j >> 4][j & 3]) + this.C | 0;
            }

            this.incrementData();
        }
    }

    protected incrementData() {
        this.encData[0] += this.B;
        this.encData[1] += this.C;
        this.encData[2] += this.A;
        this.encData[3] += this.D;

        this.encData.forEach((val, index) => {
            this.encData[index] = val | 0;
        });
    }

    protected calculate(func: EncFunction, key1: number, key2: number): number {
        let temp = func(this.C, this.A, this.D);
        return this.B + this.f1(temp, this.md5table[key2] + this.encBlock[key1]) | 0;
    }
}

class TagBF97Encoder extends Tag6FF1Encoder {
    protected counter1 = 31;
}

export class TagE7A8Encoder extends Tag595BEncoder {
    protected readonly md5table = md5magic2;

    protected readonly loopParams = [17, 13, 12, 8];

    protected readonly encodeParams = Uint32Array.from([
        0x50501010, 0xA010908, 0xA08097, 0x60606161,
        0x60606161, 0xA0008, 0x100097, 0x50501010
    ]);

    public makeEncode(): void {

        for (let p = 0; p < this.loopParams[0]; p++) {
            this.A |= this.encodeParams[0];
            this.B ^= this.encodeParams[1];
            this.C |= this.encodeParams[2] - p;
            this.D ^= this.encodeParams[3] + p;

            for (let j = 0; j < this.loopParams[2]; j += 4) {
                this.shortcut(this.f2, j, j + 32, 0, [0, 1, 2, 3]);
            }

            for (let j = 0; j < this.loopParams[2]; j += 4) {
                this.shortcut(this.f3, j, j, 1, [1, -2, -1, 0]);
            }

            for (let j = this.loopParams[3]; j > 3; j -= 4) {
                this.shortcut(this.f4, j, j + 16, 2, [-3, -4, -1, 2]);
            }

            for (let j = this.loopParams[3]; j > 3 ; j -= 4) {
                this.shortcut(this.f5, j, j + 48, 3, [2, 3, 2, -3]);
            }

            this.incrementData();
        }

        for (let p = 0; p < this.loopParams[1]; p++) {
            this.A |= this.encodeParams[4];
            this.B ^= this.encodeParams[5];
            this.C |= this.encodeParams[6] - p;
            this.D ^= this.encodeParams[7] + p;

            for (let j = this.loopParams[3]; j > 3 ; j -= 4) {
                this.shortcut(this.f4, j, j + 16, 2, [-3, -4, -1, 2]);
            }

            for (let j = 0; j < this.loopParams[2]; j += 4) {
                this.shortcut(this.f5, j, j + 32, 3, [2, 3, 2, -3]);
            }

            for (let j = this.loopParams[3]; j > 0 ; j -= 4) {

                this.shortcut(this.f2, j, j, 0, [0, 1, 2, 3]);

            }

            for (let j = 0; j < this.loopParams[2]; j += 4) {
                this.shortcut(this.f3, j, j + 48, 1, [1, -2, 3, 0]);
            }

            this.incrementData();
        }
    }

    protected initialData(): number[] {
        return [0, 0, 0, 0];
    }

    private shortcut(fun: EncFunction, j: number,  md5_index: number, rot_index: number, indexes: number[]): void {

        for (let i = 0; i < 4; i++) {
            const t = this.calculate(fun, (j + indexes[i]) & 7, i + md5_index);
            this.A = this.D;
            this.D = this.C;
            this.C = this.B;
            this.B = rol(t, rotationTable[rot_index][i]) + this.B | 0;
        }
    }
}

export class TagE7A8EncoderSecond extends TagE7A8Encoder {

    // this model has bug and it goes over the array limit
    protected readonly md5table = (() => {
        const overfillArr = [
            0xa0008 ^ 0x6d2f93a5, 0xa08097 ^ 0x6d2f93a5, 0xa010908 ^ 0x6d2f93a5, 0x60606161 ^ 0x6d2f93a5
        ];
        let arr = new Uint32Array(md5magic2.length + overfillArr.length);
        arr.set(md5magic2);
        arr.set(overfillArr, md5magic2.length);
        return arr;
    })();

    protected readonly loopParams = [17, 13, 12, 16];
}

const encoders: {readonly [P in DellTag]: Encoder} = {
    "595B": Tag595BEncoder,
    "2A7B": Tag595BEncoder, // same as 595B
    "A95B": Tag595BEncoder, // same as 595B
    "1D3B": Tag1D3BEncoder,
    "D35B": TagD35BEncoder,
    "1F66": Tag1F66Encoder,
    "6FF1": Tag6FF1Encoder,
    "1F5A": Tag1F5AEncoder,
    "BF97": TagBF97Encoder,
    "E7A8": TagE7A8Encoder
};

export function blockEncode(encBlock: number[], tag: DellTag): number[] {
    return encoders[tag].encode(encBlock);
}
