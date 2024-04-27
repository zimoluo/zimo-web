import AccentColorSelectorPill from "./AccentColorSelectorPill";
import { AccentColorProvider } from "./AccentColorContext";
import AccentColorPicker from "./AccentColorPicker";
import ColorEditorModeSelector from "./ColorEditorModeSelector";

export default function AccentColorEditor() {
  return (
    <AccentColorProvider>
      <div className="bg-pastel bg-opacity-40 backdrop-blur rounded-xl shadow-lg p-4 flex">
        <div className="grid grid-rows-6 gap-2 w-48 shrink-0">
          <AccentColorSelectorPill accentType="primary" />
          <AccentColorSelectorPill accentType="saturated" />
          <AccentColorSelectorPill accentType="middle" />
          <AccentColorSelectorPill accentType="soft" />
          <AccentColorSelectorPill accentType="pastel" />
          <AccentColorSelectorPill accentType="light" />
          <AccentColorSelectorPill accentType="site" />
        </div>
        <div className="ml-4">
          NOT FINAL
          <AccentColorPicker />
        </div>
        <ColorEditorModeSelector />
      </div>
    </AccentColorProvider>
  );
}
