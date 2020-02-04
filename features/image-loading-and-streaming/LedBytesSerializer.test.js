const FrameSerializer = require("./LedBytesSerializer");

describe("LedBytesSerializer", () => {
    const sut = new FrameSerializer();

    it("can serialize a frame to the non-json wireformat", () => {
        const result = sut.serialize(validSingleFrameData);
        const parts = result.split("\`");

        expect(parts[0]).toBe("default");
        expect(parts[1]).toBe("fc 1");
        expect(parts[2]).toBe("fi 0");
    });

    it("can correctly serialize the frame duration", () => {
        const result = sut.serialize(validSingleFrameData);
        const parts = result.split("\`");

        expect(parts[4].startsWith("1000,")).toBe(true);
    });

    it("can correctly serialize the palette", () => {
        const result = sut.serialize(validSingleFrameData);
        const parts = result.split("\`");

        expect(parts[3]).toBe("ff0000,000000");
    });

    it("can correctly serialize a single frame", () => {
        const result = sut.serialize(validSingleFrameData);
        const parts = result.split("\`");

        expect(parts[4]).toBe("1000,0,1");
    });

    it("can correctly serialize multiple frames", () => {
        const result = sut.serialize(validMultipleFrameData);
        const parts = result.split("\`");

        expect(parts[4]).toBe("1000,0,1");
        expect(parts[5]).toBe("1000,1,0");
    });

    it("always ends the packet with a backtick", () => {
        const result = sut.serialize(validMultipleFrameData);

        expect(result.endsWith("\`")).toBe(true);
    });

    it("can compress pixel colours when they appear in sequence (e.g. 1,1,1,1 becomes 1x4)", () => {
        const result = sut.serialize(frameWithCompressableImage, true);
        const parts = result.split("\`");

        expect(parts[4]).toBe("1000,0,1x3,2x2");
        console.log(result);
    });

    it("can compress pixel colours when they appear in sequence, and there are multiple frames in the image", () => {
        const result = sut.serialize(multipleFrameWithCompressableImage, true);
        const parts = result.split("\`");

        expect(parts[4]).toBe("1000,0,1x3,2x2");
        expect(parts[5]).toBe("1000,0,1x3,2x2");
        console.log(result);
    });
});

const validSingleFrameData = {
    imageKey: "default",
    frameCount: 1,
    frameIndex: 0,
    frames: [{ b: [0, 1], duration: 1000 }],
    palette: ["ff0000", "000000"],
};

const validMultipleFrameData = {
    imageKey: "default",
    frameCount: 1,
    frameIndex: 0,
    frames: [
        { b: [0, 1], duration: 1000 },
        { b: [1, 0], duration: 1000 }
    ],
    palette: ["ff0000", "000000"],
};

const frameWithCompressableImage = {
    imageKey: "default",
    frameCount: 1,
    frameIndex: 0,
    frames: [{ b: [0, 1, 1, 1, 2, 2], duration: 1000 }],
    palette: ["ff0000", "000000", "00000e"],
};

const multipleFrameWithCompressableImage = {
    imageKey: "default",
    frameCount: 1,
    frameIndex: 0,
    frames: [
        { b: [0, 1, 1, 1, 2, 2], duration: 1000 },
        { b: [0, 1, 1, 1, 2, 2], duration: 1000 },
    ],
    palette: ["ff0000", "000000", "00000e"],
};