"use client";

import DeleteCommentIcon from "@/components/assets/comment/DeleteCommentIcon";
import CrossIcon from "@/components/assets/CrossIcon";
import DuplicateIcon from "@/components/assets/entries/DuplicateIcon";
import SidebarToggleIcon from "@/components/assets/entries/SidebarToggleIcon";
import {
  maximumNotebooks,
  useNotebook,
} from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useToast } from "@/components/contexts/ToastContext";
import ExportNotebookButton from "./ExportNotebookButton";

export default function NotebookTopBar() {
  const { settings, updateSettings } = useSettings();
  const { setIsMenuOpen, addNewNotebook } = useNotebook();
  const { appendToast } = useToast();
  const { notebookData, notebookIndex } = settings;

  const deleteSelectedNotebook = () => {
    const newNotebookData = structuredClone(notebookData);
    newNotebookData.splice(notebookIndex, 1);
    setIsMenuOpen(true);
    updateSettings({
      ...settings,
      notebookData: newNotebookData,
      notebookIndex: Math.max(
        Math.min(notebookIndex, newNotebookData.length - 1),
        0
      ),
    });
  };

  const duplicateSelectedNotebook = () => {
    if (notebookData.length >= maximumNotebooks) {
      appendToast({
        title: "Notebook",
        icon: "notebook",
        description: `Up to ${maximumNotebooks} notebook${
          maximumNotebooks > 1 ? "s" : ""
        } may exist.`,
      });
      return;
    }

    const newNotebookData = structuredClone(notebookData);

    const updatedNotebookData = [
      ...newNotebookData.slice(0, notebookIndex + 1),
      {
        ...newNotebookData[notebookIndex],
        date: new Date().toISOString(),
        lastEditedDate: new Date().toISOString(),
      },
      ...newNotebookData.slice(notebookIndex + 1),
    ];

    updateSettings({
      notebookData: updatedNotebookData,
      notebookIndex: notebookIndex + 1,
    });

    setIsMenuOpen(true);
  };

  return (
    <div className="flex gap-4 items-center rounded-lg bg-light bg-opacity-80 px-4 py-3 shadow-lg">
      <button
        onClick={() => {
          setIsMenuOpen((prev) => !prev);
        }}
        className="hidden md:block"
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
      <div className="flex-grow h-0 pointer-events-none select-none touch-none" />
      <button onClick={duplicateSelectedNotebook}>
        <DuplicateIcon
          className="h-6 w-auto aspect-square transition-transform duration-300 ease-out scale-100 hover:scale-110"
          strokeWidth={74}
        />
      </button>
      <ExportNotebookButton />
    </div>
  );
}
