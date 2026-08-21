import type { ColorInterpolationData, ColorTriplet, GradientStop } from "../../model/v10-types";
import type { HexColor, InputParserData } from "../../../entries/model/entry";
export type ColorPickerMode = "palette" | "shade" | "code";

export type EditorSelectorButtonMode =
  | "selectorButtons"
  | "random"
  | "magic"
  | "rule"
  | "widgetOpacity";

export interface ShadePickerConfig {
  colorValue: HexColor;
  updateColor: (newColor: HexColor) => void;
}

export interface ColorCodeData {
  count: number;
  title: string;
  data: InputParserData<string | number>[];
}

export interface GradientStopsManagerData {
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

export interface ImageColorAnalysisResult {
  vibrant: ColorTriplet;
  alternate: ColorTriplet;
}

export type SidebarButtonsOption =
  | "sidebar"
  | "customTheme"
  | "fullscreen"
  | "duplicate"
  | "stars"
  | "preset"
  | "image"
  | "export"
  | "import"
  | "settings";
