"use client";
import type { ReactNode } from "react";
import { useSettings } from "@/src/features/settings";
export default function ReadingContentProcessor({ children, isBlog = false }: { readonly children?: ReactNode; readonly isBlog?: boolean }) {
  const serif = useSettings((state) => state.reading.serif);
  return <section className={serif && isBlog ? "font-serif" : "font-sans"}>{children}</section>;
}
