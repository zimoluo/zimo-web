import type { ColorTriplet } from "@/src/features/theme/model/v10-types";
import type { ImageColorAnalysisResult } from "@/src/features/theme/studio/model/types";
import "server-only";
import { Vibrant } from "node-vibrant/node";

export async function analyzeImageColor(
  image: Buffer
): Promise<ImageColorAnalysisResult | null> {
  const vibrant = new Vibrant(image);
  const palette = await vibrant.getPalette();

  const vibrantColors = palette.Vibrant?.rgb;
  const alternateColors = palette.DarkVibrant?.rgb;

  if (!vibrantColors || !alternateColors) {
    return null;
  }

  return {
    vibrant: vibrantColors.map((color) =>
      Math.max(0, Math.min(255, Math.round(color)))
    ) as ColorTriplet,
    alternate: alternateColors.map((color) =>
      Math.max(0, Math.min(255, Math.round(color)))
    ) as ColorTriplet,
  };
}
