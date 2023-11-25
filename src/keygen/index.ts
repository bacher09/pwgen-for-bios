import { monotonicTime } from "../polyfills/performancePolyfill";
import { asusSolver } from "./asus";
import { dellHddSolver, dellLatitude3540Solver, dellSolver, hddOldSolver } from "./dell";
import { fsi20DecNewSolver, fsi20DecOldSolver, fsi24DecSolver, fsiHexSolver, fsi24Hex203cSolver } from "./fsi";
import { hpAMISolver } from "./hpami";
import { hpMiniSolver } from "./hpmini";
import { acerInsyde10Solver, hpInsydeSolver, insydeSolver } from "./insyde";
import {
    phoenixFsiLSolver, phoenixFsiPSolver, phoenixFsiSolver,
    phoenixFsiSSolver, phoenixFsiXSolver, phoenixHPCompaqSolver, phoenixSolver
} from "./phoenix";
import { samsung44HexSolver, samsungSolver } from "./samsung";
import { sonySolver } from "./sony";
import { sony4x4Solver } from "./sony_4x4";
import { Solver } from "./utils";

export type KeygenResult = [Solver, string[], number];

export const solvers: Solver[] = [
    asusSolver,
    acerInsyde10Solver,
    sonySolver,
    sony4x4Solver,
    samsung44HexSolver,
    samsungSolver,
    hddOldSolver,
    dellSolver,
    dellHddSolver,
    dellLatitude3540Solver,
    fsiHexSolver,
    fsi20DecNewSolver,
    fsi20DecOldSolver,
    fsi24DecSolver,
    fsi24Hex203cSolver,
    hpMiniSolver,
    hpInsydeSolver,
    hpAMISolver,
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
