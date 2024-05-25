import codeStyle from "./editor-code.module.css";
import ColorCodeInputParser from "./ColorCodeInputParser";

export default function ColorCodeInputRow({
  title,
  count,
  data,
}: ColorCodeData) {
  return (
    <div className={`${codeStyle.inputBoxContainer}`}>
      <p className="whitespace-nowrap shrink-0">{title}</p>
      <div className={`w-full flex ${codeStyle.inputBoxGrid}`}>
        {Array.from({ length: count }, (_, index) => (
          <ColorCodeInputParser key={index} {...data[index]} />
        ))}
      </div>
    </div>
  );
}
