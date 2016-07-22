type Predicate<T> = (val: T) => boolean;
type Tuple<A, B> = [A, B];
type BIOSSolver = (val: string) => string[];

export const enum BIOSModels {
    Sony = 1,
    Samsung,
    Phoenix,
    HPCompaq,
    FSIPhoenix,
    FSILPhoenix,
    FSIPPhoenix,
    FSISPhoenix,
    FSIXPhoenix,
    Insyde,
    HPMini
};

interface BIOSDecoder {
    model: BIOSModels;
    name: string;
    description?: string;
    examples?: string[];
    check: Predicate<string>;
    solve: BIOSSolver;
}

type FindResult = Tuple<string[], BIOSDecoder>;

namespace Utils {
    /* May be need add 51, 52 and 53 symbol  */
    const keyboardDict: {[key: number]: string} = {
        2: "1",  3: "2",  4: "3",  5: "4",  6: "5",  7: "6",  8: "7",  9: "8",
        10: "9", 11: "0", 16: "q", 17: "w", 18: "e", 19: "r", 20: "t", 21: "y",
        22: "u", 23: "i", 24: "o", 25: "p", 30: "a", 31: "s", 32: "d", 33: "f",
        34: "g", 35: "h", 36: "j", 37: "k", 38: "l", 44: "z", 45: "x", 46: "c",
        47: "v", 48: "b", 49: "n", 50: "m"
    };
    /* Decode Keyboard code to Ascii symbol */
    export function keyboardEncToAscii(inKey: number[]): string {
        let out = "";
        for (let i = 0; i < inKey.length; i++) {
            if (inKey[i] === 0) return out;
            if (inKey[i] in keyboardDict) {
                out += keyboardDict[inKey[i]];
            } else {
                return "";
            }
        }
        return out;
    }
}

/* Return password for old sony laptops
 * password 7 digit number like 1234567 */
function SonySolver(serial: string): string {
    if (serial.length !== 7) {
        return null;
    }
    const table = "0987654321876543210976543210982109876543109876543221098765436543210987";
    let code = "";
    for (let i = 0; i < serial.length; i++) {
        code += table.charAt(parseInt(serial.charAt(i), 10) + 10 * i);
    }
    return code;
}

/* Return password for samsung laptops
 *  12 or 18 hexhecimal digits like 07088120410C0000 */
function SamsungSolver(serial: string): string[] {

    const rotationMatrix1 = [
        7, 1, 5, 3, 0, 6, 2, 5, 2, 3, 0, 6, 1, 7, 6, 1, 5, 2, 7, 1, 0, 3, 7,
        6, 1, 0, 5, 2, 1, 5, 7, 3, 2, 0, 6
    ];
    const rotationMatrix2 = [
        1, 6, 2, 5, 7, 3, 0, 7, 1, 6, 2, 5, 0, 3, 0, 6, 5, 1, 1, 7, 2, 5, 2,
        3, 7, 6, 2, 1, 3, 7, 6, 5, 0, 1, 7
    ];

    function keyToAscii(inKey: number[]): string {
        let out = "";
        for (let i = 0; i < inKey.length; i++) {
            if (inKey[i] === 0) return out;
            if (inKey[i] < 32 || inKey[i] > 127) return undefined;
            out += String.fromCharCode(inKey[i]);
        }

        return out;
    }

    function decryptHash(hash: number[], key: number, rotationMatrix: number[]) {
        let outhash: number[] = [];
        for (let i = 0; i < hash.length; i++) {
            let val = ((hash[i] << (rotationMatrix[7 * key + i])) & 0xFF) |
                      (hash[i] >> (8 - rotationMatrix[7 * key + i]));
            outhash.push(val);
        }
        return outhash;
    }

    let hash: number[] = [];
    for (let i = 1; i < Math.floor(serial.length / 2); i++) {
        let val = parseInt(serial.charAt(2 * i) + serial.charAt(2 * i + 1), 16);
        hash.push(val);
    }
    let key = parseInt(serial.substring(0, 2), 16) % 5;

    let calcScanCodePwd = (matrix: number[]) =>
        Utils.keyboardEncToAscii(decryptHash(hash, key, matrix));

    let scanCodePassword = calcScanCodePwd(rotationMatrix1);
    if (scanCodePassword === "") {
        scanCodePassword = calcScanCodePwd(rotationMatrix2);
    }

    let asciiPassword1 = keyToAscii(decryptHash(hash, key, rotationMatrix1));
    let asciiPassword2 = keyToAscii(decryptHash(hash, key, rotationMatrix2));

    // TODO: This might require polyfil
    return [scanCodePassword, asciiPassword1, asciiPassword2].
        filter(code => code ? true : false);
}

/* For HP/Compaq Netbooks. 10 chars */
function HPMiniSolver(serial: string): string[] {
    const table1: {[key: string]: string} = {
        "1": "3", "0": "1", "3": "F", "2": "7", "5": "Q", "4": "V",
        "7": "X", "6": "G", "9": "O", "8": "U", "a": "C", "c": "E",
        "b": "P", "e": "M", "d": "T", "g": "H", "f": "8", "i": "Y",
        "h": "Z", "k": "S", "j": "W", "m": "4", "l": "K", "o": "J",
        "n": "9", "q": "5", "p": "2", "s": "N", "r": "B", "u": "L",
        "t": "A", "w": "D", "v": "6", "y": "I", "x": "4", "z": "0"
    };

    const table2: {[key: string]: string} = {
        "1": "3", "0": "1", "3": "F", "2": "7", "5": "Q", "4": "V",
        "7": "X", "6": "G", "9": "O", "8": "U", "a": "C", "c": "E",
        "b": "P", "e": "M", "d": "T", "g": "H", "f": "8", "i": "Y",
        "h": "Z", "k": "S", "j": "W", "m": "4", "l": "K", "o": "J",
        "n": "9", "q": "5", "p": "2", "s": "N", "r": "B", "u": "L",
        "t": "A", "w": "D", "v": "6", "y": "I", "x": "R", "z": "0"
    };

    let password1 = "";
    let password2 = "";
    serial = serial.toLowerCase();
    for (let i = 0; i < serial.length; i++) {
        password1 += table1[serial.charAt(i)];
        password2 += table2[serial.charAt(i)];
    }
    if (password1 === password2) {
        return [password1.toLowerCase()];
    } else {
        return [password1.toLowerCase(), password2.toLowerCase()];
    }
}

/* Maybe need fixing for browsers where numbers is 32-bits */
/* Some Acer, HP  laptops. 8 digit */
function InsydeSolver(serial: string): string[] {
    const salt = "Iou|hj&Z";
    let password = "";
    let b = 0;
    let a = 0;
    let ord = (str: string) => str.charCodeAt(0);
    for (let i = 0; i < 8; i++) {
        b = ord(salt.charAt(i)) ^ ord(serial.charAt(i));
        a = b;
        // a = (a * 0x66666667) >> 32;
        a = (a * 0x66666667);
        a = Math.floor(a  / Math.pow(2, 32));
        a = (a >> 2) | (a & 0xC0);
        if (a & 0x80000000) {
            a++;
        }
        a *= 10;
        password += (b - a).toString();
    }
    return [password];
}

/* For Fujinsu-Siemens. 5x4 dicimal digits */
function FSI20DecOldSolver(serial: string): string[] {
    let ord = (str: string) => str.charCodeAt(0);

    function swap<T> (arr: T[], i1: number, i2: number): void {
        let temp = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = temp;
    };
    // op_arr - array with that operations do, ar1,ar2 - numbers */
    function interleave(op_arr: number[], ar1: number[], ar2: number[]) {
        let arr = op_arr.slice(0); // copy array
        arr[ar1[0]] = ((op_arr[ar2[0]] >> 4) | (op_arr[ar2[3]] << 4)) & 0xFF;
        arr[ar1[1]] = ((op_arr[ar2[0]] & 0x0F) | (op_arr[ar2[3]] & 0xF0));
        arr[ar1[2]] = ((op_arr[ar2[1]] >> 4) | (op_arr[ar2[2]] << 4) & 0xFF);
        arr[ar1[3]] = (op_arr[ar2[1]] & 0x0F) | (op_arr[ar2[2]] & 0xF0);
        return arr;
    }

    function codeToBytes(code: string): number[] {
        let numbers = [
            parseInt(code.slice(0, 5), 10),
            parseInt(code.slice(5, 10), 10),
            parseInt(code.slice(10, 15), 10),
            parseInt(code.slice(15, 20), 10)
        ];
        return numbers.reduce((acc, val) => {
            acc.push(val % 256);
            acc.push(Math.floor(val / 256));
            return acc;
        }, []);
    }

    function decryptCode_old(bytes: number[]) {
        const XORkey = ":3-v@e4i";
        // apply XOR key
        bytes.forEach((val, i, arr) => {
            arr[i] = val ^ ord(XORkey.charAt(i));
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
        bytes = bytes.map(b => b % 36);
        return bytes.map(sbyte => (sbyte > 9 )
            ? String.fromCharCode(ord("a") + sbyte - 10)
            : String.fromCharCode(ord("0") + sbyte)
        ).join("");
    }

    return [decryptCode_old(codeToBytes(serial))];
}

export let CleanSerial = (serial: string) => serial.trim().replace(/-/gi, "");

export let Sony: BIOSDecoder = {
    model: BIOSModels.Sony,
    name: "Sony",
    examples: ["1234567"],
    check: (s) => /^\d{7}$/i.test(s),
    solve: (s) => {
        let res = SonySolver(s);
        return res ? [res] : [];
    }
};

export let Samsung: BIOSDecoder = {
    model: BIOSModels.Samsung,
    name: "Samsung",
    examples: ["07088120410C0000"],
    check: (s) => /^[0-9ABCDEF]+$/i.test(s) && (
        s.length === 12 || s.length === 14 || s.length === 16
    ),
    solve: SamsungSolver
};

export let HPMini: BIOSDecoder = {
    model: BIOSModels.HPMini,
    name: "HPMini",
    examples: ["CNU1234ABC"],
    check: (s) => /^[0-9A-Z]{10}$/i.test(s),
    solve: HPMiniSolver
};

export let Insyde: BIOSDecoder = {
    model: BIOSModels.Insyde,
    name: "Insyde H2O",
    examples: ["03133610"],
    check: (s) => /^\d{8}$/i.test(s),
    solve: InsydeSolver
};

export let FSI20DecOld: BIOSDecoder = {
    model: BIOSModels.FSIPhoenix,
    name: "Fujitsu-Siemens old",
    examples: ["1234-4321-1234-4321-1234"],
    check: (s) => /^\d{20}$/i.test(s),
    solve: FSI20DecOldSolver
};

export let Decoders: BIOSDecoder[] = [
    Sony, Samsung, HPMini, Insyde, FSI20DecOld
];

export function runDecoder(serial: string, decoder: BIOSDecoder): string[] {
    return decoder.check(serial) ? decoder.solve(serial) : [];
}

export function runDecoders(serial: string, decoders: BIOSDecoder[]): FindResult[] {
    return decoders.map((dec: BIOSDecoder): FindResult =>
        [runDecoder(serial, dec), dec]).filter(res => res[0].length > 0);
}

export let findPassword = (serial: string) =>
    runDecoders(CleanSerial(serial), Decoders);
