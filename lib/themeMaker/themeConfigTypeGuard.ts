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
    !obj.palette.middle ||
    !obj.palette.soft ||
    !obj.palette.pastel ||
    !obj.palette.light ||
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
    (obj.favicon.mode === "outline" && !obj.favicon.outline) ||
    (obj.favicon.mode === "custom" && !obj.favicon.customKey)
  ) {
    return false;
  }

  if (
    obj.animatedBackgroundKey &&
    typeof obj.animatedBackgroundKey !== "string"
  ) {
    return false;
  }

  if (obj.misc && typeof obj.misc !== "object") {
    return false;
  }

  if (
    obj.misc &&
    obj.misc.readingBlur !== undefined &&
    typeof obj.misc.readingBlur !== "number"
  ) {
    return false;
  }

  if (!isValidColorGradientArray(obj.palette.page)) {
    return false;
  }

  if (
    obj.palette.pageMinimal &&
    !isValidColorGradientArray(obj.palette.pageMinimal)
  ) {
    return false;
  }

  if (!isValidColorGradientArray(obj.palette.widget)) {
    return false;
  }

  return true;
}

function isValidColorGradientArray(array: any[]): boolean {
  if (!Array.isArray(array)) {
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

  if (gradient.type !== "custom" && typeof gradient.type !== "string") {
    return false;
  }

  if (
    gradient.type === "custom" &&
    (!gradient.content || typeof gradient.content !== "string")
  ) {
    return false;
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
  if (typeof stop !== "object" || !stop.color || !stop.at) {
    return false;
  }

  if (typeof stop.color !== "string") {
    return false;
  }

  if (typeof stop.at !== "string") {
    return false;
  }

  return true;
}
