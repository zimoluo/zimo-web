import colorConvert from "color-convert";

export function generateRandomColor(): ColorTriplet {
  const randomHex =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  return colorConvert.hex.rgb(randomHex);
}

export const regularIndexMap: Record<AccentColors, number> = {
  primary: 13,
  saturated: 10,
  middle: 7,
  soft: 5,
  pastel: 2,
  light: 0,
  site: 5,
};

export const invertedIndexMap: Record<AccentColors, number> = {
  primary: 0,
  saturated: 3,
  middle: 5,
  soft: 7,
  pastel: 9,
  light: 11,
  site: 8,
};

export function generateShadeMap(
  inputColor: HexColor,
  numShades: number = 8
): {
  index: number;
  shadeMap: HexColor[];
} {
  const hsl = colorConvert.hex.hsl(inputColor);
  const [h, s, l] = hsl;

  const shadesHSL: ColorTriplet[] = [];
  for (let i = 0; i < numShades; i++) {
    const newL = 94 - i * (88 / (numShades - 1));
    const newS = Math.min(100, Math.max(0, s - 6 + (12 * i) / (numShades - 1)));
    shadesHSL.push([h, newS, newL]);
  }

  const shadesRGB = shadesHSL.map((shade) => colorConvert.hsl.rgb(shade));

  let minDistance = Infinity;
  let inputIndex = -1;
  shadesRGB.forEach((shade, index) => {
    const distance = shade.reduce(
      (acc, val, idx) =>
        acc + Math.pow(val - colorConvert.hex.rgb(inputColor)[idx], 2),
      0
    );
    if (distance < minDistance) {
      minDistance = distance;
      inputIndex = index;
    }
  });

  const shadesHex = shadesHSL.map(
    (shade) => "#" + colorConvert.hsl.hex(shade).replace(/^#/, "")
  );

  return {
    index: inputIndex,
    shadeMap: shadesHex as HexColor[],
  };
}

function colorDistance(rgb1: ColorTriplet, rgb2: ColorTriplet): number {
  return Math.sqrt(
    (rgb1[0] - rgb2[0]) ** 2 +
      (rgb1[1] - rgb2[1]) ** 2 +
      (rgb1[2] - rgb2[2]) ** 2
  );
}

export function isShadeMapRoughlyTheSame(
  map1: HexColor[],
  map2: HexColor[],
  threshold: number = 15
): boolean {
  for (let i = 0; i < map1.length; i++) {
    const rgb1 = colorConvert.hex.rgb(map1[i]);
    const rgb2 = colorConvert.hex.rgb(map2[i]);
    if (colorDistance(rgb1, rgb2) >= threshold) {
      return false;
    }
  }
  return true;
}
