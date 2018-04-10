import { samsungSolver } from "./samsung";

describe("Test Samsung BIOS", () => {
    it("Samsung key for 07088120410C0000 is 12345", () => {
        expect(samsungSolver("07088120410C0000")).toEqual(["12345"]);
    });
    it("Samsung key for 07088120410C is 12345", () => {
        expect(samsungSolver("07088120410C")).toEqual(["12345"]);
    });

    it("Samsung key for 1AA9CD4638C0186000 is 5728000", () => {
        expect(samsungSolver("1AA9CD4638C0186000")).toEqual(["5728000"]);
    });

    it("Samsung key for 1AA9CD4638C0186001 is 5728000@", () => {
        expect(samsungSolver("1AA9CD4638C0186001")).toEqual(["5728000@"]);
    });
    it("test invalid keys", () => {
        expect(samsungSolver("1AA9CD4638C01860Z0")).toEqual([]);
        expect(samsungSolver("1AA9CD4638C01860000")).toEqual([]);
    });
});
