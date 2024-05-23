"use client";

import FaviconModeDropdownSelector from "./FaviconModeDropdownSelector";
import editorStyle from "./favicon-editor.module.css";

export default function FaviconModeAndPropertiesSelector() {
  return (
    <div className={`w-full h-auto ${editorStyle.propertiesSelector}`}>
      <FaviconModeDropdownSelector />
      <div
        className={`bg-light bg-opacity-80 rounded-xl p-4 ${editorStyle.propertiesBox}`}
      ></div>
    </div>
  );
}
