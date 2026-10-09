import Image from "next/image";

import type { IconProps } from "./types";

export default function WikipediaLogo({ className = "", size }: IconProps) {
  return (
    <div
      style={size === undefined ? undefined : { width: size, height: size }}
      className={`flex items-center justify-center aspect-square ${className}`}
    >
      <Image
        src="/util/wikipedia-logo.svg" width={150} height={150}
        alt="Wikipedia logo"
        className="object-contain w-full h-auto"
        draggable="false"
      />
    </div>
  );
}
