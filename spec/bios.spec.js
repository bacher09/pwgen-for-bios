var bios = require('../javascript/decrypt_bios.js');

describe("Decryp BIOS", function() {
    it("Sony key for 1234567 is 9648669", function() {
        expect(bios.Sony.solve("1234567")).toEqual(["9648669"]);
    });

    it("Sony input validation", function() {
        expect(bios.Sony.check("1234")).toBe(false);
        expect(bios.Sony.check("1234567")).toBe(true);
        expect(bios.Sony.check("0123456")).toBe(true);
        expect(bios.Sony.check("123o567")).toBe(false);
    });

    it("Samsung key for 07088120410C0000 is 12345", function() {
        expect(bios.Samsung.solve("07088120410C0000")).toEqual(["12345"]);
    });

    it("Samsung input validation", function() {
        expect(bios.Samsung.check("07088120410C0000")).toBe(true);
        expect(bios.Samsung.check("07088120410C")).toBe(true);
        expect(bios.Samsung.check("07088120410C00")).toBe(true);
        expect(bios.Samsung.check("0123456")).toBe(false);
        expect(bios.Samsung.check("07088a20410C00")).toBe(true);
    });
});
