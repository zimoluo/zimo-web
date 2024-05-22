import "server-only";
import Vibrant from "node-vibrant";

export async function analyzeImageColor(
  image: Buffer
): Promise<ColorTriplet | null> {
  const vibrant = new Vibrant(image);
  const palette = await vibrant.getPalette();

  const colors = palette.Vibrant?.rgb;

  if (!colors) {
    return null;
  }

  return colors;
}
