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
    updateSettings({ ...settings, notebookData: newNotebookData });
  };

  return (
    <div className="w-full h-full p-4">
      <textarea
        className="w-full h-full border-none border-transparent rounded-xl resize-none text-lg bg-transparent"
        value={isNotebookEmpty ? "" : notebookData[notebookIndex].content}
        onChange={handleChange}
      />
    </div>
  );
}
