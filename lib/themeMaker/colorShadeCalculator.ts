import colorConvert from "color-convert";

const meanLightnessByIndex = [247, 235, 215, 186, 154, 129, 108, 90, 75, 70];
const meanSaturationByIndex = [
  0.057, 0.145, 0.294, 0.497, 0.716, 0.865, 0.92, 0.91, 0.868, 0.907,
];

function calculateLightness(rgb: ColorTriplet): number {
  return (Math.max(...rgb) + Math.min(...rgb)) / 2;
}

function calculateSaturation(rgb: ColorTriplet): number {
  const hsv = colorConvert.rgb.hsv(rgb);
  return hsv[1] / 100;
}

function adjustHsvLightnessSaturation(
  rgb: ColorTriplet,
  targetLightness: number,
  targetSaturation: number
): ColorTriplet {
  const hsv = colorConvert.rgb.hsv(rgb);
  const newHsv: ColorTriplet = [
    hsv[0],
    Math.max(0, Math.min(targetSaturation, 100)),
    targetLightness / 2.55,
  ];
  return colorConvert.hsv.rgb(newHsv);
}

export function generateShadeMap(color: string): {
  index: number;
  shadeMap: string[];
} {
  const rgb = colorConvert.hex.rgb(color);
  const lightness = calculateLightness(rgb);
  const closestIndex = meanLightnessByIndex.reduce(
    (prev, curr, index) =>
      Math.abs(curr - lightness) <
      Math.abs(meanLightnessByIndex[prev] - lightness)
        ? index
        : prev,
    0
  );
  const inputSaturation = calculateSaturation(rgb);
  const referenceSaturationAtIndex = meanSaturationByIndex[closestIndex];
  const scalingFactor = inputSaturation / (referenceSaturationAtIndex || 1);
  const scaledSaturation = meanSaturationByIndex.map(
    (s) => s * scalingFactor * 100
  );
  const shadeMap = scaledSaturation.map((s, index) => {
    const colorRgb = adjustHsvLightnessSaturation(
      rgb,
      meanLightnessByIndex[index],
      s
    );
    return `#${colorConvert.rgb.hex(colorRgb)}`;
  });

  return {
    index: closestIndex,
    shadeMap: shadeMap,
  };
}
