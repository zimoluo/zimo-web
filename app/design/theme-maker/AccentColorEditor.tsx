import AccentColorSelectorPill from "./AccentColorSelectorPill";
import { AccentColorProvider } from "./AccentColorContext";
import AccentColorPicker from "./AccentColorPicker";
import ColorEditorModeSelector from "./ColorEditorModeSelector";
import "./colorful-style.css";
import editorStyle from "./color-editor.module.css";
import { ColorPickerModeProvider } from "./ColorPickerModeContext";

export default function AccentColorEditor() {
  return (
    <AccentColorProvider>
      <ColorPickerModeProvider>
        <div
          className={`flex items-center justify-center w-full ${editorStyle.wrapper}`}
        >
          <div
            className={`bg-pastel bg-opacity-40 backdrop-blur rounded-xl shadow-lg p-4 ${editorStyle.container}`}
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
            <div
              className={`${editorStyle.picker} theme-editor-color-picker rounded-xl shadow-lg`}
            >
              <AccentColorPicker />
            </div>
            <ColorEditorModeSelector />
          </div>
        </div>
      </ColorPickerModeProvider>
    </AccentColorProvider>
  );
}
