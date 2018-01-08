import { insydeSolver } from "./insyde";

describe("Insyde BIOS", () => {
    it("Insyde key for 03133610 is 12891236", () => {
        expect(insydeSolver("03133610")).toEqual(["12891236"]);
    });
    it("Insyde key for 12345678 is 03023278", () => {
        expect(insydeSolver("12345678")).toEqual(["03023278"]);
    });

    it("test invalid keys", () => {
        expect(insydeSolver("123456789")).toEqual([]);
        expect(insydeSolver("1234567")).toEqual([]);
    });
});
