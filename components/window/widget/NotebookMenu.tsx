"use client";

import { useSettings } from "@/components/contexts/SettingsContext";

export default function NotebookMenu() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
}
