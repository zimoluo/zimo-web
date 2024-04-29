import ColorCodeIcon from "@/components/assets/entries/colorPickerMode/ColorCodeIcon";
import ColorPickerIcon from "@/components/assets/entries/colorPickerMode/ColorPickerIcon";
import ColorShadeIcon from "@/components/assets/entries/colorPickerMode/ColorShadeIcon";
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
      <button className="transition-transform duration-150 ease-out hover:scale-110">
        <ColorPickerIcon className="w-6 h-auto aspect-square" />
      </button>
      <button className="transition-transform duration-150 ease-out hover:scale-110">
        <ColorCodeIcon className="w-6 h-auto aspect-square" />
      </button>
      <button className="transition-transform duration-150 ease-out hover:scale-110">
        <ColorShadeIcon className="w-6 h-auto aspect-square" />
      </button>
    </div>
  );
}
