"use client";

import Image from "next/image";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  className?: string;
}

export default function FaviconImage({ className = "" }: Props) {
  const { theme } = useTheme();

  return (
    <Image
      src={`/display-favicon/${theme.favicon.display}.svg`}
      height={40}
      width={40}
      className={`aspect-square ${className}`}
      alt="The website's favicon used for display purposes."
    />
  );
}
