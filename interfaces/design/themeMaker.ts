type ColorPickerMode = "palette" | "shade" | "code";

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

interface GradientStopsManagerData {
  gradientStops: GradientStop[];
  gradientStopIndex: number;
  setGradientStopIndex: React.Dispatch<React.SetStateAction<number>>;
  currentGradientStop: GradientStop;
  modifyGradientStop: (
    data: Partial<GradientStop>,
    index?: number,
    doSync?: boolean
  ) => void;
  deleteGradientStop: (index?: number, doSync?: boolean) => void;
  appendGradientStop: (data: GradientStop, doSync?: boolean) => void;
  updateGradientStopsDirectly: (
    newGradientStops: GradientStop[],
    doSync?: boolean
  ) => void;
  isExtendedRange?: boolean;
  colorInterpolationData?: ColorInterpolationData;
}

interface ImageColorAnalysisResult {
  vibrant: ColorTriplet;
  alternate: ColorTriplet;
}
