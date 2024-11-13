import FaviconColorEditorAllocator from "./FaviconColorEditorAllocator";
import { FaviconEditorProvider } from "./FaviconEditorContext";
import FaviconModeAndPropertiesSelector from "./FaviconModeAndPropertiesSelector";
import FaviconOutlineSelector from "./FaviconOutlineSelector";
import FaviconOutlineSelectorWrapper from "./FaviconOutlineSelectorWrapper";
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
          className={`bg-pastel bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg p-4 w-full`}
        >
          <div className={`${editorStyle.firstRow} w-full`}>
            <FaviconViewer />
            <FaviconModeAndPropertiesSelector />
            <FaviconOutlineSelectorWrapper>
              <FaviconOutlineSelector />
            </FaviconOutlineSelectorWrapper>
          </div>
          <FaviconColorEditorAllocator />
        </div>
      </div>
    </FaviconEditorProvider>
  );
}
