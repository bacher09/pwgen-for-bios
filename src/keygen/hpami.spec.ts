import { hpAMISolver } from "./hpami";

describe("HP AMI BIOS", () => {
    it("Check solver", () => {
        expect(hpAMISolver("A7AF422F")).toEqual(["49163252"]);
        expect(hpAMISolver("12345678")).toEqual(["2ae211b4"]);
        expect(hpAMISolver("48A02676")).toEqual(["27545092"]);
        expect(hpAMISolver("B60BD282")).toEqual(["489b5bf9"]);
        expect(hpAMISolver("757EDC82")).toEqual(["edfe2edd"]);
        expect(hpAMISolver("7d94422f")).toEqual(["e4eea2c4"]);
    });
});
