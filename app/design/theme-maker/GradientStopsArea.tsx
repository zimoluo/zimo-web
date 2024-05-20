import StopsPositionManager from "./StopsPositionManager";
import editorStyle from "./gradient-stops-editor.module.css";

export default function GradientStopsArea() {
  return (
    <div className={`${editorStyle.wrapper}`}>
      <StopsPositionManager />
      <div className="rounded-xl bg-slate-500" />
    </div>
  );
}
