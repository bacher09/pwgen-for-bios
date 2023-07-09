/* eslint-disable no-bitwise */
import {
    asciiToKeyboardEnc, keyboardEncToAscii, reversedScanCodes, Solver
} from "./utils";

export const enum PhoenixErrors {
    BadHash,
    NotFound
}

export interface PhoenixInfo {
    shift: number;
    salt: number;
    dictionary: string[];
    minLen: number;
    maxLen: number;
}

export interface PhoenixBios extends Partial<PhoenixInfo> {
    name: string;
    description?: string;
}

export interface PhoenixSolver extends Solver {
    readonly info: PhoenixInfo;
    calculateHash(password: string): number;
}

// Without zero
const digitsOnly: string[] = "123456789".split("");

const lettersOnly: string[] = "abcdefghijklmnopqrstuvwxyz".split("");

// const alphaNumeric: string[] = lettersOnly.concat(digitsOnly);

const defaultPhoenix: PhoenixInfo = {
    shift: 0,
    salt: 0,
    dictionary: lettersOnly,
    minLen: 3,
    maxLen: 7
};

/* The phoenix implementation of the CRC-16 contains a rather severe bug
 * quartering the image space of the function: both the first and second MSB
 * are always zero regardless of the input.
 * For a working implementation, you'd have to change the polynom from 0x2001
 * to e.g. 0xA001.
 */

function badCRC16(pwd: number[], salt: number = 0): number {

    let hash = salt;
    for (let c = 0; c < pwd.length; c++) {
        hash ^= pwd[c];
        for (let i = 8; i--;) {
            if (hash & 1) {
                hash = (hash >> 1) ^ 0x2001;
            } else {
                hash = (hash >> 1);
            }
        }
    }
    return hash;
}

/*
 * Modified version of badCRC16 to speedup bruteForce.
 * Returns pasword length if it matches required hash
 * or -1 if it isn't matches requiredHash.
 */
function searchBadCRC16(pwd: number[], salt: number, requiredHash: number, minLen: number): number {

    minLen--;
    let hash = salt;
    for (let c = 0; c < pwd.length; c++) {
        hash ^= pwd[c];
        for (let i = 8; i--;) {
            if (hash & 1) {
                hash = (hash >> 1) ^ 0x2001;
            } else {
                hash = (hash >> 1);
            }
        }

        if (c >= minLen && hash === requiredHash) {
            return c + 1;
        }
    }
    return -1; // not found
}

function generatePhoenixPassword(encodedPwd: number[], characters: string[] = lettersOnly): void {
    let rnd = Math.random() * characters.length;
    for (let i = 0; i < encodedPwd.length; i++) {
        let index = Math.floor(rnd % characters.length);
        encodedPwd[i] = reversedScanCodes[characters[index]];
        rnd *= encodedPwd.length;
    }
}

function bruteForce(hash: number, salt: number = 0, characters: string[] = lettersOnly,
                    minLen: number = 3, maxLen: number = 7): string | PhoenixErrors {

    let encodedPwd: number[] = [];
    for (let i = 0; i < maxLen; i++) {
        encodedPwd.push(0);
    }

    if (hash > 0x3FFF) {
        return PhoenixErrors.BadHash;
    }

    let kk = 0;
    while (true) {
        kk++;
        if (kk > 7000000) {
            return PhoenixErrors.NotFound;
        }

        generatePhoenixPassword(encodedPwd, characters);

        let found = searchBadCRC16(encodedPwd, salt, hash, minLen);
        if (found !== -1) {
            return keyboardEncToAscii(encodedPwd.slice(0, found));
        }
    }
}

function makePhoenixSolver(description?: PhoenixBios): PhoenixSolver {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */

    if (description === void 0) {
        description = {} as PhoenixBios;
    }

    let key: keyof PhoenixInfo;
    for (key in defaultPhoenix) {
        if (description[key] === void 0) {
            (description[key] as (PhoenixInfo[keyof PhoenixInfo])) = defaultPhoenix[key];
        }
    }

    const info: PhoenixInfo = {
        shift: description.shift as number,
        salt: description.salt as number,
        dictionary: description.dictionary as string[],
        minLen: description.minLen as number,
        maxLen: description.maxLen as number
    };

    let keygen = (code: string) => {
        let password = bruteForce(parseInt(code, 10) + info.shift, info.salt,
            info.dictionary, info.minLen, info.maxLen);

        if (typeof password === "string") {
            return [password];
        } else {
            return [];
        }
    };

    let cleaner = (code: string): string => code.trim().replace(/[-\s]/gi, "");
    let validator = (s: string): boolean => /^[0-9]{5}$/i.test(s);
    let calculateHash = (password: string): number => {
        let pwd = asciiToKeyboardEnc(password);
        return badCRC16(pwd, info.salt) - info.shift;
    };
    let solver: any = (code: string): string[] => {
        let cleanCode = cleaner(code);
        if (validator(cleanCode)) {
            return keygen(cleanCode);
        } else {
            return [];
        }
    };

    solver.biosName = description.name;
    solver.validator = validator;
    solver.cleaner = cleaner;
    solver.keygen = keygen;
    solver.examples = ["12345"];
    solver.info = info;
    solver.calculateHash = calculateHash;

    if (description.description) {
        solver.description = description.description;
    }
    return solver as PhoenixSolver;
}

export let phoenixSolver = makePhoenixSolver({
    name: "phoenix",
    description: "Generic Phoenix"
});

export let phoenixHPCompaqSolver = makePhoenixSolver({
    name: "phoenixHP",
    description: "HP/Compaq Phoenix BIOS",
    salt: 17232
});

export let phoenixFsiSolver = makePhoenixSolver({
    name: "phoenixFSI",
    description: "Fujitsu-Siemens Phoenix",
    salt: 65,
    dictionary: digitsOnly
});

export let phoenixFsiLSolver = makePhoenixSolver({
    name: "phoenixFSIModelL",
    description: "Fujitsu-Siemens (model L) Phoenix",
    shift: 1,
    salt: "L".charCodeAt(0),
    dictionary: digitsOnly
});

export let phoenixFsiPSolver = makePhoenixSolver({
    name: "phoenixFSIModelP",
    description: "Fujitsu-Siemens (model P) Phoenix",
    shift: 1,
    salt: "P".charCodeAt(0),
    dictionary: digitsOnly
});

export let phoenixFsiSSolver = makePhoenixSolver({
    name: "phoenixFSIModelS",
    description: "Fujitsu-Siemens (model S) Phoenix",
    shift: 1,
    salt: "S".charCodeAt(0),
    dictionary: digitsOnly
});

export let phoenixFsiXSolver = makePhoenixSolver({
    name: "phoenixFSIModelX",
    description: "Fujitsu-Siemens (model X) Phoenix",
    shift: 1,
    salt: "X".charCodeAt(0),
    dictionary: digitsOnly
});
