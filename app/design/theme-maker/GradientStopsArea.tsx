import GradientEditorStopsPositionPropsGenerator from "./GradientEditorStopsPositionPropsGenerator";
import GradientPanelPropsGenerator from "./GradientPanelPropsGenerator";
import GradientStopsAreaWrapper from "./GradientStopsAreaWrapper";
import editorStyle from "./gradient-stops-editor.module.css";

export default function GradientStopsArea() {
  return (
    <GradientStopsAreaWrapper>
      <div className={`${editorStyle.wrapper}`}>
        <GradientEditorStopsPositionPropsGenerator />
        <GradientPanelPropsGenerator />
      </div>
    </GradientStopsAreaWrapper>
  );
}
