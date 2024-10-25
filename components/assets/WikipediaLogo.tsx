import Image from "next/image";
import logoSrc from "@/public/util/wikipedia-logo.svg";

interface Props {
  className?: string;
}

export default function WikipediaLogo({ className = "" }: Props) {
  return (
    <div
      className={`flex items-center justify-center aspect-square ${className}`}
    >
      <Image
        src={logoSrc}
        alt="Wikipedia logo"
        className="object-contain w-full h-auto"
        draggable="false"
      />
    </div>
  );
}
