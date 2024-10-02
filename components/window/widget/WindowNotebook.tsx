"use client";

import { useSettings } from "@/components/contexts/SettingsContext";

export default function WindowNotebook() {
  const { settings } = useSettings();
  const { notebookData, notebookIndex } = settings;

  return null;
}
