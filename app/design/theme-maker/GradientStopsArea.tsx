import GradientPanelPropsGenerator from "./GradientPanelPropsGenerator";
import GradientStopsAreaWrapper from "./GradientStopsAreaWrapper";
import StopsPositionManager from "./StopsPositionManager";
import editorStyle from "./gradient-stops-editor.module.css";

export default function GradientStopsArea() {
  return (
    <GradientStopsAreaWrapper>
      <div className={`${editorStyle.wrapper}`}>
        <StopsPositionManager />
        <GradientPanelPropsGenerator />
      </div>
    </GradientStopsAreaWrapper>
  );
}
