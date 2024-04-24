import Vibrant from "node-vibrant";

export async function analyzeImageColor(
  sub: string,
  index: number | string
): Promise<ColorSchemeData | null> {
  const path = `https://zimo-web-bucket.s3.us-east-2.amazonaws.com/account/themeImages/${sub}/bg-${index}`;

  const response = await fetch(path);
  const contentType = response.headers.get("content-type");

  if (contentType !== "image/svg+xml") {
    return null;
  }

  const vibrant = new Vibrant(path);

  const palette = await vibrant.getPalette();

  const colors = palette.Vibrant?.rgb;

  if (!colors) {
    return null;
  }

  return colors;
}
