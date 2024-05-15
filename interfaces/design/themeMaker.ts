type AllowedImageFormat = "jpeg" | "png" | "svg" | "webp";

type ColorPickerMode = "palette" | "shade" | "code";

type ColorCodeType = "hex" | "rgb" | "cmyk" | "hsv";

interface FormattedGradientStopData {
  isWidgetOpacity: boolean;
  at: number;
  color: ColorQuartet;
}
