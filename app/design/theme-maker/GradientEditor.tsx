import { GradientDataProvider } from "./GradientDataContext";
import GradientCategorySelector from "./GradientCategorySelector";
import GradientDataEditor from "./GradientDataEditor";
import GradientLayerSelector from "./GradientLayerSelector";
import wrapperStyle from "./editor-wrapper.module.css";
import editorStyle from "./gradient-editor.module.css";
import GradientStopsArea from "./GradientStopsArea";

export default function GradientEditor() {
  return (
    <GradientDataProvider>
      <div
        className={`flex items-center justify-center w-full ${wrapperStyle.wrapper}`}
      >
        <div
          className={`bg-pastel bg-opacity-40 backdrop-blur-lg rounded-[1.75rem] shadow-lg p-4 border border-highlight-pastel/15 ${editorStyle.container}`}
        >
          <GradientCategorySelector />
          <GradientLayerSelector />
          <GradientDataEditor />
          <GradientStopsArea />
        </div>
      </div>
    </GradientDataProvider>
  );
}
