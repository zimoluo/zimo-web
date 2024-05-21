type AllowedImageFormat = "jpeg" | "png" | "svg" | "webp";

type ColorPickerMode = "palette" | "shade" | "code";

type ColorCodeType = "hex" | "rgb" | "cmyk" | "hsv";

interface FormattedGradientStopData {
  isWidgetOpacity: boolean;
  at: number;
  color: ColorQuartet;
}

type EditorSelectorButtonMode =
  | "selectorButtons"
  | "random"
  | "magic"
  | "rule"
  | "widgetOpacity";

interface ShadePickerConfig {
  colorValue: HexColor;
  updateColor: (newColor: HexColor) => void;
}
