type AllowedImageFormat = "jpeg" | "png" | "svg" | "webp";

type ColorPickerMode = "palette" | "shade" | "code";

type ColorCodeType = "hex" | "rgb" | "cmyk" | "hsv";

interface ColorCodeInputData<T> {
  value: T;
  setValue: (newValue: T) => void;
  isValid: (rawInput: string) => boolean;
  formatValue: (rawInput: string) => T;
}
