import { randomIntFromRange, randomUniform } from "../generalHelper";
import { hsv } from "color-convert";

const getRandomGradientType = (): string => {
  const baseTypes = ["linear-", "radial-", "conic-"];
  const baseType = baseTypes[randomIntFromRange(0, baseTypes.length - 1)];
  const repeatingPrefix = randomIntFromRange(0, 1) === 0 ? "repeating-" : "";
  return `${repeatingPrefix}${baseType}gradient`;
};

export const getRandomNewLayer = (): ColorGradient => {
  const angle = randomIntFromRange(0, 359);
  const posX = randomIntFromRange(15, 85);
  const posY = randomIntFromRange(15, 85);
  const sizeX = randomIntFromRange(25, 60);
  const sizeY =
    sizeX +
    randomIntFromRange(-Math.floor(sizeX * 0.08), Math.ceil(sizeX * 0.08));

  const h = randomIntFromRange(0, 359);
  const s = randomIntFromRange(80, 100);
  const v = randomIntFromRange(75, 100);

  const colorBase = hsv.rgb([h, s, v]);
  const opacity = randomUniform(0.6, 0.9);

  return {
    type: getRandomGradientType(),
    angle,
    posX,
    posY,
    sizeX,
    sizeY,
    stops: [
      {
        color: colorBase,
        at: 0,
        opacity,
        isWidgetOpacity: true,
      },
      {
        color: colorBase,
        at: randomIntFromRange(50, 100),
        opacity: 0,
        isWidgetOpacity: false,
      },
    ],
  };
};

export const emptyStop: GradientStop = {
  color: [255, 255, 255],
  opacity: 0,
  at: 0,
};

export const emptyStops: GradientStop[] = [
  emptyStop,
  { ...emptyStop, at: 100 },
];

export const emptyLayer: ColorGradient = {
  type: "linear-gradient",
  angle: 0,
  posX: 0,
  posY: 0,
  sizeX: 100,
  sizeY: 100,
  stops: emptyStops,
};

export const gradientTypeNameMap: Record<EditorGradientMode | string, string> =
  {
    "linear-gradient": "Linear",
    "radial-gradient": "Radial",
    "conic-gradient": "Conic",
    "repeating-linear-gradient": "Repeating linear",
    "repeating-radial-gradient": "Repeating radial",
    "repeating-conic-gradient": "Repeating conic",
  };

export const initializeGradientDataProperties = (
  gradientData: ColorGradient
) => {
  gradientData.angle ??= 0;
  gradientData.posX ??= 50;
  gradientData.posY ??= 50;
  gradientData.sizeX ??= 20;
  gradientData.sizeY ??= 20;
};
