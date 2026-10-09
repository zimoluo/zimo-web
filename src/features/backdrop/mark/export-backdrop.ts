import { GALLERY_PATHS } from "./motif";

const attribute = (value: string): string => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
export function exportBackdropMarkSvg({ image, base, stroke, outline = GALLERY_PATHS[3], viewBox = 1024 }: {
  readonly image: string; readonly base: string; readonly stroke: string;
  readonly outline?: string; readonly viewBox?: number;
}): string {
  if (!Number.isFinite(viewBox) || viewBox <= 64) throw new RangeError("Mark viewBox must exceed the stroke inset of 64");
  const literalImage = image.replaceAll("var(--zw-surface-alpha)", "1");
  const literalBase = base.replaceAll("var(--zw-surface-alpha)", "1");
  const background = `width:100%;height:100%;border-radius:50%;background-image:${[literalImage, literalBase].filter((image) => image !== "none").join(", ") || "none"}`;
  const radius = viewBox / 2 - 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBox} ${viewBox}" width="${viewBox}" height="${viewBox}"><defs><clipPath id="zw-export-disc"><circle cx="${viewBox / 2}" cy="${viewBox / 2}" r="${radius}"/></clipPath></defs><foreignObject x="32" y="32" width="${viewBox - 64}" height="${viewBox - 64}" clip-path="url(#zw-export-disc)"><div xmlns="http://www.w3.org/1999/xhtml" style="${attribute(background)}"></div></foreignObject><path d="${attribute(outline)}" fill="none" stroke="${attribute(stroke)}" stroke-width="64" stroke-linecap="round" stroke-linejoin="round"/></svg>\n`;
}


export async function rasterizeMarkSvg(svg: string, size = 1024): Promise<Blob> {
  if (!Number.isInteger(size) || size < 1 || size > 8192) throw new RangeError("Export size must be an integer from 1 to 8192");
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("This browser could not render the mark SVG"));
    image.src = url;
  });
  const canvas = document.createElement("canvas"); canvas.width = size; canvas.height = size;
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("This browser does not support image export");
  context.drawImage(image, 0, 0, size, size);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob === null ? reject(new Error("The mark could not be exported as PNG")) : resolve(blob), "image/png");
  });
}
