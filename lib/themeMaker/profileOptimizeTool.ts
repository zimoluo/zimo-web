import _ from "lodash";
import { emptyLayer } from "./layerHelper";
import { defaultThemeMiscConfig } from "../constants/defaultThemeMiscConfig";

const gradientTypeProps: Record<
  EditorGradientMode | "custom",
  (keyof (LinearGradientData &
    LinearGradientOrientationData &
    RadialGradientData &
    CircleRadialGradientAdditionalData &
    CustomGradientData))[]
> = {
  "linear-gradient": [
    "angle",
    "linearGradientKeyword",
    "linearHorizontalOrientation",
    "linearVerticalOrientation",
  ],
  "repeating-linear-gradient": [
    "angle",
    "linearGradientKeyword",
    "linearHorizontalOrientation",
    "linearVerticalOrientation",
  ],
  "radial-gradient": [
    "posX",
    "posY",
    "sizeX",
    "sizeY",
    "isCircle",
    "sizeKeyword",
  ],
  "repeating-radial-gradient": [
    "posX",
    "posY",
    "sizeX",
    "sizeY",
    "isCircle",
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

      if (!gradient.isCircle) {
        delete gradient.sizeKeyword;
      } else {
        delete gradient.sizeX;
        delete gradient.sizeY;
      }

      if (
        "linearGradientKeyword" in gradient &&
        gradient.linearGradientKeyword === false
      ) {
        delete gradient.linearGradientKeyword;
      }

      if (!gradient.linearGradientKeyword) {
        delete gradient.linearHorizontalOrientation;
        delete gradient.linearVerticalOrientation;
      }

      if (
        gradient.linearGradientKeyword &&
        ["linear-gradient", "repeating-linear-gradient"].includes(gradient.type)
      ) {
        delete gradient.angle;
      }

      if (gradient.colorInterpolation?.hueInterpolationMethod === "shorter") {
        delete gradient.colorInterpolation.hueInterpolationMethod;
      }

      if (gradient.colorInterpolation?.colorSpace === "default") {
        delete gradient.colorInterpolation;
      }

      const propsToKeep = gradientTypeProps[gradient.type] || [];
      const optimizedGradient: any = {
        type: gradient.type,
        stops: gradient.stops,
        colorInterpolation: gradient.colorInterpolation,
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

  clonedProfile.palette = Object.fromEntries(
    Object.entries(clonedProfile.palette || {}).filter(([key]) =>
      [
        "primary",
        "saturated",
        "pastel",
        "light",
        "page",
        "pageMinimal",
        "widget",
      ].includes(key)
    )
  ) as RawColorPaletteData;

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
    Object.keys(defaultThemeMiscConfig).forEach((key) => {
      if (!clonedProfile.misc) {
        return;
      }

      const typedKey = key as keyof typeof defaultThemeMiscConfig;

      if (
        typedKey in clonedProfile.misc &&
        clonedProfile.misc[typedKey] === defaultThemeMiscConfig[typedKey]
      ) {
        delete clonedProfile.misc[typedKey];
      }
    });
  }

  if (clonedProfile.misc && Object.keys(clonedProfile.misc).length === 0) {
    delete clonedProfile.misc;
  }

  if (clonedProfile.animatedBackgroundKey) {
    if (
      Array.isArray(clonedProfile.animatedBackgroundKey) &&
      clonedProfile.animatedBackgroundKey.length === 0
    ) {
      delete clonedProfile.animatedBackgroundKey;
    }

    if (
      Array.isArray(clonedProfile.animatedBackgroundKey) &&
      clonedProfile.animatedBackgroundKey.length === 1
    ) {
      clonedProfile.animatedBackgroundKey =
        clonedProfile.animatedBackgroundKey[0];
    }
  }

  removeEmptyProperties(palette);

  return {
    ...clonedProfile,
    palette,
    favicon: newFavicon as FaviconConfig,
  };
};
