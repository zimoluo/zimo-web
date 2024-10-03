"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import NotebookPage from "./NotebookPage";
import NotebookTopBar from "./NotebookTopBar";
import NotebookMenu from "./NotebookMenu";

export default function WindowNotebook() {
  const { settings } = useSettings();
  const { notebookData, notebookIndex } = settings;

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <NotebookTopBar />
      <div className="w-full flex flex-grow">
        <NotebookMenu />
        <NotebookPage />
      </div>
    </div>
  );
}
