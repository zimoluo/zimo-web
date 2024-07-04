import OutlineCustomInput from "./OutlineCustomInput";
import OutlineSelectorButton from "./OutlineSelectorButton";
import selectorStyle from "./outline-selector.module.css";

export default function FaviconOutlineSelector() {
  return (
    <div className={`${selectorStyle.grid}`}>
      <div className="bg-light bg-opacity-80 rounded-xl shadow-lg w-full flex items-center justify-start gap-4 h-13 px-4 overflow-x-auto">
        {[
          "primary",
          "saturated",
          "middle",
          "soft",
          "pastel",
          "light",
          "site",
          "custom",
        ].map((value, index) => (
          <OutlineSelectorButton
            key={index}
            mode={value as AccentColors | "custom"}
          />
        ))}
      </div>
      <OutlineCustomInput />
    </div>
  );
}
