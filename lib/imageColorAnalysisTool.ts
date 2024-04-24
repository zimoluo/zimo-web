import sharp from "sharp";
import Vibrant from "node-vibrant";

async function fetchAndConvertImage(url: string): Promise<string | Buffer> {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");

  if (contentType !== "image/svg+xml") {
    return url;
  }

  const buffer = await response.arrayBuffer();
  const pngBuffer = await sharp(buffer).png().resize(128, 128).toBuffer();
  return pngBuffer;
}

export async function analyzeImageColor(
  sub: string,
  index: number | string
): Promise<ColorSchemeData | null> {
  const path = `https://zimo-web-bucket.s3.us-east-2.amazonaws.com/account/themeImages/${sub}/bg-${index}`;
  const imageUrl = await fetchAndConvertImage(path);
  const vibrant = new Vibrant(imageUrl);
  const palette = await vibrant.getPalette();

  const colors = palette.Vibrant?.rgb;

  if (!colors) {
    return null;
  }

  return colors;
}
