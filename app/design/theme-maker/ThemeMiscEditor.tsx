import AnimatedBackgroundPicker from "./AnimatedBackgroundPicker";
import MiscEntryArea from "./MiscEntryArea";
import wrapperStyle from "./editor-wrapper.module.css";
import editorStyle from "./misc-editor.module.css";

export default function ThemeMiscEditor() {
  return (
    <div
      className={`flex items-center justify-center w-full ${wrapperStyle.wrapper}`}
    >
      <div
        className={`bg-pastel bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg p-4 ${editorStyle.container}`}
      >
        <MiscEntryArea />
        <AnimatedBackgroundPicker />
      </div>
    </div>
  );
}
