import type { Metadata } from "next";
import type { ReactNode } from "react";
export const metadata: Metadata = { title: "Theme Studio - Zimo Web", description: "Create and share a theme for Zimo Web." };
export default function StudioLayout({ children }: { readonly children: ReactNode }) { return children; }
