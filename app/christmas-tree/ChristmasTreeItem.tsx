import spriteStyle from "./sprite.module.css";
import Image from "next/image";

interface Props {
  position: [number, number];
  sprite: string;
  from: string;
}

export default function ChristmasTreeItem({ position, sprite, from }: Props) {
  return (
    <div
      className={`-translate-x-1/2 -translate-y-1/2 ${spriteStyle.sizing} absolute`}
      style={{
        left: `${position[0] / 10}%`,
        top: `${position[1] / 10}%`,
      }}
    >
      <div className="relative w-full h-full group">
        <Image
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${sprite}.svg`}
          className="w-full h-full object-contain"
          alt={sprite}
          height={100}
          width={100}
        />
        <p
          className={`text-saturated font-fancy ${spriteStyle.text} opacity-40 transition-all duration-300 ease-in-out group-hover:opacity-90 group-hover:scale-110 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center`}
        >
          {from}
        </p>
      </div>
    </div>
  );
}
