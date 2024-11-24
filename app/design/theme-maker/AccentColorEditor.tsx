import AccentColorSelectorPill from "./AccentColorSelectorPill";
import { AccentColorProvider } from "./AccentColorContext";
import editorStyle from "./color-editor.module.css";
import wrapperStyle from "./editor-wrapper.module.css";
import pillsStyle from "./editor-pills.module.css";
import AccentColorPanelPropsGenerator from "./AccentColorPanelPropsGenerator";

export default function AccentColorEditor() {
  return (
    <AccentColorProvider>
      <div
        className={`flex items-center justify-center w-full ${wrapperStyle.wrapper}`}
      >
        <div
          className={`bg-pastel bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg p-4 ${editorStyle.container}`}
        >
          <div className={`${pillsStyle.pills} shrink-0`}>
            {(
              [
                "primary",
                "saturated",
                "pastel",
                "light",
                "site",
              ] as AccentColors[]
            ).map((accentType) => (
              <AccentColorSelectorPill
                key={accentType}
                accentType={accentType}
                className={`${pillsStyle.singlePill}`}
              />
            ))}
          </div>
          <AccentColorPanelPropsGenerator />
        </div>
      </div>
    </AccentColorProvider>
  );
}
