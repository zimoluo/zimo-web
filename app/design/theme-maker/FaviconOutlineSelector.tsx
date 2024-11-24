import OutlineCustomInput from "./OutlineCustomInput";
import OutlineCustomPanel from "./OutlineCustomPanel";
import OutlineSelectorButton from "./OutlineSelectorButton";
import selectorStyle from "./outline-selector.module.css";

export default function FaviconOutlineSelector() {
  return (
    <div>
      <div className={`${selectorStyle.grid}`}>
        <div className="bg-light bg-opacity-80 rounded-xl shadow-lg w-full flex items-center justify-start gap-4 h-13 px-4 overflow-x-auto">
          {["primary", "saturated", "pastel", "light", "site", "custom"].map(
            (value, index) => (
              <OutlineSelectorButton
                key={index}
                mode={value as AccentColors | "custom"}
              />
            )
          )}
        </div>
        <OutlineCustomInput />
      </div>
      <OutlineCustomPanel />
    </div>
  );
}
