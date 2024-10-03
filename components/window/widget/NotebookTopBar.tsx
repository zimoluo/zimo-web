"use client";

import DeleteCommentIcon from "@/components/assets/comment/DeleteCommentIcon";
import CrossIcon from "@/components/assets/CrossIcon";
import SidebarToggleIcon from "@/components/assets/entries/SidebarToggleIcon";
import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";

export default function NotebookTopBar() {
  const { settings, updateSettings } = useSettings();
  const { setIsMenuOpen, addNewNotebook, setIsMenuInterpolating } =
    useNotebook();
  const { notebookData, notebookIndex } = settings;

  const deleteSelectedNotebook = () => {
    const newNotebookData = structuredClone(notebookData);
    newNotebookData.splice(notebookIndex, 1);
    setIsMenuInterpolating(false);
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
      <button
        onClick={() => {
          setIsMenuOpen((prev) => !prev);
        }}
      >
        <SidebarToggleIcon className="h-6 w-auto aspect-square transition-transform duration-300 ease-out -scale-x-100 hover:-scale-x-110 hover:scale-y-110" />
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
