"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import notebookStyle from "./notebook.module.css";

export default function NotebookPage() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  const isNotebookEmpty = notebookData.length === 0;
  const { setShouldScrollToTop, addNewNotebook } = useNotebook();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isNotebookEmpty) {
      return;
    }

    const newNotebookData = structuredClone(notebookData);
    newNotebookData[notebookIndex].content = e.target.value;
    newNotebookData[notebookIndex].lastEditedDate = new Date().toISOString();

    const updatedNotebook = newNotebookData.splice(notebookIndex, 1)[0];
    newNotebookData.push(updatedNotebook);
    const newNotebookIndex = newNotebookData.length - 1;

    setShouldScrollToTop(true);

    updateSettings({
      ...settings,
      notebookData: newNotebookData,
      notebookIndex: newNotebookIndex,
    });
  };

  const handleClick = () => {
    if (!isNotebookEmpty) {
      return;
    }

    addNewNotebook();
  };

  return (
    <div className="w-full h-full">
      <textarea
        className={`w-full h-full border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg p-4 placeholder:text-saturated placeholder:text-opacity-50 ${notebookStyle.selectedColor} ${notebookStyle.textbox}`}
        value={isNotebookEmpty ? "" : notebookData[notebookIndex].content}
        onChange={handleChange}
        placeholder={`Title\n${
          notebookData.length <= 1 ? "Begin your first note" : "Notes"
        }...`}
        onClick={handleClick}
      />
    </div>
  );
}
