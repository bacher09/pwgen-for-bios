import { samsung44HexSolver, samsungSolver } from "./samsung";

describe("Test Samsung BIOS", () => {
    it("Samsung key for 07088120410C0000 is 12345", () => {
        expect(samsungSolver("07088120410C0000")).toEqual(["12345"]);
    });
    it("Samsung key for 07088120410C is 12345", () => {
        expect(samsungSolver("07088120410C")).toEqual(["12345"]);
    });

    it("Samsung key for 1AA9CD4638C0186000 is 5728000", () => {
        expect(samsungSolver("1AA9CD4638C0186000")).toEqual(["5728000"]);
    });

    it("Samsung key for 1AA9CD4638C0186001 is 5728000@", () => {
        expect(samsungSolver("1AA9CD4638C0186001")).toEqual(["5728000@"]);
    });
    it("test invalid keys", () => {
        expect(samsungSolver("1AA9CD4638C01860Z0")).toEqual([]);
        expect(samsungSolver("1AA9CD4638C01860000")).toEqual([]);
    });
});

describe("Test Samsung 44 hex digit", () => {
    it("Samsung 44 keys", () => {
        expect(samsung44HexSolver("59F72F85239CC9DB6239DEDDC5C4CDB43A37D5533003")).toEqual(["justin"]);
        expect(samsung44HexSolver("351EF13822577610E4ED863695BD6CB7B356A5227185")).toEqual(["Diegocoelho"]);
        expect(samsung44HexSolver("D78EF5B5CA236F4869662339D9912C39B727D50BB285")).toEqual(["auroradvr23"]);
        expect(samsung44HexSolver("DF6E02658349EC455407A5CD60666AC01B26C0465004")).toEqual(["20160530"]);
        expect(samsung44HexSolver("7856AC492A91B6A343B267680D4CDC016C8906194004")).toEqual(["2016 714"]);
        expect(samsung44HexSolver("0C2D3C17293624ABAC569559CACA5E8C97E5BCE5D206")).toEqual(["////#/eeeeee"]);
        expect(samsung44HexSolver("F0AC97598FCB9BEB0E8C69478055833466C9E61BD102")).toEqual(["6793"]);
        expect(samsung44HexSolver("22D8DBEF1B9A2D24AAC8663A58B1AC5AB6AD2D5AF105")).toEqual(["Kimmiecat3"]);
        expect(samsung44HexSolver("0E45ED5D2EF8949498AF1A9C2763726091E4850D1105")).toEqual(["Car2096994"]);
        expect(samsung44HexSolver("8DD4D28455C8CDD06C4372190E9B264D1927E6C9F107")).toEqual(["97925178294647"]);
        expect(samsung44HexSolver("54574AAD6A8B1B9353F6FA66DCD2DA91B06DBD8E3204")).toEqual(["tokadmin"]);
        expect(samsung44HexSolver("BF5EC2647227EDC493BDBBB8C4BD0DB53DE6BD533083")).toEqual(["jonzkho"]);
        expect(samsung44HexSolver("DED9EA70EA68EB1D3CDDB32C05CCE6391807D59B8083")).toEqual(["sup0r73"]);
        expect(samsung44HexSolver("B6C5525D15BCA963277178ED150EA3A968994698B382")).toEqual(["12345"]);
        expect(samsung44HexSolver("525052DF4524459125E750FA97B7DCBDB98DA5EE7303")).toEqual(["wilson"]);
        expect(samsung44HexSolver("8DD5CFD4ADBC740A9EEF381383EADE621C23CCA10302")).toEqual(["4328"]);
        expect(samsung44HexSolver("AEF53EE53CD1B453CACE163989950D3A3696A1835306")).toEqual(["philthebrave"]);
        expect(samsung44HexSolver("2D2FB35C18B2B4846F1F989846036E6CA968E4C87005")).toEqual(["2945670211"]);
        // lowercase
        expect(samsung44HexSolver("2d2fb35c18b2b4846f1f989846036e6ca968e4c87005")).toEqual(["2945670211"]);
    });
    it("Samsung 44 invalid keys", () => {
        expect(samsung44HexSolver("2D2FB35C18B2B4846F1F989846036E6DA968E4C87005")).toEqual([]);
        expect(samsung44HexSolver("B6C5525D15BCA963277178ED150EA3A968994698B38")).toEqual([]);
        expect(samsung44HexSolver("B6C5525D15BCA963277178ED150EA3A968994698B3833")).toEqual([]);
        expect(samsung44HexSolver("DF6E02658349EC455407A5CD60666AC01B26C046508A")).toEqual([]);
    });
});
