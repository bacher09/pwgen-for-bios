import { AES128, Crc32, Crc64, Sha256 } from "./cryptoUtils";

describe("Crypto utils", () => {
    it("sha256", () => {
        expect(new Sha256(Uint8Array.from([])).hexdigest())
            .toEqual("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

        expect(new Sha256(Uint8Array.from([1])).hexdigest())
            .toEqual("4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a");

        expect(new Sha256(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).hexdigest())
            .toEqual("c848e1013f9f04a9d63fa43ce7fd4af035152c7c669a4a404b67107cee5f2e4e");

        expect(new Sha256(Uint8Array.from("test".split("").map((v) => v.charCodeAt(0)))).hexdigest())
            .toEqual("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");

        expect(new Sha256(Uint8Array.from("0".repeat(256).split("").map((v) => v.charCodeAt(0)))).hexdigest())
            .toEqual("67f022195ee405142968ca1b53ae2513a8bab0404d70577785316fa95218e8ba");

        expect(new Sha256(Uint8Array.from("0".repeat(56).split("").map((v) => v.charCodeAt(0)))).hexdigest())
            .toEqual("bd03ac1428f0ea86f4b83a731ffc7967bb82866d8545322f888d2f6e857ffc18");
    });
    it("AES128", () => {
        const numbers = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        const myaes = new AES128(numbers);
        expect(myaes.encryptBlock(numbers))
            .toEqual(Uint8Array.from([52, 195, 59, 127, 20, 253, 83, 220, 234, 37, 224, 26, 2, 225, 103, 39]));

        expect(myaes.encryptBlock(Uint8Array.from("123456789abcdefg".split("").map((v) => v.charCodeAt(0)))))
            .toEqual(Uint8Array.from([111, 52, 225, 193, 98, 40, 19, 168, 122, 34, 93, 3, 146, 166, 202, 100]));
    });
    it("Check crc32", () => {
        let crc = new Crc32();
        crc.update("test".split("").map((v) => v.charCodeAt(0)));
        expect(crc.digest()).toEqual(3632233996);
        crc.update("123".split("").map((v) => v.charCodeAt(0)));
        expect(crc.digest()).toEqual(4032078523); // crc32 for "test123"
        expect(crc.hexdigest()).toEqual("f054a2bb");
        crc.reset();
        expect(crc.hexdigest()).toEqual("00000000");
    });
    it("crc64", () => {
        let mycrc = new Crc64(Crc64.ECMA_POLYNOMIAL);
        mycrc.update([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        expect(mycrc.hexdigest()).toEqual("335a089168033fbe");
        mycrc.reset();
        mycrc.update([0x80]);
        expect(mycrc.hexdigest()).toEqual("c96c5795d7870f42");
        mycrc.reset();
        mycrc.update(Uint8Array.from([0xde, 0xad, 0xbe, 0xef]));
        expect(mycrc.hexdigest()).toEqual("fc232c18806871af");
    });
});
