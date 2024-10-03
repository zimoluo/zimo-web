"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { formatDate } from "@/lib/dateUtil";
import { trimTitleText } from "@/lib/photos/helper";

export default function NotebookMenu() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  return (
    <div className="h-full overflow-y-auto bg-light bg-opacity-80 rounded-lg px-2.5 py-1 shadow-lg">
      <div className="flex flex-col-reverse gap-2 w-48">
        {notebookData.map((notebook, index) => {
          const isSelected = index === notebookIndex;
          return (
            <button
              key={index}
              className={`${
                isSelected
                  ? "bg-saturated bg-opacity-80 text-light"
                  : "bg-pastel bg-opacity-50"
              } w-full h-14 rounded-lg transition-colors duration-300 ease-out hover:bg-opacity-80 text-start pt-3 pb-1.5 px-3 flex flex-col`}
              onClick={() =>
                updateSettings({ ...settings, notebookIndex: index })
              }
            >
              <p className="font-bold flex-grow leading-none">
                {notebook.content
                  ? trimTitleText(notebook.content.split("\n")[0].trim(), 14)
                  : "Untitled"}
              </p>
              <p className="text-right text-sm w-full leading-none">
                {formatDate(notebook.lastEditedDate)}
              </p>
            </button>
          );
        })}
        <div
          className="flex-grow w-0 pointer-events-none select-none touch-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
