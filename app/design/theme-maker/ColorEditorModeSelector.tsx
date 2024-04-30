import ColorPickerSelectorButtons from "./ColorPickerSelectorButtons";
import MagicWandButton from "./MagicWandButton";
import RandomizeColorButton from "./RandomizeColorButton";
import selectorStyle from "./editor-mode-selector.module.css";

export default function ColorEditorModeSelector() {
  return (
    <div
      className={`${selectorStyle.selector} rounded-xl bg-light bg-opacity-80 shadow-lg flex items-center gap-3`}
    >
      <MagicWandButton />
      <RandomizeColorButton />
      <hr
        className={`${selectorStyle.rule} border-saturated border-opacity-80`}
      />
      <ColorPickerSelectorButtons />
    </div>
  );
}
