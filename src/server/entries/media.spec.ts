import { expect, it } from "vitest";
import { attachDocumentMedia } from "./media";

it("shares intrinsic metadata without replacing per-occurrence image meaning", () => {
  const properties = [
    { src: "/same.webp", alt: "Front view" },
    { src: "/same.webp", alt: "", caption: "Decorative here" },
    { src: "/same.webp" },
    { src: "/unknown.webp", alt: "Unknown asset" },
  ];
  const document = { children: properties.map((properties) => ({ type: "element", tagName: "img", properties })) };
  attachDocumentMedia(document, [{ src: "/same.webp", alt: "Catalog fallback", caption: "Default caption", width: 640, height: 480, originalSrc: "/original.png" }]);
  expect(properties[0]).toMatchObject({ alt: "Front view", width: 640, height: 480, caption: "Default caption" });
  expect(properties[1]).toMatchObject({ alt: "", caption: "Decorative here", originalSrc: "/original.png" });
  expect(properties[2]).toMatchObject({ alt: "Catalog fallback", width: 640 });
  expect(properties[3]).toEqual({ src: "/unknown.webp", alt: "Unknown asset" });
});
