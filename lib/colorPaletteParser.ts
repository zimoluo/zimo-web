import colorConvert from "color-convert";
import { camelToKebabCase } from "./generalHelper";
import { generateShadeMap } from "./themeMaker/colorHelper";
import { emptyLayer } from "./themeMaker/layerHelper";

const gradientProcessingRules: Record<string, string> = {
  "linear-gradient":
    "[{linearGradientKeyword ?? false} | to {linearHorizontalOrientation ?? left} {linearVerticalOrientation ?? top} | {angle}deg]",
  "repeating-linear-gradient":
    "[{linearGradientKeyword ?? false} | to {linearHorizontalOrientation ?? left} {linearVerticalOrientation ?? top} | {angle}deg]",
  "radial-gradient":
    "[{isCircle ?? false} | circle | null] [{isCircle ?? false} | {sizeKeyword ?? farthest-corner} | {sizeX}% {sizeY}%] at {posX}% {posY}%",
  "repeating-radial-gradient":
    "[{isCircle ?? false} | circle | null] [{isCircle ?? false} | {sizeKeyword ?? farthest-corner} | {sizeX}% {sizeY}%] at {posX}% {posY}%",
  "conic-gradient": "from {angle}deg at {posX}% {posY}%",
  "repeating-conic-gradient": "from {angle}deg at {posX}% {posY}%",
};

export const polarColorSpaces: PolarColorSpace[] = [
  "hsl",
  "hwb",
  "lch",
  "oklch",
];

const evaluateGradientRuleValue = (value: string) => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(parseFloat(value))) return Number(value);
  return value;
};

export function generateInlineStyleObject(
  obj: Partial<RawColorPaletteData>
): Record<string, string> {
  const style: Record<string, string> = {};

  for (const key in obj) {
    if (key === "widget") continue;

    const value = obj[key as keyof RawColorPaletteData];
    if (Array.isArray(value) && value.length > 0) {
      if (typeof value[0] === "number") {
        const kebabKey = camelToKebabCase(key);
        style[`--color-${kebabKey}`] = value.join(" ");

        const shadeMap = generateShadeMap(
          `#${colorConvert.rgb.hex(value as ColorTriplet)}`,
          22
        ).shadeMap;

        const highlightColor = colorConvert.hex.rgb(shadeMap[0]);
        const darklightColor = colorConvert.hex.rgb(shadeMap[20]);

        style[`--color-highlight-${kebabKey}`] = highlightColor.join(" ");
        style[`--color-darklight-${kebabKey}`] = darklightColor.join(" ");
      } else if (typeof value[0] === "object") {
        style[`--bg-${camelToKebabCase(key)}`] = generateGradientStyle(
          value as ColorGradient[]
        );
      }
    }
  }

  if (obj.widget) {
    const gradients = obj.widget as ColorGradient[];
    generateWidgetGradients(style, gradients);
  }

  return style;
}

function getFilteredGradients(gradients: ColorGradient[]): ColorGradient[] {
  const filteredGradients = gradients.filter((g) => !g.disabled);
  return filteredGradients.length === 0 ? [emptyLayer] : filteredGradients;
}

function generateGradientStyle(
  gradients: ColorGradient[],
  opacity: number = 100
): string {
  return getFilteredGradients(gradients)
    .map((g) => gradientCSS(g, opacity))
    .join(", ");
}

function gradientCSS(gradient: ColorGradient, opacity: number): string {
  if (gradient.type === "custom" && gradient.content) {
    const cleanContent = gradient.content
      .trim()
      .replace(/^[\s,;]+|[\s,;]+$/g, "")
      .split(",")
      .map((color) => parseCustomWidgetOpacity(color.trim(), opacity))
      .join(", ");
    return cleanContent;
  }

  if (!gradient.stops) {
    return ")";
  }

  const processingRule = gradientProcessingRules[gradient.type];
  if (!processingRule) {
    return ")";
  }

  const expandedRule = processingRule.replace(
    /\{(\w+)(\s*\?\?\s*(.*?))?\}/g,
    (_, keyword, _1, fallback) => {
      const value =
        gradient[keyword as keyof (LinearGradientData & RadialGradientData)];
      if (value !== undefined) {
        return `${value}`;
      } else if (fallback !== undefined) {
        return `${fallback}`;
      }
      return "0";
    }
  );

  const evaluatedRule = expandedRule.replace(
    /\[(\w+)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/g,
    (_, condition, ifTrue, ifFalse) => {
      const result = evaluateGradientRuleValue(condition) ? ifTrue : ifFalse;
      return result.trim() === "null" ? "" : result;
    }
  );

  const base = `${gradient.type}(${evaluatedRule.replace(/\s+/g, " ").trim()}`;

  let colorInterpolation = "";

  if (
    gradient.colorInterpolation &&
    gradient.colorInterpolation.colorSpace !== "default"
  ) {
    const { colorSpace } = gradient.colorInterpolation;
    const hueInterpolationMethod =
      gradient.colorInterpolation.hueInterpolationMethod ?? "shorter";

    colorInterpolation = ` in ${colorSpace}${
      polarColorSpaces.includes(colorSpace as PolarColorSpace)
        ? ` ${hueInterpolationMethod} hue`
        : ""
    }`;
  }

  const sortedStop = structuredClone(gradient.stops);

  sortedStop.sort((a, b) => a.at - b.at);

  const stops = sortedStop
    .map(
      (stop) =>
        `rgb(${stop.color.join(" ")} / ${
          stop.isWidgetOpacity ? stop.opacity * (opacity / 100) : stop.opacity
        }) ${stop.at}%`
    )
    .join(", ");

  return `${base}${colorInterpolation}, ${stops})`;
}

function parseCustomWidgetOpacity(color: string, opacity: number): string {
  return color.replace("$opacity", opacity.toString());
}

function generateWidgetGradients(
  style: Record<string, string>,
  gradients: ColorGradient[]
): void {
  for (let opacity = 10; opacity <= 100; opacity += 10) {
    const key = `--bg-widget-${opacity}`;
    style[key] = generateGradientStyle(gradients, opacity);
  }
}
