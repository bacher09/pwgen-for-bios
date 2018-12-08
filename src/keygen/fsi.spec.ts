import { fsi20DecNewSolver, fsi20DecOldSolver, fsiHexSolver, fsi24DecSolver } from "./fsi";

describe("Test Fujitsu-Siemens 5x4 hexadecimal BIOS", () => {
    it("FSI key for 1234-4321-1234-4321-1234 is 35682708", () => {
        expect(fsiHexSolver("1234-4321-1234-4321-1234")).toEqual(["35683789"]);
    });
    it("FSI key for AAAA-BBBB-CCCC-DEAD-BEEF is 64830592", () => {
        expect(fsiHexSolver("AAAA-BBBB-CCCC-DEAD-BEEF")).toEqual(["64830592"]);
        expect(fsiHexSolver("AAAABBBBCCCCDEADBEEF")).toEqual(["64830592"]);
    });
    it("FSI key for DEADBEEF is 64830592", () => {
        expect(fsiHexSolver("DEADBEEF")).toEqual(["64830592"]);
    });
    it("test invalid keys", () => {
        expect(fsiHexSolver("AAAA-BBBB-CCCC-DEAD-CODE")).toEqual([]);
        expect(fsiHexSolver("AAAA-BBBB-CCCC-DEAD-BEEF-12")).toEqual([]);
    });
});

describe("Test Fujitsu-Siemens 5x4 decimal new", () => {
    it("FSI key for 1234-4321-1234-4321-1234 is 7122790", () => {
        expect(fsi20DecNewSolver("1234-4321-1234-4321-1234")).toEqual(["7122790"]);
    });

    it("FSI key for 7234-4321-1234-4321-1234 is 3122790", () => {
        expect(fsi20DecNewSolver("7234-4321-1234-4321-1234")).toEqual(["3122790"]);
    });

    it("test invalid keys", () => {
        expect(fsi20DecNewSolver("1234-4321-1234-4321-1234-1")).toEqual([]);
        expect(fsi20DecNewSolver("1234-4321-1234-4321-BEEF")).toEqual([]);
    });
});

describe("Test Fujitsu-Siemens 5x4 decimal old", () => {
    it("FSI key for 1234-4321-1234-4321-1234 is 10cphf0b", () => {
        expect(fsi20DecOldSolver("1234-4321-1234-4321-1234")).toEqual(["10cphf0b"]);
    });

    it("FSI key for 7234-4321-1234-4321-1234 is 10cphf0b", () => {
        expect(fsi20DecOldSolver("7234-4321-1234-4321-1234")).toEqual(["90ldhf0b"]);
    });

    it("test invalid keys", () => {
        expect(fsi20DecOldSolver("1234-4321-1234-4321-1234-1")).toEqual([]);
        expect(fsi20DecOldSolver("1234-4321-1234-4321-BEEF")).toEqual([]);
    });
});

describe("Test Fujitsu-Siemens 6x4 decimal", () => {
    it("FSI key for 1234-4321-1234-4321-1234-3213 is qzxuwj1n", () => {
        expect(fsi24DecSolver("1234-4321-1234-4321-1234-3213")).toEqual(["qzxuwj1n"]);
    });

    it("FSI key for 7234-4321-1234-4321-1234-3211 is qz9uwj1n", () => {
        expect(fsi24DecSolver("7234-4321-1234-4321-1234-3211")).toEqual(["qz9uwj1n"]);
    });

    it("test invalid keys", () => {
        expect(fsi24DecSolver("1234-4321-1234-4321-1234-1")).toEqual([]);
        expect(fsi24DecSolver("1234-4321-1234-4321-BEEF")).toEqual([]);
    });
});