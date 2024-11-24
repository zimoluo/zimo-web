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
  pastel: 2,
  light: 0,
  site: 6,
};

export const invertedIndexMap: Record<AccentColors, number> = {
  primary: 0,
  saturated: 3,
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
    // if the color is grayscale, then the generated color must also be grayscale
    const newS =
      s < 0.01
        ? 0
        : Math.min(100, Math.max(0, s - 6 + (12 * i) / (numShades - 1)));
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
    (shade) => "#" + colorConvert.hsl.hex(shade).replace(/^#/, "").toLowerCase()
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

export function opacityToHex(number: number): string {
  const validNumber = Math.min(Math.max(number, 0), 1);

  const hex = Math.round(validNumber * 255)
    .toString(16)
    .padStart(2, "0");

  return hex;
}

export function hexToOpacity(hex: string): number {
  const isValidHex = /^[0-9A-Fa-f]{2}$/.test(hex);
  if (!isValidHex) {
    return 0;
  }

  const decimal = parseInt(hex, 16);

  const number = decimal / 255;

  const roundedNumber = Math.round(number * 100) / 100;

  return roundedNumber;
}

export function rgbaToHex({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a: number;
}): HexColor {
  return `#${colorConvert.rgb.hex([r, g, b])}${opacityToHex(
    a as number
  )}`.toLowerCase() as HexColor;
}

export function hexToRgba(hex: HexColor): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const isValidHex = /^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex);
  if (!isValidHex) {
    return { r: 255, g: 255, b: 255, a: 0 };
  }

  const trimmedColor = hex.startsWith("#") ? hex.slice(1) : hex;
  const [r, g, b] = colorConvert.hex.rgb(trimmedColor.slice(0, 6));
  const opacity =
    trimmedColor.length === 8 ? hexToOpacity(trimmedColor.slice(6)) : 1;

  return { r, g, b, a: opacity };
}

export const intelligentlyGenerateThemeConfig = (
  mainColor: ColorTriplet,
  alternate: ColorTriplet,
  threshold: number = 9
): ThemeDataConfig => {
  const baseColor = `#${colorConvert.rgb.hex(mainColor)}`;
  const { index, shadeMap } = generateShadeMap(baseColor as HexColor, 17);

  const mainAccentTypes: Exclude<AccentColors, "site">[] = [
    "primary",
    "saturated",
    "pastel",
    "light",
  ];

  const isInverted = index > threshold;

  const indexMap = isInverted ? invertedIndexMap : regularIndexMap;

  const accentColors: any = {};

  mainAccentTypes.forEach((accentType) => {
    accentColors[accentType] = colorConvert.hex.rgb(
      shadeMap[indexMap[accentType]]
    );
  });

  const { shadeMap: gradientShadeMap } = generateShadeMap(
    `#${colorConvert.rgb.hex(alternate)}`,
    32
  );

  const paletteData: RawColorPaletteData = {
    ...(accentColors as Record<Exclude<AccentColors, "site">, ColorTriplet>),
    widget: [
      {
        type: "linear-gradient",
        angle: 30,
        stops: [
          {
            at: 20,
            color: colorConvert.hex.rgb(gradientShadeMap[isInverted ? 22 : 1]),
            opacity: 1,
            isWidgetOpacity: true,
          },
          {
            at: 80,
            color: colorConvert.hex.rgb(gradientShadeMap[isInverted ? 25 : 2]),
            opacity: 1,
            isWidgetOpacity: true,
          },
        ],
      },
    ],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            at: 15,
            color: colorConvert.hex.rgb(gradientShadeMap[isInverted ? 19 : 2]),
            opacity: 1,
          },
          {
            at: 85,
            color: colorConvert.hex.rgb(gradientShadeMap[isInverted ? 25 : 3]),
            opacity: 1,
          },
        ],
      },
    ],
  };

  return {
    palette: paletteData,
    siteThemeColor: gradientShadeMap[isInverted ? 20 : 4],
    favicon: {
      mode: "separate",
      gradient: [
        {
          stops: [
            { color: gradientShadeMap[isInverted ? 22 : 10], offset: 0.0 },
            { color: gradientShadeMap[isInverted ? 16 : 4], offset: 1.0 },
          ],
        },
      ],
    },
  };
};
