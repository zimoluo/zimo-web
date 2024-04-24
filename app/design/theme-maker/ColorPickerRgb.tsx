"use client";

import { RgbColorPicker } from "react-colorful";

interface Props {
  entry: ColorSchemeData;
  setEntry: (value: ColorSchemeData) => void;
}

export default function ColorPickerRgb({ entry, setEntry }: Props) {
  const { r, g, b } = { r: entry[0], g: entry[1], b: entry[2] };

  return (
    <RgbColorPicker
      color={{ r, g, b }}
      onChange={({ r, g, b }) => setEntry([r, g, b])}
    />
  );
}
