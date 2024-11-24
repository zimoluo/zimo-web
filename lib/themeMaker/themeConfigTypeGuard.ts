import { extendedStopsMaximum, extendedStopsMinimum } from "./layerHelper";

export function isValidThemeDataConfig(obj: any): obj is ThemeDataConfig {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const keys = Object.keys(obj);

  if (
    !keys.includes("palette") ||
    !keys.includes("siteThemeColor") ||
    !keys.includes("favicon")
  ) {
    return false;
  }

  if (
    typeof obj.palette !== "object" ||
    !obj.palette.primary ||
    !obj.palette.saturated ||
    !obj.palette.pastel ||
    !obj.palette.light ||
    !isColorTriplet(obj.palette.primary) ||
    !isColorTriplet(obj.palette.saturated) ||
    !isColorTriplet(obj.palette.pastel) ||
    !isColorTriplet(obj.palette.light) ||
    !obj.palette.page ||
    !Array.isArray(obj.palette.page) ||
    !obj.palette.widget ||
    !Array.isArray(obj.palette.widget)
  ) {
    return false;
  }

  if (
    typeof obj.siteThemeColor !== "string" ||
    !/^#[0-9A-Fa-f]{6}$/.test(obj.siteThemeColor)
  ) {
    return false;
  }

  if (
    typeof obj.favicon !== "object" ||
    !obj.favicon.mode ||
    (obj.favicon.mode === "custom" && !obj.favicon.customKey)
  ) {
    return false;
  }

  if (
    obj.favicon.mode === "custom" &&
    typeof obj.favicon.customKey !== "string"
  ) {
    return false;
  }

  if (
    "backdropProhibitSVG" in obj.favicon &&
    typeof obj.favicon.backdropProhibitSVG !== "boolean"
  ) {
    return false;
  }

  if (
    obj.favicon.gradient &&
    ((obj.favicon.gradient.length !== 1 && obj.favicon.gradient.length !== 3) ||
      !obj.favicon.gradient.every(
        (stopsConfig: any) =>
          (!("angle" in stopsConfig) ||
            typeof stopsConfig.angle === "number") &&
          "stops" in stopsConfig &&
          Array.isArray(stopsConfig.stops) &&
          stopsConfig.stops.every(
            (innerStop: any) =>
              "color" in innerStop &&
              typeof innerStop.color === "string" &&
              /^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(innerStop.color) &&
              "offset" in innerStop &&
              typeof innerStop.offset === "number" &&
              innerStop.offset >= 0 &&
              innerStop.offset <= 1
          )
      ))
  ) {
    return false;
  }

  if (
    obj.backdropGradient &&
    !isValidColorGradientArray(obj.backdropGradient)
  ) {
    return false;
  }

  if (
    obj.animatedBackgroundKey &&
    !(
      typeof obj.animatedBackgroundKey === "string" ||
      (Array.isArray(obj.animatedBackgroundKey) &&
        obj.animatedBackgroundKey.every(
          (item: any) => typeof item === "string"
        ))
    )
  ) {
    return false;
  }

  if (obj.misc && typeof obj.misc !== "object") {
    return false;
  }

  if (
    obj.misc &&
    "readingBlur" in obj.misc &&
    typeof obj.misc.readingBlur !== "number"
  ) {
    return false;
  }

  if (!isValidColorGradientArray(obj.palette.page)) {
    return false;
  }

  if (
    obj.palette.pageMinimal &&
    !isValidColorGradientArray(obj.palette.pageMinimal, 0)
  ) {
    return false;
  }

  if (!isValidColorGradientArray(obj.palette.widget)) {
    return false;
  }

  return true;
}

function isValidColorGradientArray(
  array: any[],
  minLayers: number = 1
): boolean {
  if (!Array.isArray(array)) {
    return false;
  }

  if (array.length < minLayers) {
    return false;
  }

  for (const gradient of array) {
    if (!isValidColorGradient(gradient)) {
      return false;
    }
  }

  return true;
}

function isValidColorGradient(gradient: any): boolean {
  if (typeof gradient !== "object" || !gradient.type) {
    return false;
  }

  if ("disabled" in gradient && typeof gradient.disabled !== "boolean") {
    return false;
  }

  if ("isCircle" in gradient && typeof gradient.isCircle !== "boolean") {
    return false;
  }

  if (
    "colorInterpolation" in gradient &&
    (typeof gradient.colorInterpolation !== "object" ||
      !gradient.colorInterpolation.colorSpace ||
      ![
        "default",
        "srgb",
        "srgb-linear",
        "display-p3",
        "a98-rgb",
        "prophoto-rgb",
        "rec2020",
        "lab",
        "oklab",
        "xyz",
        "xyz-d50",
        "xyz-d65",
        "hsl",
        "hwb",
        "lch",
        "oklch",
      ].includes(gradient.colorInterpolation.colorSpace) ||
      (gradient.colorInterpolation.hueInterpolationMethod &&
        !["shorter", "longer", "increasing", "decreasing"].includes(
          gradient.colorInterpolation.hueInterpolationMethod
        )))
  ) {
    return false;
  }

  if (
    "sizeKeyword" in gradient &&
    ![
      "closest-side",
      "closest-corner",
      "farthest-side",
      "farthest-corner",
    ].includes(gradient.sizeKeyword)
  ) {
    return false;
  }

  if (
    "linearGradientKeyword" in gradient &&
    typeof gradient.linearGradientKeyword !== "boolean"
  ) {
    return false;
  }

  if (
    "linearHorizontalOrientation" in gradient &&
    !["left", "right"].includes(gradient.linearHorizontalOrientation)
  ) {
    return false;
  }

  if (
    "linearVerticalOrientation" in gradient &&
    !["top", "bottom"].includes(gradient.linearVerticalOrientation)
  ) {
    return false;
  }

  if (gradient.type !== "custom" && typeof gradient.type !== "string") {
    return false;
  }

  if (
    gradient.type === "custom" &&
    (!gradient.content || typeof gradient.content !== "string")
  ) {
    return false;
  }

  for (let prop of ["posX", "posY", "sizeX", "sizeY", "angle"]) {
    if (prop in gradient && typeof gradient[prop] !== "number") {
      return false;
    }
  }

  if (gradient.stops && !isValidGradientStopArray(gradient.stops)) {
    return false;
  }

  return true;
}

function isValidGradientStopArray(array: any[]): boolean {
  if (!Array.isArray(array)) {
    return false;
  }

  for (const stop of array) {
    if (!isValidGradientStop(stop)) {
      return false;
    }
  }

  return true;
}

function isValidGradientStop(stop: any): boolean {
  if (
    typeof stop !== "object" ||
    !("color" in stop) ||
    !("at" in stop) ||
    !("opacity" in stop)
  ) {
    return false;
  }

  if (!isColorTriplet(stop.color)) {
    return false;
  }

  if (
    typeof stop.at !== "number" ||
    stop.at < extendedStopsMinimum ||
    stop.at > extendedStopsMaximum
  ) {
    return false;
  }

  if (
    typeof stop.opacity !== "number" ||
    stop.opacity < 0 ||
    stop.opacity > 1
  ) {
    return false;
  }

  if ("isWidgetOpacity" in stop && typeof stop.isWidgetOpacity !== "boolean") {
    return false;
  }

  return true;
}

function isColorTriplet(a: any): boolean {
  return (
    Array.isArray(a) &&
    a.length === 3 &&
    a.every(
      (element: any) =>
        Number.isInteger(element) && element >= 0 && element <= 255
    )
  );
}
