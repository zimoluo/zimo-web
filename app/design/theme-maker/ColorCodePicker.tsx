import ColorCodeInputRow from "./ColorCodeInputRow";
import editorStyle from "./color-editor.module.css";

export default function ColorCodePicker() {
  return (
    <div
      className={`w-full h-full bg-light bg-opacity-80 rounded-xl p-4 ${editorStyle.codePickerGrid}`}
    >
      <ColorCodeInputRow title="Hex" count={1} />
      <ColorCodeInputRow title="RGB" count={3} />
      <ColorCodeInputRow title="CMYK" count={3} />
      <ColorCodeInputRow title="HSV" count={3} />
    </div>
  );
}
