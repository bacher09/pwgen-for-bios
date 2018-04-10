import { asusSolver } from "./asus";
import { dellHddSolver, dellSolver, hddOldSolver } from "./dell";
import { fsi20DecNewSolver, fsi20DecOldSolver, fsiHexSolver } from "./fsi";
import { hpMiniSolver } from "./hpmini";
import { insydeSolver } from "./insyde";
import { monotonicTime } from "../polyfills/performancePolyfill";
import {
    phoenixFsiLSolver, phoenixFsiPSolver, phoenixFsiSolver,
    phoenixFsiSSolver, phoenixFsiXSolver, phoenixHPCompaqSolver, phoenixSolver
} from "./phoenix";
import { samsungSolver } from "./samsung";
import { sonySolver } from "./sony";
import { Solver } from "./utils";

export type KeygenResult = [Solver, string[], number];

export const solvers: Solver[] = [
    asusSolver,
    sonySolver,
    samsungSolver,
    hddOldSolver,
    dellSolver,
    dellHddSolver,
    fsiHexSolver,
    fsi20DecNewSolver,
    fsi20DecOldSolver,
    hpMiniSolver,
    insydeSolver,
    phoenixSolver,
    phoenixHPCompaqSolver,
    phoenixFsiSolver,
    phoenixFsiLSolver,
    phoenixFsiPSolver,
    phoenixFsiSSolver,
    phoenixFsiXSolver
];

// NOTE: In future this function can change or even be removed
export function keygen(serial: string): KeygenResult[] {
    return solvers
        .map((solver): KeygenResult => {
            let startTime = monotonicTime();
            let passwords = solver(serial);
            let calcTime = monotonicTime() - startTime;
            return [solver, passwords, calcTime];
        }).filter(([_, passwords]) => passwords !== undefined && passwords.length >= 1);
}
