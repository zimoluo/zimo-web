import AccentColorSelectorPill from "./AccentColorSelectorPill";
import { AccentColorProvider } from "./AccentColorContext";
import AccentColorPicker from "./AccentColorPicker";
import ColorEditorModeSelector from "./ColorEditorModeSelector";
import "./colorful-style.css";
import editorStyle from "./color-editor.module.css";

export default function AccentColorEditor() {
  return (
    <AccentColorProvider>
      <div
        className={`bg-pastel bg-opacity-40 backdrop-blur rounded-xl shadow-lg p-4 ${editorStyle.container} w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4`}
      >
        <div className={`${editorStyle.pills} shrink-0`}>
          {(
            [
              "primary",
              "saturated",
              "middle",
              "soft",
              "pastel",
              "light",
              "site",
            ] as AccentColors[]
          ).map((accentType) => (
            <AccentColorSelectorPill
              key={accentType}
              accentType={accentType}
              className={`${editorStyle.pill}`}
            />
          ))}
        </div>
        <div className={`${editorStyle.picker} theme-editor-color-picker`}>
          <AccentColorPicker />
        </div>
        <ColorEditorModeSelector />
      </div>
    </AccentColorProvider>
  );
}
