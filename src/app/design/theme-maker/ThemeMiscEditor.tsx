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
        className={`bg-fill/40 backdrop-blur-lg rounded-[1.75rem] shadow-lg p-4 border border-edge/15 ${editorStyle.container}`}
      >
        <MiscEntryArea />
        <AnimatedBackgroundPicker />
      </div>
    </div>
  );
}
