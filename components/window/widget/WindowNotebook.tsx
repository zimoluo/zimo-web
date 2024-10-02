"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import NotebookPage from "./NotebookPage";

export default function WindowNotebook() {
  const { settings } = useSettings();
  const { notebookData, notebookIndex } = settings;

  return <NotebookPage />;
}
