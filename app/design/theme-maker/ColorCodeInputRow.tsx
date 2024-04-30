interface Props {
  title: string;
  count?: number;
}

import editorStyle from "./color-editor.module.css";

export default function ColorCodeInputRow({ title, count = 1 }: Props) {
  return (
    <div className={`${editorStyle.codeInputBoxContainer}`}>
      <p className="whitespace-nowrap shrink-0">{title}</p>
      <div className={`w-full flex ${editorStyle.codeInputBoxGrid}`}>
        {Array.from({ length: count }, (_, index) => (
          <input
            key={index}
            className={`rounded-md bg-pastel bg-opacity-80 ${editorStyle.codeInputLine} px-1.5 w-full text-center`}
          />
        ))}
      </div>
    </div>
  );
}
