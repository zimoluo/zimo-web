import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import type { MeasureImage } from "./transform";

export const measureImage: MeasureImage = async (src, alt, caption, originalSrc) => {
  let bytes: Buffer;
  if (src.startsWith("/")) {
    const path = resolve("public", `.${src}`);
    if (!path.startsWith(`${resolve("public")}/`)) throw new Error("Image escapes public directory");
    bytes = await readFile(path);
  } else {
    const url = new URL(src);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Unsupported image protocol");
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Could not measure ${src}: ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
  }
  const metadata = await sharp(bytes).metadata();
  if (metadata.width === undefined || metadata.height === undefined) throw new Error(`Image dimensions unavailable: ${src}`);
  const rotated = metadata.orientation !== undefined && metadata.orientation >= 5;
  const placeholder = await sharp(bytes).rotate().resize({ width: 10 }).webp({ quality: 40 }).toBuffer();
  return { src, alt, width: rotated ? metadata.height : metadata.width, height: rotated ? metadata.width : metadata.height, placeholder: `data:image/webp;base64,${placeholder.toString("base64")}`, ...(caption === undefined ? {} : { caption }), ...(originalSrc === undefined ? {} : { originalSrc }) };
};
