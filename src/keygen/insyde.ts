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
    description: "Insyde H2O BIOS (Acer, HP) without any prefix",
    examples: ["03133610"],
    inputValidator: (s) => /^\d{8}$/i.test(s),
    fun: insydeKeygen
});

// plain stupid logic for insyde serial with "i" as prefix
// question mark represents an unknown digit...
var char1lower = {'0':'?', '1':'?', '2':'?', '3':'?', '4':'?', '5':'6', '6':'5', '7':'4', '8':'1', '9':'0'}
var char2lower = {'0':'7', '1':'6', '2':'5', '3':'4', '4':'3', '5':'2', '6':'1', '7':'0', '8':'5', '9':'4'}
var char3lower = {'0':'6', '1':'7', '2':'8', '3':'9', '4':'2', '5':'3', '6':'4', '7':'5', '8':'4', '9':'5'}
var char4lower = {'0':'9', '1':'8', '2':'7', '3':'6', '4':'5', '5':'4', '6':'3', '7':'2', '8':'1', '9':'0'}
var char5lower = {'0':'5', '1':'4', '2':'3', '3':'2', '4':'9', '5':'8', '6':'7', '7':'6', '8':'7', '9':'6'}
var char6lower = {'0':'4', '1':'5', '2':'6', '3':'7', '4':'8', '5':'9', '6':'0', '7':'1', '8':'6', '9':'7'}
var char7lower = {'0':'4', '1':'5', '2':'6', '3':'7', '4':'0', '5':'1', '6':'2', '7':'3', '8':'2', '9':'3'}
var char8lower = {'0':'5', '1':'4', '2':'3', '3':'2', '4':'1', '5':'0', '6':'9', '7':'8', '8':'7', '9':'6'}
var lowerSwitcher = { 
    1: char1lower, 2: char2lower, 3: char3lower, 4: char4lower, 
    5: char5lower, 6: char6lower, 7: char7lower, 8: char8lower, 
}

function insydeKeygenWithLowerI(serial: string): string[] {
    let password = "";
    for (let i = 1; i < 9; i++) {
        password += lowerSwitcher[i][serial[i]].toString();
    }
    return [password];
}

export let insydeWithISolver = makeSolver({
    name: "insydeH2OWithI",
    description: "Insyde H2O BIOS (Acer, HP) with 'i' as a prefix",
    examples: ["i50158071"],
    inputValidator: (s) => /^i\d{8}$/i.test(s),
    fun: insydeKeygen
});
