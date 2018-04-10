// OPENSRC-1D3B = S3yJ91q0Gar3O72I
// ABCDEFG-1D3B xvn0qEeftqyrkG52
// NOSOUP4-3A5B zvd97y9h
// 7G9C0G2-6FF1 35c0b0tVb32Z6ivD
//
//
// HDD SN WXH109A14712  ?
import {
    calculateSuffix, dellHddSolver, dellSolver, DellTag, hddOldSolver, keygenDell, SuffixType
} from "./dell";

// shortcut for simpler testing
function checkSuffix(serial: string, tag: DellTag, type: SuffixType): number[] {
    serial = serial.concat(tag);
    let serialArr: number[] = serial.split("").map((c) => c.charCodeAt(0));
    return calculateSuffix(serialArr, tag, type);
}

describe("Test calculateSuffix", () => {
    it("Check tag suffix for: 1234567-595B", () => {
        let suffix = checkSuffix("1234567", DellTag.Tag595B, SuffixType.ServiceTag);
        expect(suffix).toEqual([25, 34, 38, 8, 32, 48, 23, 8]);
    });

    it("Check tag suffix for: 1234567-D35B", () => {
        let suffix = checkSuffix("1234567", DellTag.TagD35B, SuffixType.ServiceTag);
        expect(suffix).toEqual([25, 34, 38, 8, 32, 48, 23, 8]);
    });

    it("Check tag suffix for: 1234567-2A7B", () => {
        let suffix = checkSuffix("1234567", DellTag.Tag2A7B, SuffixType.ServiceTag);
        expect(suffix).toEqual([101, 103, 102, 117, 115, 100, 97, 117]);
    });

    it("Check tag suffix for: 1234567-A95B", () => {
        let suffix = checkSuffix("1234567", DellTag.TagA95B, SuffixType.ServiceTag);
        expect(suffix).toEqual([25, 34, 38, 8, 32, 48, 23, 8]);
    });

    it("Check tag suffix for: 1234567-1D3B", () => {
        let suffix = checkSuffix("1234567", DellTag.Tag1D3B, SuffixType.ServiceTag);
        expect(suffix).toEqual([65, 78, 57, 72, 97, 56, 80, 72]);
    });

    it("Check tag suffix for: 1234567-6FF1", () => {
        let suffix = checkSuffix("1234567", DellTag.Tag6FF1, SuffixType.ServiceTag);
        expect(suffix).toEqual([51, 73, 56, 52, 76, 122, 71, 52]);
    });

    it("Check tag suffix for: 1234567-1F66", () => {
        let suffix = checkSuffix("1234567", DellTag.Tag1F66, SuffixType.ServiceTag);
        expect(suffix).toEqual([117, 66, 48, 111, 83, 107, 85, 111]);
    });

    // HDD
    it("Check hdd suffix for: 12345678901-595B", () => {
        let suffix = checkSuffix("12345678901", DellTag.Tag595B, SuffixType.HDD);
        expect(suffix).toEqual([5, 9, 35, 6, 47, 5, 21, 32]);
    });

    it("Check hdd suffix for: 12345678901-D35B", () => {
        let suffix = checkSuffix("12345678901", DellTag.TagD35B, SuffixType.HDD);
        expect(suffix).toEqual([5, 9, 35, 6, 47, 5, 21, 32]);
    });

    it("Check hdd suffix for: 12345678901-2A7B", () => {
        let suffix = checkSuffix("12345678901", DellTag.Tag2A7B, SuffixType.HDD);
        expect(suffix).toEqual([48, 51, 113, 98, 107, 48, 99, 115]);
    });

    it("Check hdd suffix for: 12345678901-A95B", () => {
        let suffix = checkSuffix("12345678901", DellTag.TagA95B, SuffixType.HDD);
        expect(suffix).toEqual([5, 9, 35, 6, 47, 5, 21, 32]);
    });

    it("Check hdd suffix for: 12345678901-1D3B", () => {
        let suffix = checkSuffix("12345678901", DellTag.Tag1D3B, SuffixType.HDD);
        expect(suffix).toEqual([48, 73, 55, 118, 76, 48, 99, 97]);
    });

    it("Check hdd suffix for: 12345678901-6FF1", () => {
        let suffix = checkSuffix("12345678901", DellTag.Tag6FF1, SuffixType.HDD);
        expect(suffix).toEqual([48, 112, 75, 86, 101, 48, 77, 76]);
    });

    it("Check hdd suffix for: 12345678901-1F66", () => {
        let suffix = checkSuffix("12345678901", DellTag.Tag1F66, SuffixType.HDD);
        expect(suffix).toEqual([48, 114, 79, 71, 55, 48, 49, 83]);
    });
});

describe("Test keygenDell", () => {
    it("Dell password for: 1234567-595B", () => {
        expect(keygenDell("1234567", DellTag.Tag595B, SuffixType.ServiceTag))
        .toEqual("46rg65ky");
    });
    it("Dell password for: 1234567-D35B", () => {
        expect(keygenDell("1234567", DellTag.TagD35B, SuffixType.ServiceTag))
        .toEqual("5tc8q9re");
    });
    it("Dell password for: 1234567-2A7B", () => {
        expect(keygenDell("1234567", DellTag.Tag2A7B, SuffixType.ServiceTag))
        .toEqual("J1KuwWpSUgnDarfi");
    });
    it("Dell password for: 1234567-A95B", () => {
        expect(keygenDell("1234567", DellTag.TagA95B, SuffixType.ServiceTag))
        .toEqual("46rg65ky");
    });
    it("Dell password for: 1234567-1D3B", () => {
        expect(keygenDell("1234567", DellTag.Tag1D3B, SuffixType.ServiceTag))
        .toEqual("Sn4fkF8bS57NymZl");
    });
    it("Dell password for: 1234567-1F66", () => {
        expect(keygenDell("1234567", DellTag.Tag1F66, SuffixType.ServiceTag))
        .toEqual("kIpTBzx0m3s10JDR");
    });
    it("Dell password for: 1234567-6FF1", () => {
        expect(keygenDell("1234567", DellTag.Tag6FF1, SuffixType.ServiceTag))
        .toEqual("Rzn1wGe555H5bM2r");
    });
    it("Dell password for: OPENSRC-1D3B", () => {
        expect(keygenDell("OPENSRC", DellTag.Tag1D3B, SuffixType.ServiceTag))
        .toEqual("S3yJ91q0Gar3O72I");
    });
    it("Dell password for: ABCDEFG-1D3B", () => {
        expect(keygenDell("ABCDEFG", DellTag.Tag1D3B, SuffixType.ServiceTag))
        .toEqual("xvn0qEeftqyrkG52");
    });
    it("Dell password for: 7G9C0G2-6FF1", () => {
        expect(keygenDell("7G9C0G2", DellTag.Tag6FF1, SuffixType.ServiceTag))
        .toEqual("35c0b0tVb32Z6ivD");
    });
    it("Dell password for: DELLSUX-1F66", () => {
        expect(keygenDell("DELLSUX", DellTag.Tag1F66, SuffixType.ServiceTag))
        .toEqual("qHXaL0ntli6Gu4c0");
    });
    it("Dell password for: CRPP562-1F66", () => {
        expect(keygenDell("CRPP562", DellTag.Tag1F66, SuffixType.ServiceTag))
        .toEqual("8i5qLGa9woA919Ys");
    });
    it("Dell password for: CDG8T32-1F66", () => {
        expect(keygenDell("CDG8T32", DellTag.Tag1F66, SuffixType.ServiceTag))
        .toEqual("4Ke3y2L3kTP2f6Vo");
    });
    it("Dell password for: 8M5RQ32-1F66", () => {
        expect(keygenDell("8M5RQ32", DellTag.Tag1F66, SuffixType.ServiceTag))
        .toEqual("3rlrbaSj46Iw221g");
    });
    // HDD
    it("Dell HDD password for: 1234567890A-595B", () => {
        expect(keygenDell("1234567890A", DellTag.Tag595B, SuffixType.HDD))
        .toEqual("nyoap4lq");
    });
    it("Dell HDD password for: 1234567890A-D35B", () => {
        expect(keygenDell("1234567890A", DellTag.TagD35B, SuffixType.HDD))
        .toEqual("dc14blrd");
    });
    it("Dell HDD password for: 1234567890A-2A7B", () => {
        expect(keygenDell("1234567890A", DellTag.Tag2A7B, SuffixType.HDD))
        .toEqual("h6lwdi91qluUyt3u");
    });
    it("Dell HDD password for: 1234567890A-A95B", () => {
        expect(keygenDell("1234567890A", DellTag.TagA95B, SuffixType.HDD))
        .toEqual("qr0s6x4n");
    });
    it("Dell HDD password for: 1234567890A-1D3B", () => {
        expect(keygenDell("1234567890A", DellTag.Tag1D3B, SuffixType.HDD))
        .toEqual("6JQ1WacHNNR0Taia");
    });
    it("Dell HDD password for: 1234567890A-1F66", () => {
        expect(keygenDell("1234567890A", DellTag.Tag1F66, SuffixType.HDD))
        .toEqual("vP0M31x066Z7Rq9p");
    });
    it("Dell HDD password for: 1234567890A-6FF1", () => {
        expect(keygenDell("1234567890A", DellTag.Tag6FF1, SuffixType.HDD))
        .toEqual("5enLLpM3Immfb8CK");
    });
});

describe("Test Dell BIOS", () => {
    it("Dell for 12345678901 is yyyyyhnn", () => {
        expect(hddOldSolver("12345678901")).toEqual(["yyyyyhnn"]);
    });
    it("Dell for 1234567-595B", () => {
        expect(dellSolver("1234567-595B")).toEqual(["46rg65ky"]);
    });
    it("Dell for: 1234567-1F66", () => {
        expect(dellSolver("1234567-1f66")).toEqual(["kIpTBzx0m3s10JDR"]);
    });
    it("Dell HDD for: 1234567890A-595B", () => {
        expect(dellHddSolver("1234567890A-595b")).toEqual(["nyoap4lq"]);
    });
    it("Check bad dell tag", () => {
        expect(dellSolver("1234567-BAD1")).toEqual([]);
        expect(dellSolver("1234567-TOLONG")).toEqual([]);
        expect(dellHddSolver("1234567-SHORT")).toEqual([]);
    });
});
