import { FaviconEditorProvider } from "./FaviconEditorContext";
import FaviconModeAndPropertiesSelector from "./FaviconModeAndPropertiesSelector";
import FaviconViewer from "./FaviconViewer";
import wrapperStyle from "./editor-wrapper.module.css";
import editorStyle from "./favicon-editor.module.css";

export default function FaviconEditorArea() {
  return (
    <FaviconEditorProvider>
      <div
        className={`flex items-center justify-center w-full ${wrapperStyle.wrapper}`}
      >
        <div
          className={`bg-pastel bg-opacity-40 backdrop-blur rounded-xl shadow-lg p-4 ${editorStyle.bigBox} w-full`}
        >
          <div className={`${editorStyle.firstRow} w-full`}>
            <FaviconViewer />
            <FaviconModeAndPropertiesSelector />
          </div>
        </div>
      </div>
    </FaviconEditorProvider>
  );
}
