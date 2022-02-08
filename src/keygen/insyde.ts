/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-shadow */
/* Maybe need fixing for browsers where numbers is 32-bits */
/* Some Acer, HP  laptops. 8 digit */
import { makeSolver } from "./utils";
import { Crc64, Sha256, AES128 } from "./cryptoUtils";

const INSYDE_SALT = "Insyde Software Corp.";

export function insydeAcerSwitch(arr: Uint8Array): Uint8Array {
    if (arr.length !== 32) {
        throw new Error("Input array should have 32 length");
    }

    function fun0(arr: Uint8Array): Uint8Array {
        let output = new Uint8Array(16);
        let k = 0;
        for (let i = 3; i >= 0; i--) {
            for (let j = 0; j < 16; j += 4 ) {
                output[k++] = arr[i + j];
            }
        }
        return output;
    }
    function fun1(arr: Uint8Array): Uint8Array {
        let output = new Uint8Array(16);
        let k = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 12; j >= 0; j -= 4) {
                output[k++] = arr[i + j];
            }
        }
        return output;
    }
    function fun2(arr: Uint8Array): Uint8Array {
        let output = new Uint8Array(16);
        let k = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                output[k++] = (arr[((j + i) & 3) + i * 4] + i) & 0xFF;
            }
        }
        return output;
    }
    function fun3(arr: Uint8Array): Uint8Array {
        let output = new Uint8Array(16);
        let k = 0;
        let acc1 = 0;
        let acc2 = 0;
        for (let i = 0; i < 4; i++) {
            acc1 ^= arr[i * 5];
            acc2 ^= arr[i * 3 + 3];
        }
        for (let i = 0; i < 16; i++) {
            const pivot = ((i & 1) === 0) ? acc1 : acc2;
            output[k++] = arr[i] ^ pivot;
        }
        return output;
    }
    function fun4(arr: Uint8Array): Uint8Array {
        let output = new Uint8Array(16);
        let k = 0;
        for (let i = 0; i < 16; i++) {
            const temp1 = arr[i];
            const temp2 = arr[(i + 1) & 0xF]; // arr[(i + 1) % 15];
            const pivot = (temp2 < temp1) ? temp2 : 0xFF;
            output[k++] = temp1 ^ pivot;
        }
        return output;
    }
    function fun5(arr: Uint8Array): Uint8Array {
        let output = new Uint8Array(16);
        for (let i = 0; i < 4; i++) {
            let acc: number = 0;
            for (let j = 0; j < 16; j += 4) {
                acc ^= arr[j + i];
            }
            for (let j = 0; j < 16; j += 4) {
                const temp = i + j;
                output[temp] = (arr[temp] * acc) & 0xFF;
            }
        }
        return output;
    }
    function keyProcess(arr: Uint8Array): Uint8Array {
        let output = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            let acc: number = 0;
            for (let j = 0; j < 8; j++) {
                acc += arr[((i >> 2) << 3) + j] * arr[j * 4 + (i & 3)];
            }
            output[i] = acc & 0xFF;
        }
        return output;
    }

    const temp = keyProcess(arr);
    switch (arr[8] % 6) {
        case 0:
            return fun0(temp);
        case 1:
            return fun1(temp);
        case 2:
            return fun2(temp);
        case 3:
            return fun3(temp);
        case 4:
            return fun4(temp);
        default:
            return fun5(temp);
    }
}

// 10 digits acer key
function acerInsydeKeygen(serial: string): string[] {
    function rotatefun(arr: Uint8Array): Uint8Array {
        const idx = arr[9] & 0xF;
        let output = new Uint8Array(16);
        for (let i = 0; i < output.length; i++) {
            output[i] = arr[((idx * 2 + 1) * i) % arr.length];
        }
        return output;
    }

    const inputBytes = Uint8Array.from(serial.split("").map((c) => c.charCodeAt(0) & 0xFF));
    const digest = (new Sha256(inputBytes)).digest();
    const key = insydeAcerSwitch(digest);
    const blockData = rotatefun(digest);
    const data = (new AES128(key)).encryptBlock(blockData);
    let crc = new Crc64(Crc64.ECMA_POLYNOMIAL);
    crc.update(data);
    return [crc.hexdigest()];
}

function insydeKeygen(serial: string): string[] {
    const salt1 = INSYDE_SALT;
    const salt2 = ":\x16@>\x1496H\x07.\x0f\x0e\nG-MDGHBT";
    // some firmware has a bug in number convesion to string
    // they use simple snprintf(dst, 0x16, "%d", serial) so leading zeros are lost
    // and at the end buffer is filled with \x00
    const serial2 = (parseInt(serial, 10).toString() + "\x00".repeat(8)).slice(0, 8);
    let password1 = "";
    let password2 = "";
    let password3 = "";
    for (let i = 0; i < 8; i++) {
        // salt.charCodeAt(i % salt.length) + (i % salt.length)
        let b: number = (salt1.charCodeAt(i) + i) ^ serial.charCodeAt(i);
        password1 += (b % 10).toString();

        b = (salt1.charCodeAt(i) + i) ^ serial2.charCodeAt(i);
        password2 += (b % 10).toString();

        b = salt2.charCodeAt(i) ^ serial2.charCodeAt(i);
        password3 += (b % 10).toString();
    }
    if (password1 === password2) {
        return [password1, password3];
    } else {
        return [password1, password2, password3];
    }
}

function hpInsydeKeygen(serial: string): string[] {
    const inputRe = /^i\s*(\d{8})$/i;
    const salt1 = "c6B|wS^8";
    const salt2 = INSYDE_SALT;
    const match = inputRe.exec(serial);

    if (!match || match.length !== 2) {
        return [];
    } else {
        serial = match[1];
    }
    let password1 = "";
    let password2 = "";
    for (let i = 0; i < 8; i++) {
        let b: number = (salt1.charCodeAt(i) + i) ^ serial.charCodeAt(i);
        password1 += (b % 10).toString();

        b = (salt2.charCodeAt(i) + i) ^ serial.charCodeAt(i);
        password2 += (b % 10).toString();
    }
    return [password1, password2];
}

export let insydeSolver = makeSolver({
    name: "insydeH2O",
    description: "Insyde H2O BIOS (Acer, HP)",
    examples: ["03133610"],
    inputValidator: (s) => /^\d{8}$/i.test(s),
    fun: insydeKeygen
});

export let acerInsyde10Solver = makeSolver({
    name: "acerInsyde10",
    description: "Acer Insyde 10 digits",
    examples: ["0173549286"],
    inputValidator: (s) => /^\d{10}$/i.test(s),
    fun: acerInsydeKeygen
});

export let hpInsydeSolver = makeSolver({
    name: "hpInsyde",
    description: "HP Insyde H2O",
    examples: ["i 70412809", "I 59170869"],
    inputValidator: (s) => /^i\s*\d{8}$/i.test(s),
    fun: hpInsydeKeygen
});
