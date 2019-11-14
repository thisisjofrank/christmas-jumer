const SongDetector = require("./SongDetector");

const fakeConfig = {
    "azure-account": "some-account",
    "azure-containerName": "some-container",
    "azure-blobStorage": `https://some-account.blob.core.windows.net`,
    "azure-key": "some-azure-key",
    "audd-token": "some-audd-token"
};

describe("Song detector", () => {

    it("Execute returns song title from AudD API call.",  async () => {
        const mockAxios = axiosPostSucceeds(auddResponseWithTitle("some title"));
        const mockAzure = azureUploaderThatReturns("http://some/uploaded/file/location");
        const sut = new SongDetector(fakeConfig, mockAxios, mockAzure);

        const result = await sut.execute(new ArrayBuffer(0));

        expect(result.body).toBe("some title");
    });

    it("Execute calls AudD with API token from configuration",  async () => {
        const mockAxios = axiosPostSucceeds();
        const mockAzure = azureUploaderThatReturns("http://some/uploaded/file/location");
        const sut = new SongDetector(fakeConfig, mockAxios, mockAzure);

        await sut.execute(new ArrayBuffer(0));

        expect(urlsCalled[0].startsWith("https://api.audd.io/?api_token=some-audd-token")).toBe(true);
    });

    it("Execute instructs AudD to download song from azure blob storage",  async () => {
        const mockAxios = axiosPostSucceeds();
        const mockAzure = azureUploaderThatReturns("http://some/uploaded/file/location");
        const sut = new SongDetector(fakeConfig, mockAxios, mockAzure);

        await sut.execute(new ArrayBuffer(0));

        const parts = urlsCalled[0].split('&url=')[1];
        expect(parts).toBe("http://some/uploaded/file/location");
    });

    it("Integration test: Can detect song that we know about when run against the real AudD API",  async () => {
        const sut = new SongDetector();
        const songContents = await require("fs").readFileSync("./test-data/02 - Jingle Bell Rock.mp3");

        const result = await sut.execute(songContents);

        expect(result.body.toLowerCase()).toBe("jingle bell rock");
    }, 10 * 1000);
});

const azureUploaderThatReturns = (url) => () => url;
const auddResponseWithTitle = (title) => ({ data: { result: { title: title } } });
const urlsCalled = [];
const axiosPostSucceeds = (responseObject) => ({
    post: (url) => {
        responseObject = responseObject || auddResponseWithTitle("something");
        urlsCalled.push(url);
        return responseObject;
    }
});
