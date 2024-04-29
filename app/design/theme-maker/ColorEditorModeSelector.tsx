import ColorPickerSelectorButtons from "./ColorPickerSelectorButtons";
import MagicWandButton from "./MagicWandButton";
import RandomizeColorButton from "./RandomizeColorButton";
import editorStyle from "./color-editor.module.css";

export default function ColorEditorModeSelector() {
  return (
    <div
      className={`${editorStyle.modeSelector} rounded-xl bg-light bg-opacity-80 shadow-lg flex items-center gap-3`}
    >
      <MagicWandButton />
      <RandomizeColorButton />
      <hr
        className={`${editorStyle.modeSelectorRule} border-saturated border-opacity-80`}
      />
      <ColorPickerSelectorButtons />
    </div>
  );
}
