"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import notebookStyle from "./notebook.module.css";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { Fragment } from "react";

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
    <div className="w-full h-full relative">
      <textarea
        className={`w-full h-full relative border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg p-4 placeholder:text-saturated placeholder:text-opacity-50 text-transparent caret-primary ${notebookStyle.textbox}`}
        value={isNotebookEmpty ? "" : notebookData[notebookIndex].content}
        onChange={handleChange}
        placeholder={`Title\n${
          notebookData.length <= 1 ? "Begin your first note" : "Notes"
        }...`}
        onClick={handleClick}
      />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none text-lg p-4">
        {isNotebookEmpty
          ? ""
          : notebookData[notebookIndex].content
              .split("\n")
              .map((line, i, arr) => (
                <Fragment key={i}>
                  {i === 0 ? (
                    <strong className="text-xl">{line}</strong>
                  ) : (
                    enrichTextContent(line)
                  )}
                  {i === arr.length - 1 ? null : <br />}
                </Fragment>
              ))}
      </div>
    </div>
  );
}
