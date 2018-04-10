import { keygen, solvers } from "./";

describe("BIOS keygen", () => {
    it("Sony key for 1234567 is 9648669", () => {
        let keysList = keygen("1234567");
        expect(keysList[0][1]).toEqual(["9648669"]);
    });
    it("Solvers names should be unique", () => {
        let names: {[key: string]: boolean} = {};
        solvers.forEach((solver) => {
            if (solver.biosName in names) {
                throw Error(`${solver.biosName} isn't unique name`);
            } else {
                names[solver.biosName] = true;
            }
        });
    });
});
