"use client";

import StopsEditorBar from "./StopsEditorBar";
import editorStyle from "./gradient-stops-editor.module.css";

export default function GradientStopsArea() {
  return (
    <div className={`${editorStyle.wrapper}`}>
      <div className="rounded-xl bg-light bg-opacity-80 shadow-lg h-full p-4">
        <StopsEditorBar />
      </div>
    </div>
  );
}
