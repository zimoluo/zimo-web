import { randomIntFromRange } from "../generalHelper";
import { hsv } from "color-convert";

const getRandomGradientType = (): string => {
  const baseTypes = ["linear-", "radial-", "conic-"];
  const baseType = baseTypes[randomIntFromRange(0, baseTypes.length - 1)];
  const repeatingPrefix = randomIntFromRange(0, 1) === 0 ? "repeating-" : "";
  return `${repeatingPrefix}${baseType}gradient`;
};

export const getRandomNewLayer = (): ColorGradient => {
  const angle = `${randomIntFromRange(0, 359)}deg`;
  const posX = `${randomIntFromRange(15, 85)}%`;
  const posY = `${randomIntFromRange(15, 85)}%`;
  const sizeX = randomIntFromRange(25, 60);
  const sizeY =
    sizeX +
    randomIntFromRange(-Math.floor(sizeX * 0.08), Math.ceil(sizeX * 0.08));

  const h = randomIntFromRange(0, 359);
  const s = randomIntFromRange(80, 100);
  const v = randomIntFromRange(75, 100);

  const colorBase = `#${hsv.hex([h, s, v])}`;
  const colorWithOpacity = `${colorBase}${randomIntFromRange(153, 187).toString(
    16
  )}`;

  return {
    type: getRandomGradientType(),
    angle,
    posX,
    posY,
    sizeX: `${sizeX}%`,
    sizeY: `${sizeY}%`,
    stops: [
      {
        color: colorWithOpacity,
        at: "0%",
      },
      {
        color: `${colorBase}00`,
        at: `${randomIntFromRange(50, 100)}%`,
      },
    ],
  };
};
export const emptyLayer: ColorGradient = {
  type: "linear-gradient",
  angle: "0deg",
  posX: "0%",
  posY: "0%",
  sizeX: "100%",
  sizeY: "100%",
  stops: [
    {
      color: "#ffffff00",
      at: "0%",
    },
    {
      color: "#ffffff00",
      at: "100%",
    },
  ],
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
  gradientData.angle ??= "0deg";
  gradientData.posX ??= "50%";
  gradientData.posY ??= "50%";
  gradientData.sizeX ??= "20%";
  gradientData.sizeY ??= "20%";
};

export const emptyStop: GradientStop = {
  color: "ffffff00",
  at: "0%",
};

export const getStopColorString = (
  color: ColorQuartet,
  isWidgetOpacity: boolean
): string => {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
    isWidgetOpacity ? "$opacity%" : color[3].toFixed(2)
  }})`;
};

export const getStopAtString = (at: number): string => {
  return `${Math.min(Math.max(0, at), 100)}%`;
};
