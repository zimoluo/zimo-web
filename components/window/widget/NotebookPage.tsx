"use client";

import { useSettings } from "@/components/contexts/SettingsContext";

export default function NotebookPage() {
  const { settings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  return (
    <div className="w-full h-full">
      <textarea className="w-full h-full border-none border-transparent rounded-none resize-none text-lg" />
    </div>
  );
}
