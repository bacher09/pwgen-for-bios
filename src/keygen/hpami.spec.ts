import { Crc32, hpAMISolver } from "./hpami";

describe("HP AMI BIOS", () => {
    it("Check solver", () => {
        expect(hpAMISolver("A7AF422F")).toEqual(["49163252"]);
        expect(hpAMISolver("12345678")).toEqual(["2ae211b4"]);
        expect(hpAMISolver("48A02676")).toEqual(["27545092"]);
        expect(hpAMISolver("B60BD282")).toEqual(["489b5bf9"]);
        expect(hpAMISolver("757EDC82")).toEqual(["edfe2edd"]);
        expect(hpAMISolver("7d94422f")).toEqual(["e4eea2c4"]);
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
});
