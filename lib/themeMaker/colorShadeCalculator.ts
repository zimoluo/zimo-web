import colorConvert from "color-convert";

function calculateLightness(rgb: ColorSchemeData): number {
  return (Math.max(...rgb) + Math.min(...rgb)) / 2;
}

function calculateSaturation(rgb: ColorSchemeData): number {
  const hsv = colorConvert.rgb.hsv(rgb[0], rgb[1], rgb[2]);
  return hsv[1] / 100;
}

function hsvToRgb(hsv: ColorSchemeData): ColorSchemeData {
  return colorConvert.hsv.rgb(hsv);
}

function adjustHsvLightnessSaturation(
  rgb: ColorSchemeData,
  targetLightness: number,
  targetSaturation: number
): ColorSchemeData {
  const hsv = colorConvert.rgb.hsv(rgb[0], rgb[1], rgb[2]);
  const newHsv = [
    hsv[0],
    Math.max(0, Math.min(targetSaturation, 100)),
    targetLightness,
  ];
  return hsvToRgb(newHsv as ColorSchemeData);
}

export function generateShadeMap(hexColor: HexColor): {
  index: number;
  shadeMap: HexColor[];
} {
  const cleanHex = (
    hexColor.startsWith("#") ? hexColor.slice(1) : hexColor
  ).toLowerCase();
  const rgb = colorConvert.hex.rgb(cleanHex);
  const lightness = calculateLightness(rgb);
  const inputSaturation = calculateSaturation(rgb);

  const meanLightnessByIndex = [247, 235, 215, 186, 154, 129, 108, 90, 75, 65];
  const meanSaturationByIndex = [
    0.057, 0.145, 0.294, 0.497, 0.716, 0.865, 0.92, 0.91, 0.868, 0.818,
  ];

  const closestIndex = meanLightnessByIndex.reduce(
    (prev, curr, index) =>
      Math.abs(curr - lightness) <
      Math.abs(meanLightnessByIndex[prev] - lightness)
        ? index
        : prev,
    0
  );

  const referenceSaturationAtIndex = meanSaturationByIndex[closestIndex];
  const scalingFactor =
    referenceSaturationAtIndex !== 0
      ? inputSaturation / referenceSaturationAtIndex
      : 0;
  const scaledSaturation = meanSaturationByIndex.map((s) => s * scalingFactor);

  const shadeMap = scaledSaturation.map((s, i) => {
    const adjustedColor = adjustHsvLightnessSaturation(
      rgb,
      meanLightnessByIndex[i],
      s
    );
    return "#" + colorConvert.rgb.hex(adjustedColor);
  });

  return { index: closestIndex, shadeMap: shadeMap as HexColor[] };
}

export function generateRandomColor(): ColorSchemeData {
  const randomHex =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  return colorConvert.hex.rgb(randomHex);
}
