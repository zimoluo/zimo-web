import ColorCodeInputRow from "./ColorCodeInputRow";
import codeStyle from "./editor-code.module.css";

export default function ColorCodePicker() {
  return (
    <div
      className={`w-full h-full bg-light bg-opacity-80 rounded-xl p-4 ${codeStyle.pickerGrid}`}
    >
      <ColorCodeInputRow type="hex" />
      <ColorCodeInputRow type="rgb" />
      <ColorCodeInputRow type="cmyk" />
      <ColorCodeInputRow type="hsv" />
    </div>
  );
}
