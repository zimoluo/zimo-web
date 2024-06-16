import _ from "lodash";
import { emptyLayer } from "./layerHelper";

const gradientTypeProps: Record<
  EditorGradientMode | "custom",
  (keyof (LinearGradientData & RadialGradientData & CustomGradientData))[]
> = {
  "linear-gradient": ["angle"],
  "repeating-linear-gradient": ["angle"],
  "radial-gradient": [
    "posX",
    "posY",
    "sizeX",
    "sizeY",
    "isCircle",
    "isKeywordSize",
    "sizeKeyword",
  ],
  "repeating-radial-gradient": [
    "posX",
    "posY",
    "sizeX",
    "sizeY",
    "isCircle",
    "isKeywordSize",
    "sizeKeyword",
  ],
  "conic-gradient": ["posX", "posY", "angle"],
  "repeating-conic-gradient": ["posX", "posY", "angle"],
  custom: ["content"],
};

const removeEmptyProperties = (obj: any) => {
  for (const key in obj) {
    if (
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      Object.keys(obj[key]).length === 0
    ) {
      delete obj[key];
    } else if (Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key];
    }
  }
};

const optimizeColorGradients = (
  gradients: ColorGradient[],
  isWidget: boolean
) => {
  return gradients
    .map((gradient) => {
      if (gradient.disabled === false) {
        delete gradient.disabled;
      } else if (gradient.disabled === true) {
        return null;
      }

      if (gradient.stops) {
        gradient.stops.forEach((stop) => {
          if (!isWidget || stop.isWidgetOpacity === false) {
            delete stop.isWidgetOpacity;
          }
        });

        gradient.stops.sort((a, b) => a.at - b.at);
      }

      if ("isCircle" in gradient && gradient.isCircle === false) {
        delete gradient.isCircle;
      }

      if ("isKeywordSize" in gradient && gradient.isKeywordSize === false) {
        delete gradient.isKeywordSize;
      }

      if (!gradient.isKeywordSize) {
        delete gradient.isCircle;
      }

      if (!gradient.isKeywordSize) {
        delete gradient.sizeKeyword;
      }

      const propsToKeep = gradientTypeProps[gradient.type] || [];
      const optimizedGradient: any = {
        type: gradient.type,
        stops: gradient.stops,
      };

      propsToKeep.forEach((prop) => {
        if (gradient[prop] !== undefined) {
          optimizedGradient[prop] = gradient[prop];
        }
      });

      return optimizedGradient as ColorGradient;
    })
    .filter(Boolean) as ColorGradient[];
};

export const optimizeExportedProfile = (
  unoptimizedProfile: ThemeDataConfig
): ThemeDataConfig => {
  const clonedProfile = structuredClone(unoptimizedProfile);

  const { palette } = clonedProfile;
  palette.page = optimizeColorGradients(palette.page, false);
  palette.widget = optimizeColorGradients(palette.widget, true);

  if (palette.pageMinimal) {
    palette.pageMinimal = optimizeColorGradients(palette.pageMinimal, false);
    if (palette.pageMinimal.length === 0) {
      delete palette.pageMinimal;
    }
  }

  if (palette.page.length === 0) {
    palette.page = [emptyLayer];
  }

  if (palette.widget.length === 0) {
    palette.widget = [emptyLayer];
  }

  const favicon = clonedProfile.favicon;
  const newFavicon: any = {
    mode: favicon.mode,
    outline: favicon.outline === "primary" ? undefined : favicon.outline,
  };

  switch (favicon.mode) {
    case "backdrop":
      if (favicon.backdropGradient) {
        newFavicon.backdropGradient = optimizeColorGradients(
          favicon.backdropGradient,
          false
        );
      }
      break;
    case "custom":
      newFavicon.customKey = favicon.customKey;
      break;
    case "overall":
      if (favicon.gradient && favicon.gradient.length > 1) {
        favicon.gradient = [favicon.gradient[0]];
      }

      newFavicon.gradient = favicon.gradient;
      break;
    case "separate":
      if (favicon.gradient && favicon.gradient.length === 3) {
        const [first, second, third] = favicon.gradient;
        if (_.isEqual(first, second) && _.isEqual(second, third)) {
          favicon.gradient = [first];
        }
      }
      newFavicon.gradient = favicon.gradient;
      break;
  }

  if (newFavicon.gradient) {
    (newFavicon.gradient as FaviconGradientConfig).forEach((grad) => {
      if (grad.angle === 0) {
        delete grad.angle;
      }

      if (Array.isArray(grad.stops)) {
        grad.stops.sort((a, b) => a.offset - b.offset);
      }
    });
  }

  if (newFavicon.backdropProhibitSVG === false) {
    delete newFavicon.backdropProhibitSVG;
  }

  if (clonedProfile.misc) {
    if (
      clonedProfile.misc.hasOwnProperty("readingBlur") &&
      clonedProfile.misc.readingBlur === 8
    ) {
      delete clonedProfile.misc.readingBlur;
    }
  }

  if (clonedProfile.misc && Object.keys(clonedProfile.misc).length === 0) {
    delete clonedProfile.misc;
  }

  removeEmptyProperties(palette);

  return {
    ...clonedProfile,
    palette,
    favicon: newFavicon as FaviconConfig,
  };
};
