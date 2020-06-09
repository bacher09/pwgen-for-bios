import { acerInsyde10Solver, AES128, Crc64, insydeSolver, Sha256} from "./insyde";

describe("Insyde BIOS", () => {
    it("Insyde key for 03133610 is 12891236", () => {
        expect(insydeSolver("03133610")).toEqual(["12891236"]);
    });
    it("Insyde key for 12345678 is 03023278", () => {
        expect(insydeSolver("12345678")).toEqual(["03023278"]);
    });

    it("test invalid keys", () => {
        expect(insydeSolver("123456789")).toEqual([]);
        expect(insydeSolver("1234567")).toEqual([]);
    });
});

describe("Acer Insyde 10 BIOS", () => {
    it("Check Acer solver", () => {
        expect(acerInsyde10Solver("0173549286")).toEqual(["e0eac38fdfcfd74a"]);
        expect(acerInsyde10Solver("1014206418")).toEqual(["3c0a50907bc2c604"]);
        expect(acerInsyde10Solver("1765418418")).toEqual(["5f54e355b83e969c"]);
        expect(acerInsyde10Solver("1858408509")).toEqual(["c4791532114cfbab"]);
        expect(acerInsyde10Solver("1925715998")).toEqual(["f21cce78c0987233"]);
        expect(acerInsyde10Solver("2051611322")).toEqual(["1c648cb56e8a64bb"]);
        expect(acerInsyde10Solver("2036529205")).toEqual(["f2e874332b6f50b1"]);
        expect(acerInsyde10Solver("1768688657")).toEqual(["80774329818c3312"]);
        expect(acerInsyde10Solver("1746144265")).toEqual(["c3d46da5f6f3c75b"]);
        expect(acerInsyde10Solver("1611926546")).toEqual(["f61c86479a8a6b20"]);
        expect(acerInsyde10Solver("1355047683")).toEqual(["7fe913d78ffc5ed1"]);
        expect(acerInsyde10Solver("1373072054")).toEqual(["aebeae5c425684cd"]);
        expect(acerInsyde10Solver("1373899792")).toEqual(["a26970a4ffb62d49"]);
        expect(acerInsyde10Solver("1395185025")).toEqual(["a763280d9f7396ec"]);
        expect(acerInsyde10Solver("1205532638")).toEqual(["0f29abe2243b5a5e"]);
        expect(acerInsyde10Solver("1378359327")).toEqual(["0cb381199969833e"]);
        expect(acerInsyde10Solver("1880388286")).toEqual(["021df1cd9695387d"]);
        expect(acerInsyde10Solver("2025088185")).toEqual(["018261c3cbe60945"]);
    });
});

describe("Utils", () => {
    it("sha256", () => {
        expect(new Sha256(Uint8Array.from([])).hexdigest())
            .toEqual("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

        expect(new Sha256([1]).hexdigest())
            .toEqual("4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a");

        expect(new Sha256([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).hexdigest())
            .toEqual("c848e1013f9f04a9d63fa43ce7fd4af035152c7c669a4a404b67107cee5f2e4e");

        expect(new Sha256("test".split("").map((v) => v.charCodeAt(0))).hexdigest())
            .toEqual("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");

        expect(new Sha256("0".repeat(256).split("").map((v) => v.charCodeAt(0))).hexdigest())
            .toEqual("67f022195ee405142968ca1b53ae2513a8bab0404d70577785316fa95218e8ba");

        expect(new Sha256("0".repeat(56).split("").map((v) => v.charCodeAt(0))).hexdigest())
            .toEqual("bd03ac1428f0ea86f4b83a731ffc7967bb82866d8545322f888d2f6e857ffc18");
    });
    it("AES128", () => {
        const numbers = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        const myaes = new AES128(numbers);
        expect(myaes.encryptBlock(numbers))
            .toEqual(Uint8Array.from([52, 195, 59, 127, 20, 253, 83, 220, 234, 37, 224, 26, 2, 225, 103, 39]));

        expect(myaes.encryptBlock(Uint8Array.from("123456789abcdefg".split("").map((v) => v.charCodeAt(0)))))
            .toEqual(Uint8Array.from([111, 52, 225, 193, 98, 40, 19, 168, 122, 34, 93, 3, 146, 166, 202, 100]));
    });
    it("crc64", () => {
        let mycrc = new Crc64(Crc64.ECMA_POLYNOMIAL);
        mycrc.update([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        expect(mycrc.hexdigest()).toEqual("335a089168033fbe");
        mycrc.reset();
        mycrc.update([0x80]);
        expect(mycrc.hexdigest()).toEqual("c96c5795d7870f42");
        mycrc.reset();
        mycrc.update(Uint8Array.from([0xde, 0xad, 0xbe, 0xef]));
        expect(mycrc.hexdigest()).toEqual("fc232c18806871af");
    });
});
