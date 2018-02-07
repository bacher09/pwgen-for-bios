/* Maybe need fixing for browsers where numbers is 32-bits */
/* Some Acer, HP  laptops. 8 digit */
import { makeSolver } from "./utils";

/* tslint:disable:no-bitwise */
function insydeKeygen(serial: string): string[] {
    const salt = "Iou|hj&Z";
    let password = "";
    let b = 0;
    let a = 0;
    for (let i = 0; i < 8; i++) {
        b = salt.charCodeAt(i) ^ serial.charCodeAt(i);
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

export let insydeSolver = makeSolver({
    name: "insydeH2O",
    description: "Insyde H2O BIOS (Acer, HP)",
    examples: ["03133610"],
    inputValidator: (s) => /^\d{8}$/i.test(s),
    fun: insydeKeygen
});
