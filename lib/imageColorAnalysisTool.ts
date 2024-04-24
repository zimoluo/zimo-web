import { getColorFromURL } from "color-thief-node";
import sharp from "sharp";

async function fetchAndConvertImage(url: string) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");

  if (contentType !== "image/svg+xml") {
    return url;
  }

  const buffer = await response.arrayBuffer();
  const pngBuffer = await sharp(buffer).png().resize(128, 128).toBuffer();
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

export async function analyzeImageColor(sub: string, index: number | string) {
  const path = `https://zimo-web-bucket.s3.us-east-2.amazonaws.com/account/themeImages/${sub}/bg-${index}`;
  const imageUrl = await fetchAndConvertImage(path);
  const colorArray = await getColorFromURL(imageUrl);

  return colorArray;
}
