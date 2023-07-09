import JSBI from "jsbi";
import { modularPow, sony4x4Keygen, sony4x4Solver } from "./sony_4x4";

describe("Sony 4x4 BIOS Keygen", () => {
    it("Sony 4x4 key for 73KR3FP9PVKHK29R is 32799624", () => {
        expect(sony4x4Keygen("73KR3FP9PVKHK29R")).toEqual("32799624");
    });
    it("Sony 4x4 key for 73KR-3FP9-PVKH-K299 is 69423778", () => {
        expect(sony4x4Keygen("73KR3FP9PVKHK299")).toEqual("69423778");
    });
    it("Sony 4x4 key for 9DPK-73KR-8JHX-F3RT is 54746568", () => {
        expect(sony4x4Keygen("9DPK73KR8JHXF3RT")).toEqual("54746568");
    });
    it("Sony 4x4 key for 3RT6-8JV2-6HX8-K7FX is 32969527", () => {
        expect(sony4x4Keygen("3RT68JV26HX8K7FX")).toEqual("32969527");
    });
    it("Sony 4x4 key for K29R-PVKH-3FP9-73KR is 65395983", () => {
        expect(sony4x4Keygen("K29RPVKH3FP973KR")).toEqual("65395983");
    });
});

describe("Sony 4x4 BIOS Solver", () => {
    it("Sony 4x4 key for 73KR-3FP9-PVKH-K29R is 32799624", () => {
        expect(sony4x4Solver("73KR-3FP9-PVKH-K29R")).toEqual(["32799624"]);
    });
    it("Sony 4x4 invalid key 73KR-3FP9-PVKH-K29C", () => {
        expect(sony4x4Solver("73KR-3FP9-PVKH-K29C")).toEqual([]);
    });
});

describe("test modularPow", () => {
    it("4 ^ 13 mod 497 == 445", () => {
        expect(modularPow(JSBI.BigInt(4), 13, 497)).toEqual(445);
    });
    it("100500 ^ 100500 mod 14 == 8", () => {
        expect(modularPow(JSBI.BigInt(100500), 100500, 14)).toEqual(8);
    });
});
