import { asusKeygen, asusSolver } from "./asus";

// https://pastebin.com/L3c3rySj

describe("Test Asus keygen", () => {
    it("Asus password for 2007-02-01 is AA19BALA", () => {
        expect(asusKeygen(2007, 2, 1)).toEqual("AA19BALA");
    });

    it("Asus password for 2017-10-12 is AABABLAL", () => {
        expect(asusKeygen(2017, 10, 12)).toEqual("AABABLAL");
    });

    it("Asus password for 2020-09-15 is LBD9DBA1", () => {
        expect(asusKeygen(2020, 9, 15)).toEqual("LBD9DBA1");
    });

    it("Asus password for 2012-03-29 is AOBOBL2B", () => {
        expect(asusKeygen(2012, 3, 29)).toEqual("AOBOBL2B");
    });

    it("Asus password for 2002-01-02 is ALAA4ABA", () => {
        expect(asusKeygen(2002, 1, 2)).toEqual("ALAA4ABA");
    });
});

describe("Test Asus solver", () => {
    it("Asus password for 2007-02-01 is AA19BALA", () => {
        expect(asusSolver("2007-02-01")).toEqual(["AA19BALA"]);
    });

    it("Asus password for 01-02-2007 is AA19BALA (dmy format)", () => {
        expect(asusSolver("01-02-2007")).toEqual(["AA19BALA"]);
    });

    it("Asus password for 01022007 is AA19BALA (dmy format)", () => {
        expect(asusSolver("01022007")).toEqual(["AA19BALA"]);
    });

    it("41022007 is bad date", () => {
        expect(asusSolver("41022007")).toEqual([]);
    });
});
