export function generateInlineStyleObject(obj: RawColorPalette): {
  [key: string]: string;
} {
  const style: Record<string, string> = {};

  for (const key in obj) {
    const value = obj[key];
    if (Array.isArray(value) && typeof value[0] === "number") {
      style[`--color-${key}`] = value.join(" ");
    } else if (Array.isArray(value) && typeof value[0] === "object") {
      const gradients = value as ColorGradient[];
      style[`--bg-${key}`] = gradients
        .map((g) => {
          const base = `${g.type}(${
            g.angle ?? `${g.sizeX} ${g.sizeY} at ${g.posX} ${g.posY}`
          }`;
          const stops = g.stops
            .map((stop) => `${stop.color} ${stop.at}`)
            .join(", ");
          return `${base}, ${stops})`;
        })
        .join(", ");
    }
  }

  if (obj["widget"]) {
    const gradients = obj["widget"] as ColorGradient[];
    for (let opacity = 10; opacity <= 100; opacity += 10) {
      const key = `--bg-widget-${opacity}`;
      style[key] = gradients
        .map((g) => {
          const base = `${g.type}(${
            g.angle ?? `${g.sizeX} ${g.sizeY} at ${g.posX} ${g.posY}`
          }`;
          const stops = g.stops
            .map(
              (stop) =>
                `${stop.color.replace("$opacity", opacity.toString())} ${
                  stop.at
                }`
            )
            .join(", ");
          return `${base}, ${stops})`;
        })
        .join(", ");
    }
  }

  return style;
}
