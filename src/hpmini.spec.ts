import { hpMiniSolver } from "./hpmini";

describe("Test HP Mini BIOS", () => {
    it("HPMini key for CNU1234ABC is e9l37fvcpe", () => {
        expect(hpMiniSolver("CNU1234ABC")).toEqual(["e9l37fvcpe"]);
    });
    it("HPMini key for CNU1234567 is e9l37fvqgx", () => {
        expect(hpMiniSolver("CNU1234567")).toEqual(["e9l37fvqgx"]);
    });
    it("test invalid keys", () => {
        expect(hpMiniSolver("CNU12345678")).toEqual([]);
        expect(hpMiniSolver("CNU1234")).toEqual([]);
    });
});
