import { camelToKebabCase } from "./generalHelper";

const gradientProcessingRules: Record<string, string> = {
  "linear-gradient": "$angle",
  "repeating-linear-gradient": "$angle",
  "radial-gradient": "$sizeX $sizeY at $posX $posY",
  "repeating-radial-gradient": "$sizeX $sizeY at $posX $posY",
  "conic-gradient": "from $angle at $posX $posY",
  "repeating-conic-gradient": "from $angle at $posX $posY",
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
        style[`--color-${camelToKebabCase(key)}`] = value.join(" ");
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

function generateGradientStyle(gradients: ColorGradient[]): string {
  return gradients.map((g) => gradientCSS(g, 100)).join(", ");
}

function gradientCSS(gradient: ColorGradient, opacity?: number): string {
  if (gradient.type === "custom" && gradient.content) {
    const cleanContent = gradient.content
      .trim()
      .replace(/^[\s,;]+|[\s,;]+$/g, "")
      .split(",")
      .map((color) => modifyColor(color.trim(), opacity))
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

  const base = `${gradient.type}(${processingRule.replace(
    /\$(\w+)/g,
    (_, p1) => {
      return (
        gradient[p1 as keyof (LinearGradientData & RadialGradientData)] ?? "0%"
      );
    }
  )}`;

  const stops = gradient.stops
    .map((stop) => `${modifyColor(stop.color, opacity)} ${stop.at}`)
    .join(", ");

  return `${base}, ${stops})`;
}

function modifyColor(color: string, opacity?: number): string {
  return opacity ? color.replace("$opacity", opacity.toString()) : color;
}

function generateWidgetGradients(
  style: Record<string, string>,
  gradients: ColorGradient[]
): void {
  for (let opacity = 10; opacity <= 100; opacity += 10) {
    const key = `--bg-widget-${opacity}`;
    style[key] = gradients.map((g) => gradientCSS(g, opacity)).join(", ");
  }
}
