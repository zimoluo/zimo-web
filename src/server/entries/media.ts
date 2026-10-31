import type { ImageAsset } from "../../features/entries/model/types";

export function attachDocumentMedia(document: unknown, images: readonly ImageAsset[]): void {
  const assets = new Map(images.map((image) => [image.src, image]));
  const attach = (node: unknown): void => {
    if (typeof node !== "object" || node === null) return;
    const value = node as { type?: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] };
    if (value.type === "element" && value.tagName === "img" && value.properties !== undefined) {
      const asset = assets.get(String(value.properties.src));
      if (asset !== undefined) Object.assign(value.properties, {
        width: asset.width, height: asset.height,
        ...(typeof value.properties.alt === "string" ? {} : { alt: asset.alt }),
        ...(asset.placeholder === undefined ? {} : { placeholder: asset.placeholder }),
        ...(value.properties.caption !== undefined || asset.caption === undefined ? {} : { caption: asset.caption }),
        ...(asset.originalSrc === undefined ? {} : { originalSrc: asset.originalSrc }),
      });
    }
    value.children?.forEach(attach);
  };
  attach(document);
}
