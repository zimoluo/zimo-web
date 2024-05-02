import wrapperStyle from "./editor-wrapper.module.css";
import editorStyle from "./gradient-editor.module.css";

export default function GradientEditor() {
  return (
    <div
      className={`flex items-center justify-center w-full ${wrapperStyle.wrapper}`}
    >
      <div
        className={`bg-pastel bg-opacity-40 backdrop-blur rounded-xl shadow-lg p-4 ${editorStyle.container}`}
      >
        <div className="h-40" />
      </div>
    </div>
  );
}
