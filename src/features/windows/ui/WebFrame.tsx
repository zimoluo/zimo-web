"use client";

import { useWindowInstance } from "../window-identity";
export default function WebFrame({ url, zoom }: Record<string, unknown>) {
  const { active } = useWindowInstance();
  return <div className="relative size-full"><iframe title="Web window" src={typeof url === "string" ? url : undefined} className="size-full" style={{ zoom: typeof zoom === "number" ? zoom : 1 }} />{!active && <div className="absolute inset-0" />}</div>;
}
