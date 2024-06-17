"use client";

import codeStyle from "./editor-code.module.css";
import { useInputParser } from "@/lib/helperHooks";

export default function ColorCodeInputParser({
  value,
  setValue,
  isValid,
  formatValue,
}: InputParserData<string | number>) {
  const [storedValue, handleChange] = useInputParser({
    value,
    setValue,
    isValid,
    formatValue,
  });

  return (
    <input
      className={`rounded-md bg-pastel bg-opacity-80 shadow-sm ${codeStyle.inputLine} px-1.5 w-full text-center`}
      value={storedValue}
      onChange={handleChange}
    />
  );
}
