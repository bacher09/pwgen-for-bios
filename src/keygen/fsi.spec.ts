import { fsi20DecNewSolver, fsi20DecOldSolver, fsi24DecSolver, fsi24Hex203cSolver, fsiHexSolver } from "./fsi";

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
    it("FSI key for 8F16-1234-4321-1234-4321-1234 is sjqtka8l", () => {
        expect(fsi24DecSolver("8F16-1234-4321-1234-4321-1234")).toEqual(["sjqtka8l"]);
    });

    it("FSI key for 1234-7234-4321-1234-4321-1234 is smqtkaa5", () => {
        expect(fsi24DecSolver("1234-7234-4321-1234-4321-1234")).toEqual(["smqtkaa5"]);
    });

    it("test invalid keys", () => {
        expect(fsi24DecSolver("1234-4321-1234-4321-1234-1")).toEqual([]);
        expect(fsi24DecSolver("1234-1234-4321-1234-4321-BEEF")).toEqual([]);
        expect(fsi24DecSolver("F234-4321-1234-4321-1234-1234-1")).toEqual([]);
        expect(fsi24DecSolver("1234-1234-4321-1234-4321-BEEF")).toEqual([]);
    });
});

describe("Test Fujitsu-Siemens 6x4 hex 203c-d001", () => {
    it("FSI key for 203c-d001-0000-001d-e960-227d is 494eab7c", () => {
        expect(fsi24Hex203cSolver("203c-d001-0000-001d-e960-227d")).toEqual(["494eab7c"]);
    });
    it("FSI key for 203c-d001-4f30-609d-5125-646a is 66b14918", () => {
        expect(fsi24Hex203cSolver("203c-d001-4f30-609d-5125-646a")).toEqual(["66b14918"]);
    });

    it("FSI key for 203C-D001-4F30-609D-5125-646a is 66b14918", () => {
        expect(fsi24Hex203cSolver("203C-D001-4F30-609D-5125-646a")).toEqual(["66b14918"]);
    });
});
