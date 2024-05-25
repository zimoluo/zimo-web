"use client";

import ColorCodeInputRow from "./ColorCodeInputRow";
import { useColorPanel } from "./ColorPanelContext";
import codeStyle from "./editor-code.module.css";

export default function ColorCodePicker() {
  const { codeInputDataArray } = useColorPanel();

  return (
    <div
      className={`w-full h-full bg-light bg-opacity-80 rounded-xl p-4 ${codeStyle.pickerGrid}`}
    >
      {codeInputDataArray.map((data: ColorCodeData, index: number) => {
        return <ColorCodeInputRow {...data} key={index} />;
      })}
    </div>
  );
}
