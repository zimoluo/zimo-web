import GradientEditorStopsPositionPropsGenerator from "./GradientEditorStopsPositionPropsGenerator";
import GradientInterpolationMethodEditor from "./GradientInterpolationMethodEditor";
import GradientInterpolationWrapper from "./GradientInterpolationWrapper";
import GradientPanelPropsGenerator from "./GradientPanelPropsGenerator";
import GradientStopsAreaWrapper from "./GradientStopsAreaWrapper";
import editorStyle from "./gradient-stops-editor.module.css";

export default function GradientStopsArea() {
  return (
    <GradientStopsAreaWrapper>
      <div className={`${editorStyle.wrapper}`}>
        <div className={`${editorStyle.stopsAndColorInterpolation}`}>
          <div className="flex-grow">
            <GradientEditorStopsPositionPropsGenerator />
          </div>
          <GradientInterpolationWrapper>
            <div className={`${editorStyle.colorInterpolation}`}>
              <GradientInterpolationMethodEditor />
            </div>
          </GradientInterpolationWrapper>
        </div>
        <div className={`${editorStyle.panel} grid`}>
          <GradientPanelPropsGenerator />
        </div>
      </div>
    </GradientStopsAreaWrapper>
  );
}
