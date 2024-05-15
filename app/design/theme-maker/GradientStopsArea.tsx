"use client";

import { useGradientData } from "./GradientDataContext";
import editorStyle from "./gradient-stops-editor.module.css";

export default function GradientStopsArea() {
  const {
    formattedCurrentGradientStopData,
    setGradientStopIndex,
    gradientStopIndex,
  } = useGradientData();
  return (
    <div className={`${editorStyle.wrapper}`}>
      <div className="rounded-xl bg-light bg-opacity-80 shadow-lg h-full p-4">
        <button
          onClick={() => {
            setGradientStopIndex(gradientStopIndex + 1);
          }}
        >
          plus
        </button>
        <br />
        <button
          onClick={() => {
            setGradientStopIndex(gradientStopIndex - 1);
          }}
        >
          minus
        </button>
        <br />
        {JSON.stringify(formattedCurrentGradientStopData)}
      </div>
    </div>
  );
}
