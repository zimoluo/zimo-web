import { camelToKebabCase } from "./generalHelper";

export function generateInlineStyleObject(
  obj: RawColorPaletteData
): Record<string, string> {
  const style: Record<string, string> = {};

  for (const key in obj) {
    if (key === "widget") continue;

    const value = obj[key as keyof RawColorPaletteData];
    if (Array.isArray(value)) {
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
  return gradients.map((g) => gradientCSS(g)).join(", ");
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

  const base = `${gradient.type}(${
    gradient.angle ??
    `${gradient.sizeX} ${gradient.sizeY} at ${gradient.posX} ${gradient.posY}`
  }`;

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
