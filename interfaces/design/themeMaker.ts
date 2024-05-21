type AllowedImageFormat = "jpeg" | "png" | "svg" | "webp";

type ColorPickerMode = "palette" | "shade" | "code";

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

interface ColorCodeData {
  count: number;
  title: string;
  data: InputParserData<string | number>[];
}
