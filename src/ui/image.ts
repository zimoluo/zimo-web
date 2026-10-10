import type { SyntheticEvent } from "react";
export const imageFallback = (fallbackSrc: string) => (event: SyntheticEvent<HTMLImageElement>) => { const target = event.currentTarget; if (target.src.endsWith(fallbackSrc)) return; target.srcset = ""; target.src = fallbackSrc; };
