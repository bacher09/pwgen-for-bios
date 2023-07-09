import { acerInsyde10Solver, hpInsydeSolver, insydeSolver } from "./insyde";

describe("Insyde BIOS", () => {
    it("Insyde key for 03133610 is 12891236", () => {
        expect(insydeSolver("03133610")[0]).toEqual("12891236");
    });
    it("Insyde key for 12345678 is 03023278", () => {
        expect(insydeSolver("12345678")[0]).toEqual("03023278");
    });

    it("Insyde key for 87654321 is 38732907", () => {
        expect(insydeSolver("87654321")[0]).toEqual("38732907");
    });

    it("Insyde key for 12345678 (all variants)", () => {
        expect(insydeSolver("12345678")).toEqual(["03023278", "16503512"]);
        expect(insydeSolver("03133610")).toEqual(["12891236", "24094120", "99534862"]);
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

describe("HP Insyde [i \d{8}] codes", () => {
    it("Check HP Insyde solver", () => {
        expect(hpInsydeSolver("i 70412809")[0]).toEqual("47283646");
        expect(hpInsydeSolver("i 76205377")[0]).toEqual("41898738");
        expect(hpInsydeSolver("i 52669168")[0]).toEqual("65436527");
        expect(hpInsydeSolver("i 58828448")[0]).toEqual("65477807");
        // user can type more spaces or use wrong case for `I`
        expect(hpInsydeSolver("I 62996480")[0]).toEqual("55507825");
        expect(hpInsydeSolver("i  51120876")[0]).toEqual("66775639");
        expect(hpInsydeSolver("I  69779941")[0]).toEqual("54526704");
        expect(hpInsydeSolver("i   75582785")[0]).toEqual("42313120");
        expect(hpInsydeSolver("I   52214872")[0]).toEqual("65889633");
        expect(hpInsydeSolver("i	77319488")[0]).toEqual("40986827");
        expect(hpInsydeSolver("i 68852353")[0]).toEqual("55443712");
        expect(hpInsydeSolver("i 59170869")[0]).toEqual("64725626");
        expect(hpInsydeSolver("i 63121056")[0]).toEqual("54774419");
        expect(hpInsydeSolver("i 68105474")[0]).toEqual("55798831");
        expect(hpInsydeSolver("i 87267970")[0]).toEqual("10836735");
        expect(hpInsydeSolver("i 93641394 ")[0]).toEqual("04454731");
        // uppercase I codes
        expect(hpInsydeSolver("i 51974384")[1]).toEqual("44652900");
        expect(hpInsydeSolver("I 51085312")[1]).toEqual("44983934");
        expect(hpInsydeSolver("I 86013615")[1]).toEqual("39971231");
        expect(hpInsydeSolver("I 59170869")[1]).toEqual("46858269");
        // invalid input
        expect(hpInsydeSolver("51120876")).toEqual([]);
        expect(hpInsydeSolver("i 511")).toEqual([]);
    });
});
