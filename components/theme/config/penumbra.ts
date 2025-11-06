import colorConvert from "color-convert";

interface ColorMultipliers {
  hue?: number;
  saturation?: number;
  brightness?: number;
}

const SHADOW_RGB: ColorTriplet = [46, 48, 55];

function transformRgb(
  rgb: ColorTriplet,
  { hue = 1, saturation = 1, brightness = 1 }: ColorMultipliers
): ColorTriplet {
  if (hue === 1 && saturation === 1 && brightness === 1) {
    return rgb; // make sure the stock color reference is returned directly to prevent floating point errors
  }

  const [r, g, b] = rgb;
  const [h, s, l] = colorConvert.rgb.hsl(rgb);

  let newH: number, newS: number, newL: number;

  // Special case for shadow color to only apply hue changes
  if (r === SHADOW_RGB[0] && g === SHADOW_RGB[1] && b === SHADOW_RGB[2]) {
    newH = (h * hue) % 360;
    newS = s;
    newL = l;
  } else {
    newH = (h * hue) % 360;
    newS = Math.min(100, Math.max(0, s * saturation));
    newL = Math.min(100, Math.max(0, l * brightness));
  }

  return colorConvert.hsl.rgb([newH, newS, newL]);
}

function transformHex(hex: HexColor, multipliers: ColorMultipliers): HexColor {
  const { hue = 1, saturation = 1, brightness = 1 } = multipliers;

  if (hue === 1 && saturation === 1 && brightness === 1) {
    return hex;
  }

  // use existing RGB transform
  const rgb = colorConvert.hex.rgb(hex);
  const newRgb = transformRgb([rgb[0], rgb[1], rgb[2]], multipliers);

  return `#${colorConvert.rgb.hex(newRgb)}`;
}

// an experimental "variation" of the Penumbra theme that can be used in any hues and scheme
// it's not perfect and there are no plans to actually make it good. but it does what it does, which is to make some dark-mode variations of this theme
// and i made sure the original penumbra theme is untouched
export function generatePenumbraConfig(
  multipliers: ColorMultipliers = {}
): ThemeDataConfig {
  const mults: Required<ColorMultipliers> = {
    hue: multipliers.hue ?? 1,
    saturation: multipliers.saturation ?? 1,
    brightness: multipliers.brightness ?? 1,
  };

  return {
    palette: {
      primary: transformRgb([239, 239, 240], mults),
      saturated: transformRgb([194, 195, 201], mults),
      pastel: transformRgb([102, 106, 128], mults),
      light: transformRgb([75, 78, 96], mults),
      page: [
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([77, 80, 95], mults), opacity: 1, at: 0 },
            { color: transformRgb([77, 80, 95], mults), opacity: 1, at: 39.99 },
            { color: transformRgb([255, 255, 255], mults), opacity: 0, at: 40 },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([46, 48, 55], mults), opacity: 1, at: 24 },
            { color: transformRgb([46, 48, 55], mults), opacity: 0, at: 41.8 },
            { color: transformRgb([255, 255, 255], mults), opacity: 0, at: 42 },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([72, 75, 88], mults), opacity: 1, at: 0 },
            { color: transformRgb([72, 75, 88], mults), opacity: 1, at: 59.99 },
            { color: transformRgb([255, 255, 255], mults), opacity: 0, at: 60 },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([46, 48, 55], mults), opacity: 1, at: 36 },
            { color: transformRgb([46, 48, 55], mults), opacity: 0, at: 61.8 },
            { color: transformRgb([255, 255, 255], mults), opacity: 0, at: 62 },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([66, 69, 81], mults), opacity: 1, at: 0 },
            { color: transformRgb([66, 69, 81], mults), opacity: 1, at: 79.99 },
            { color: transformRgb([255, 255, 255], mults), opacity: 0, at: 80 },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([46, 48, 55], mults), opacity: 1, at: 64 },
            { color: transformRgb([46, 48, 55], mults), opacity: 0, at: 81.8 },
            { color: transformRgb([255, 255, 255], mults), opacity: 0, at: 82 },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([60, 63, 74], mults), opacity: 1, at: 0 },
            { color: transformRgb([60, 63, 74], mults), opacity: 1, at: 99.99 },
            {
              color: transformRgb([255, 255, 255], mults),
              opacity: 0,
              at: 100,
            },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([46, 48, 55], mults), opacity: 1, at: 64 },
            { color: transformRgb([46, 48, 55], mults), opacity: 0, at: 101.8 },
            {
              color: transformRgb([255, 255, 255], mults),
              opacity: 0,
              at: 102,
            },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([55, 57, 66], mults), opacity: 1, at: 0 },
            {
              color: transformRgb([55, 57, 66], mults),
              opacity: 1,
              at: 119.99,
            },
            {
              color: transformRgb([255, 255, 255], mults),
              opacity: 0,
              at: 120,
            },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "radial-gradient",
          stops: [
            { color: transformRgb([46, 48, 55], mults), opacity: 1, at: 64 },
            { color: transformRgb([46, 48, 55], mults), opacity: 0, at: 121.8 },
            {
              color: transformRgb([255, 255, 255], mults),
              opacity: 0,
              at: 122,
            },
          ],
          posX: 50,
          posY: 50,
          isCircle: true,
          sizeKeyword: "farthest-side",
        },
        {
          type: "linear-gradient",
          stops: [
            { at: 0, color: transformRgb([50, 52, 59], mults), opacity: 1 },
            { at: 100, color: transformRgb([50, 52, 59], mults), opacity: 1 },
          ],
          angle: 0,
        },
      ],
      pageMinimal: [
        {
          type: "linear-gradient",
          stops: [
            { color: transformRgb([60, 63, 74], mults), opacity: 1, at: 0 },
            { color: transformRgb([60, 63, 74], mults), opacity: 1, at: 100 },
          ],
          angle: 90,
        },
      ],
      widget: [
        {
          type: "linear-gradient",
          stops: [
            {
              color: transformRgb([84, 88, 100], mults),
              opacity: 1,
              isWidgetOpacity: true,
              at: 20,
            },
            {
              color: transformRgb([75, 80, 96], mults),
              opacity: 1,
              isWidgetOpacity: true,
              at: 80,
            },
          ],
          angle: 45,
        },
      ],
    },
    siteThemeColor: transformHex("#3c3f4a", mults),
    favicon: { mode: "backdrop" },
  };
}

const penumbraConfig = generatePenumbraConfig();

export default penumbraConfig;
