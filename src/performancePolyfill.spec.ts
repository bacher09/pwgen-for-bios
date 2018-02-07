import { monotonicTime } from "./performancePolyfill";

describe("Check performance.now polyfill", () => {
    it("monotonicTime should return number", () => {
        expect(typeof monotonicTime()).toEqual("number");
    });
});
