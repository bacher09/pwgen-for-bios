/* For HP/Compaq Netbooks. 10 chars */
import { makeSolver } from "./utils";

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

function hpMiniKeygen(serial: string): string[] {

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

export let hpMiniSolver = makeSolver({
    name: "hpMini",
    description: "HP/Compaq Mini Netbooks",
    examples: ["CNU1234ABC"],
    inputValidator: (s) => /^[0-9A-Z]{10}$/i.test(s),
    fun: hpMiniKeygen
});
