"use client";

import { useSettings } from "@/components/contexts/SettingsContext";

export default function NotebookMenu() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col-reverse overflow-y-auto">
        {notebookData.map((notebook, index) => {
          const isSelected = index === notebookIndex;
          return (
            <div
              key={index}
              className={`p-2 ${isSelected ? "bg-widget-50" : ""} w-24 h-12`}
            >
              <button
                onClick={() =>
                  updateSettings({ ...settings, notebookIndex: index })
                }
                className="w-full h-full border-slate-400 border-2"
              >
                {notebook.content.split("\n")[0].trim()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
