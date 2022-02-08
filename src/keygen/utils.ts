export type Predicate<T> = (val: T) => boolean;
export type SolverFunction = (val: string) => string[];

export interface SolverDescription {
    readonly name: string;
    readonly description?: string;
    readonly examples?: string[];
    fun: SolverFunction;
    inputValidator: Predicate<string>;
    cleaner?: (val: string) => string;
}

export interface Solver {
    (code: string): string[];
    readonly biosName: string;
    readonly examples?: string[];
    readonly description: string;
    validator(code: string): boolean;
    cleaner(code: string): string;
    keygen(code: string): string[];
}

export const keyboardDict: {[key: number]: string} = {
    2: "1",  3: "2",  4: "3",  5: "4",  6: "5",  7: "6",  8: "7",  9: "8",
    10: "9", 11: "0", 16: "q", 17: "w", 18: "e", 19: "r", 20: "t", 21: "y",
    22: "u", 23: "i", 24: "o", 25: "p", 30: "a", 31: "s", 32: "d", 33: "f",
    34: "g", 35: "h", 36: "j", 37: "k", 38: "l", 44: "z", 45: "x", 46: "c",
    47: "v", 48: "b", 49: "n", 50: "m"
};

// reverse scan code table
function generateReverseKeyDict(): {[key: string]: number} {
    let result: {[key: string]: number} = {};
    for (let key in keyboardDict) {
        if (keyboardDict.hasOwnProperty(key)) {
            result[keyboardDict[key]] = parseInt(key, 10);
        }
    }
    return result;
}

export const reversedScanCodes = generateReverseKeyDict();

/* Decode Keyboard code to Ascii symbol */
export function keyboardEncToAscii(inKey: number[]): string {
    let out = "";
    for (let key of inKey) {
        if (key === 0) {
            return out;
        }

        if (key in keyboardDict) {
            out += keyboardDict[key];
        } else {
            return "";
        }
    }
    return out;
}

export function asciiToKeyboardEnc(password: string): number[] {
    return password.split("").map((c) => {
        let code = reversedScanCodes[c];
        if (code === void 0) {
            throw new Error("Undefined scan code");
        } else {
            return code;
        }
    });
}

function cleanSerial(serial: string): string {
    return serial.trim().replace(/-/gi, "");
}

export function makeSolver(description: SolverDescription): Solver {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */

    let solver: any = (code: string) => {
        let cleanCode = (solver as Solver).cleaner(code);
        if (description.inputValidator(cleanCode)) {
            return description.fun(cleanCode);
        } else {
            return [];
        }
    };

    solver.biosName = description.name;
    solver.validator = description.inputValidator;

    if (description.cleaner) {
        solver.cleaner = description.cleaner;
    } else {
        solver.cleaner = cleanSerial;
    }

    solver.keygen = description.fun;

    if (description.examples) {
        solver.examples = description.examples;
    }

    if (description.description) {
        solver.description = description.description;
    }

    return solver as Solver;
}
