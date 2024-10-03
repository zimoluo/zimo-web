"use client";

import { useSettings } from "@/components/contexts/SettingsContext";

export default function NotebookTopBar() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;

  const addNewNotebook = () => {
    const newNotebookData = structuredClone(notebookData);
    newNotebookData.push({
      date: new Date().toISOString(),
      lastEditedDate: new Date().toISOString(),
      content: "",
    });
    updateSettings({
      ...settings,
      notebookData: newNotebookData,
      notebookIndex: newNotebookData.length - 1,
    });
  };

  const deleteSelectedNotebook = () => {
    const newNotebookData = structuredClone(notebookData);
    newNotebookData.splice(notebookIndex, 1);
    updateSettings({
      ...settings,
      notebookData: newNotebookData,
      notebookIndex: Math.max(
        Math.min(notebookIndex, newNotebookData.length - 1),
        0
      ),
    });
  };

  return (
    <div className="flex gap-4">
      <button onClick={addNewNotebook}>Add new</button>
      <button onClick={deleteSelectedNotebook}>Delete selected</button>
    </div>
  );
}
