"use client";

import DeleteCommentIcon from "@/components/assets/comment/DeleteCommentIcon";
import CrossIcon from "@/components/assets/CrossIcon";
import SidebarToggleIcon from "@/components/assets/entries/SidebarToggleIcon";
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
    <div className="flex gap-4 items-center rounded-lg bg-light bg-opacity-80 px-4 py-3 shadow-lg">
      <button onClick={addNewNotebook}>
        <SidebarToggleIcon className="h-6 w-auto aspect-square transition-transform duration-300 ease-out hover:scale-110" />
      </button>
      <button onClick={addNewNotebook}>
        <CrossIcon className="rotate-45 h-6 scale-75 w-auto aspect-square transition-transform duration-300 ease-out hover:scale-85" />
      </button>
      <button onClick={deleteSelectedNotebook}>
        <DeleteCommentIcon
          strokeWidth={1.8}
          className="h-6 w-auto aspect-square transition-transform duration-300 ease-out scale-95 hover:scale-105"
        />
      </button>
    </div>
  );
}