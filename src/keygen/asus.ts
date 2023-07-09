// based on dogbert's pwgen-asus.py
/* eslint-disable no-bitwise */
import { makeSolver } from "./utils";

/** @type {function(number=,number=,number=):Array<number>} */
function initTable(a1: number = 11, a2: number = 19, a3: number = 6): number[] {
    let table: number[] = [];
    const zeroCode = "0".charCodeAt(0);
    table[0] = a1 + zeroCode;
    table[1] = a2 + zeroCode;
    table[2] = a3 + zeroCode;
    table[3] = "6".charCodeAt(0);
    table[4] = "7".charCodeAt(0);
    table[5] = "8".charCodeAt(0);
    table[6] = "9".charCodeAt(0);

    let chksum: number = table.reduce((acc, val) => acc + val, 0);
    for (let i = 7; i < 32; i++) {
        chksum = (33676 * chksum + 12345) >>> 0;
        table[i] = ((chksum >> 16) & 0x7FFF) % 43 + zeroCode;
    }

    let v3 = a1 * a2;
    let v4 = shuffle1((a1 - 1) * (a2 - 1), a3);

    return table.map((value) => shuffle2(value - zeroCode, v4, v3));
}

function shuffle1(a1: number, a2: number): number {
    let v3 = 2;
    for (let i = 0; i < a2; i++) {
        let v4 = v3;
        let v5 = a1;
        while (v5 > 0) {
            if (v5 < v4) {
                [v5, v4] = [v4, v5];
            }
            v5 %= v4;
        }
        if (v4 !== 1) {
            v3++;
        }
    }
    return v3;
}

function shuffle2(a1: number, a2: number, a3: number): number {
    if (a1 >= a3) {
        a1 %= a3;
    }
    let result = a1;
    if (a2 !== 1) {
        for (let i = 0; i < a2 - 1; i++) {
            result = a1 * result % a3;
        }
    }
    return result;
}

function leftPad(base: string, len: number, fill: string = " ") {
    const padding = len - base.length;
    for (let i = 0; i < padding; i++) {
        base = fill + base;
    }
    return base;
}

function makeDateRegexp(): [RegExp, RegExp] {
    let years: string[] = [];
    let months: string[] = [];
    let days: string[] = [];

    for (let year = 1990; year <= 2100; year++) {
        years.push(leftPad(year.toString(), 4, "0"));
    }

    for (let month = 1; month <= 12; month++) {
        months.push(leftPad(month.toString(), 2, "0"));
    }

    for (let day = 1; day <= 31; day++) {
        days.push(leftPad(day.toString(), 2, "0"));
    }
    let ymdre = new RegExp(`(${years.join("|")})(${months.join("|")})(${days.join("|")})`);
    let dmyre = new RegExp(`(${days.join("|")})(${months.join("|")})(${years.join("|")})`);
    return [ymdre, dmyre];
}

const asusTable = initTable();
const [ymdRegex, dmyRegex] = makeDateRegexp();

export function asusKeygen(year: number, month: number, day: number): string {
    const date = leftPad(year.toString(), 4, "0") +
                 leftPad(month.toString(), 2, "0") +
                 leftPad(day.toString(), 2, "0");

    let chksum = parseInt(date, 16);
    let password: string = "";

    for (let i = 0; i < 8; i++) {
        chksum = (33676 * chksum + 12345) >>> 0;
        let index = (chksum >> 16) & 31;
        let pwdChar = asusTable[index] % 36;
        if (pwdChar > 9) {
            password += String.fromCharCode(pwdChar + "7".charCodeAt(0));
        } else {
            password += String.fromCharCode(pwdChar + "0".charCodeAt(0));
        }
    }

    return password;
}

export let asusSolver = makeSolver({
    name: "asusDate",
    description: "ASUS (Using date)",
    examples: ["2010-02-03"],
    inputValidator: (s) => s.length === 8,
    fun: (code) => {
        let result: string[] = [];

        if (ymdRegex.test(code)) {
            let year = parseInt(code.slice(0, 4), 10);
            let month = parseInt(code.slice(4, 6), 10);
            let day = parseInt(code.slice(6, 8), 10);
            result.push(asusKeygen(year, month, day));
        }

        if (dmyRegex.test(code)) {
            let day = parseInt(code.slice(0, 2), 10);
            let month = parseInt(code.slice(2, 4), 10);
            let year = parseInt(code.slice(4, 8), 10);
            result.push(asusKeygen(year, month, day));
        }

        return result;
    }
});
