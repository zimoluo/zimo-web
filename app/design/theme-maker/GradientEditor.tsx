import { GradientCategoryProvider } from "./GradientCategoryContext";
import GradientCategorySelector from "./GradientCategorySelector";
import { GradientLayerProvider } from "./GradientLayerContext";
import GradientLayerSelector from "./GradientLayerSelector";
import wrapperStyle from "./editor-wrapper.module.css";
import editorStyle from "./gradient-editor.module.css";

export default function GradientEditor() {
  return (
    <GradientCategoryProvider>
      <GradientLayerProvider>
        <div
          className={`flex items-center justify-center w-full ${wrapperStyle.wrapper}`}
        >
          <div
            className={`bg-pastel bg-opacity-40 backdrop-blur rounded-xl shadow-lg p-4 ${editorStyle.container}`}
          >
            <GradientCategorySelector />
            <GradientLayerSelector />
          </div>
        </div>
      </GradientLayerProvider>
    </GradientCategoryProvider>
  );
}
