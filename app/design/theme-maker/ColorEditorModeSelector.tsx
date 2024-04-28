import ColorCodeIcon from "@/components/assets/entries/colorPickerMode/ColorCodeIcon";
import ColorPickerIcon from "@/components/assets/entries/colorPickerMode/ColorPickerIcon";
import ColorShadeIcon from "@/components/assets/entries/colorPickerMode/ColorShadeIcon";
import MagicWandButton from "./MagicWandButton";
import RandomizeColorButton from "./RandomizeColorButton";

export default function ColorEditorModeSelector() {
  return (
    <div className="h-8 md:w-8 md:h-auto py-5 px-3 md:py-3 md:px-5 rounded-xl bg-light bg-opacity-80 shadow-lg flex md:flex-col items-center gap-3">
      <MagicWandButton />
      <RandomizeColorButton />
      <hr className="border-l md:border-t md:border-l-0 border-saturated border-opacity-80 w-0 md:w-5 h-5 md:h-0" />
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
