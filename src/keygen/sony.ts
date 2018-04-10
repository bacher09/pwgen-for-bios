import { makeSolver } from "./utils";
/* Return password for old sony laptops
 * password 7 digit number like 1234567
 */
function sonyKeygen(serial: string): string {
    const table = "0987654321876543210976543210982109876543109876543221098765436543210987";
    let code: string = "";
    for (let i = 0; i < serial.length; i++) {
        code += table.charAt(parseInt(serial.charAt(i), 10) + 10 * i);
    }
    return code;
}

export let sonySolver = makeSolver({
    name: "sony",
    description: "Old Sony",
    examples: ["1234567"],
    inputValidator: (s) => /^\d{7}$/i.test(s),
    fun: (code: string) => {
        let res = sonyKeygen(code);
        return res ? [res] : [];
    }
});
