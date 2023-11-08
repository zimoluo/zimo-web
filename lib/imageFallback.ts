import { SyntheticEvent } from "react";

export const imageFallback =
  (fallbackSrc: string) => (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;

    target.src = fallbackSrc;
    target.srcset = fallbackSrc;
  };
