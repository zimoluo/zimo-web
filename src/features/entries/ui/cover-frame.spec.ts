import { describe, expect, it } from "vitest";
import { coverFrameRatio } from "./cover-frame";
const image = { src: "/photos/cover.jpg", width: 1600, height: 900, alt: "Cover" };
describe("album cover framing", () => {
  it("keeps a stable crop across content hosts and ignores signed query parameters", () => {
    expect(coverFrameRatio(image)).toBe(coverFrameRatio({ ...image, src: "https://content.example/photos/cover.jpg?signature=rotating" }));
  });
  it("keeps square covers square and bounds non-square cropping", () => {
    expect(coverFrameRatio({ ...image, height: image.width })).toBe(1);
    for (let index = 0; index < 100; index++) {
      const ratio = coverFrameRatio({ ...image, src: `/photos/${index}.jpg` });
      expect(ratio).toBeGreaterThanOrEqual(image.width / image.height * .85 - .001);
      expect(ratio).toBeLessThanOrEqual(image.width / image.height * 1.15 + .001);
    }
  });
});
