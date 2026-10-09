import flipStyle from "./flip.module.css";

import type { IconProps } from "../types";

export default function SettingsFlipButton({ className = "", size }: IconProps) {
  return (
    <div aria-hidden={true} className={className} style={size === undefined ? undefined : { width: size, height: size }}>
      <div className="relative flex items-center justify-center w-full h-full pointer-events-none select-none">
        <div className={`${flipStyle.proportion} bg-current rounded-full`} />
      </div>
    </div>
  );
}
