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
        expect(bios.Sony.check("1234567D")).toBe(false);
    });

    it("Samsung key for 07088120410C0000 is 12345", function() {
        expect(bios.Samsung.solve("07088120410C0000")).toEqual(["12345"]);
    });

    it("Samsung input validation", function() {
        expect(bios.Samsung.check("07088120410C0000")).toBe(true);
        expect(bios.Samsung.check("07088120410C000000")).toBe(false);
        expect(bios.Samsung.check("07088120410C000O")).toBe(false);
        expect(bios.Samsung.check("07088120410C")).toBe(true);
        expect(bios.Samsung.check("07088120410C00")).toBe(true);
        expect(bios.Samsung.check("0123456")).toBe(false);
        expect(bios.Samsung.check("07088a20410C00")).toBe(true);
    });

    it("HPMini key for CNU1234ABC is e9l37fvcpe", function() {
        expect(bios.HPMini.solve("CNU1234ABC")).toEqual(["e9l37fvcpe"]);
    });

    it("HPMini input validation", function() {
        expect(bios.HPMini.check("CNU1234ABC")).toBe(true);
        expect(bios.HPMini.check("CNU1234ABCV")).toBe(false);
        expect(bios.HPMini.check("CNU12$4ABC")).toBe(false);
        expect(bios.HPMini.check("CNU12п4ABC")).toBe(false);
    });

    it("Insyde key for 03133610 is 12891236", function() {
        expect(bios.Insyde.solve("03133610")).toEqual(["12891236"]);
    });

    it("Insyde input validation", function() {
        expect(bios.Insyde.check("12345678")).toBe(true);
        expect(bios.Insyde.check("123456789")).toBe(false);
        expect(bios.Insyde.check("1234o678")).toBe(false);
        expect(bios.Insyde.check("12345678d")).toBe(false);
    });

    it("FSI 20 dec old key for 1234-4321-1234-4321-1234 is 7122790 or 10cphf0b", function() {
        expect(bios.FSI20DecOld.solve(bios.CleanSerial("1234-4321-1234-4321-1234")))
            .toEqual(["7122790", "10cphf0b"]);

        expect(bios.FSI20DecOld.solve(bios.CleanSerial("1234-4321-1234-4321-1236")))
            .toEqual(["7122790", "100phf0b"]);
    })
});
