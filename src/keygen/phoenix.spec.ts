import * as bios from "./phoenix";

describe("Test Phoenix BIOS", () => {
    it("check correct passwords", () => {
        expect(bios.phoenixSolver.calculateHash("abstoou")).toEqual(12345);
        expect(bios.phoenixHPCompaqSolver.calculateHash("vnflm")).toEqual(12345);
        expect(bios.phoenixFsiSolver.calculateHash("411113")).toEqual(12345);
        expect(bios.phoenixFsiLSolver.calculateHash("362153")).toEqual(12345);
        expect(bios.phoenixFsiPSolver.calculateHash("4465237")).toEqual(12345);
        expect(bios.phoenixFsiSSolver.calculateHash("71669")).toEqual(12345);
        expect(bios.phoenixFsiXSolver.calculateHash("739979")).toEqual(12345);
    });

    it("find password for hash 12345", () => {
        function phoenixValidate(solver: bios.PhoenixSolver, hash: string): number {
            let newPassword = solver(hash)[0];
            expect(newPassword).not.toBeUndefined();
            return solver.calculateHash(newPassword);
        }

        expect(phoenixValidate(bios.phoenixSolver, "12345")).toEqual(12345);
        expect(phoenixValidate(bios.phoenixHPCompaqSolver, "12345")).toEqual(12345);
        expect(phoenixValidate(bios.phoenixFsiSolver, "12345")).toEqual(12345);
        expect(phoenixValidate(bios.phoenixFsiLSolver, "12345")).toEqual(12345);
        expect(phoenixValidate(bios.phoenixFsiPSolver, "12345")).toEqual(12345);
        expect(phoenixValidate(bios.phoenixFsiSSolver, "12345")).toEqual(12345);
        expect(phoenixValidate(bios.phoenixFsiXSolver, "12345")).toEqual(12345);
    });
});
