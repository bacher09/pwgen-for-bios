import { keygen } from "./keygen";

describe("BIOS keygen", () => {
    it("Sony key for 1234567 is 9648669", () => {
        let keysList = keygen("1234567");
        expect(keysList[0][1]).toEqual(["9648669"]);
    });
});
