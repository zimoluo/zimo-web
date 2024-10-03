"use client";

import { useSettings } from "@/components/contexts/SettingsContext";

export default function NotebookPage() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  const isNotebookEmpty = notebookData.length === 0;

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

    updateSettings({
      ...settings,
      notebookData: newNotebookData,
      notebookIndex: newNotebookIndex,
    });
  };

  return (
    <div className="w-full h-full">
      <textarea
        className="w-full h-full border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg p-4 placeholder:text-saturated placeholder:text-opacity-50"
        value={isNotebookEmpty ? "" : notebookData[notebookIndex].content}
        onChange={handleChange}
        placeholder="Title..."
      />
    </div>
  );
}
