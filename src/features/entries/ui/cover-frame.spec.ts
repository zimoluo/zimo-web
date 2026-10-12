import { describe, expect, it } from "vitest";
import { coverFrameRatio, galleryFrameRatio } from "./cover-frame";
const image = { src: "/photos/cover.jpg", width: 1600, height: 900, alt: "Cover" };
describe("album framing", () => {
  it("ignores changing authentication query strings and fragments", () => {
    for (const frame of [coverFrameRatio, galleryFrameRatio]) expect(frame(image)).toBe(frame({ ...image, src: `${image.src}?signature=rotating#image` }));
  });
  it("preserves the original public URL seed and signed xorshift arithmetic", () => {
    const src = "https://zimo-web-bucket.s3.us-east-2.amazonaws.com/photos/public/posts/view/spring-collection-2026-05-01/image0.jpeg";
    const photo = { ...image, src, width: 1200, height: 1600 };
    expect(galleryFrameRatio(photo)).toBeCloseTo(0.7311101443483494, 12);
    expect(coverFrameRatio(photo)).toBe(0.731);
  });
  it("keeps square covers square while retaining gallery variation", () => {
    const square = { ...image, height: image.width };
    expect(coverFrameRatio(square)).toBe(1);
    expect(galleryFrameRatio(square)).not.toBe(1);
    for (let index = 0; index < 100; index++) {
      const photo = { ...image, src: `/photos/${index}.jpg` };
      for (const frame of [coverFrameRatio, galleryFrameRatio]) {
        expect(frame(photo)).toBeGreaterThanOrEqual(photo.width / photo.height * .85 - .001);
        expect(frame(photo)).toBeLessThanOrEqual(photo.width / photo.height * 1.15 + .001);
      }
    }
  });
});
