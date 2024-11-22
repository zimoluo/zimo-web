import boxStyle from "./box.module.css";
import ChristmasTreeContent from "./ChristmasTreeContent";

export default function ChristmasTreeContainer() {
  return (
    <div className="w-screen max-w-screen h-screen flex justify-center items-center">
      <div className={`${boxStyle.sizing} flex items-center justify-center`}>
        <ChristmasTreeContent />
      </div>
    </div>
  );
}
