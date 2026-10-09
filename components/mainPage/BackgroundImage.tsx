"use client";
import { useSettings } from "@/src/features/settings";
export default function BackgroundImage() {
  const reduced = useSettings((state) => state.motion.backdrop === "off");
  return <div aria-hidden="true" className={`fixed pointer-events-none inset-0 bg-cover bg-center select-none ${reduced ? "surface-page-reduced" : "surface-page"}`} style={{ zIndex: "var(--z-page-base)", backgroundColor: "var(--zw-role-panel)" }} />;
}
