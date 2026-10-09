"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
const query = "(min-width: 768px)";
const subscribe = (changed: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", changed);
  return () => media.removeEventListener("change", changed);
};
export default function MobileDesktopEntryRenderer({ mobile, desktop }: { readonly mobile?: ReactNode; readonly desktop?: ReactNode }) {
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  return wide ? desktop : mobile;
}
