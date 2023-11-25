/* eslint-disable no-bitwise */
import { Crc32 } from "./cryptoUtils";
import { makeSolver } from "./utils";

function hpAmiKeygen(input: string): string | undefined {
    if (input.length !== 8) {
        return undefined;
    }

    const salt = Uint8Array.from([
        0xb9, 0xed, 0xf5, 0x69, 0x9d, 0x16, 0x49, 0xf9,
        0x8c, 0x5f, 0x7c, 0xb3, 0x68, 0x3c, 0xd4, 0xa7
    ]);

    const backdoor = parseInt(input, 16);
    let temp = new Uint8Array(20);
    let crc = new Crc32();
    for (let i = 0; i < 0x10; i++) {
        temp[i] = salt[i] ^ 0x36;
    }
    // pack value in little-endian format
    temp[0x10] = backdoor & 0xFF;
    temp[0x11] = (backdoor >>> 8) & 0xFF;
    temp[0x12] = (backdoor >>> 16) & 0xFF;
    temp[0x13] = (backdoor >>> 24) & 0xFF;
    crc.update(temp);
    const next = crc.digest();

    for (let i = 0; i < 0x10; i++) {
        temp[i] = salt[i] ^ 0x5C;
    }
    // pack value in little-endian format
    temp[0x10] = next & 0xFF;
    temp[0x11] = (next >>> 8) & 0xFF;
    temp[0x12] = (next >>> 16) & 0xFF;
    temp[0x13] = (next >>> 24) & 0xFF;
    crc.reset();
    crc.update(temp);
    return crc.hexdigest();
}

export let hpAMISolver = makeSolver({
    name: "hpAMI",
    description: "HP AMI",
    examples: ["A7AF422F"],
    inputValidator: (s) => /^[0-9ABCDEF]{8}$/i.test(s),
    fun: (input: string) => {
        const output = hpAmiKeygen(input);
        return (output) ? [output] : [];
    }
});
