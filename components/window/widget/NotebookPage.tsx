"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { FormEvent } from "react";
import ReactDOMServer from "react-dom/server";

export default function NotebookPage() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  const isNotebookEmpty = notebookData.length === 0;
  const { setShouldScrollToTop, addNewNotebook } = useNotebook();

  const handleChange = (e: FormEvent<HTMLDivElement>) => {
    if (isNotebookEmpty) {
      return;
    }

    const newNotebookData = structuredClone(notebookData);
    newNotebookData[notebookIndex].content = e.currentTarget.textContent!;
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
      <div
        className="w-full h-full text-lg p-4 rounded-lg bg-light bg-opacity-80 shadow-lg"
        contentEditable={true}
        role="textbox"
        onClick={handleClick}
        onInput={handleChange}
        dangerouslySetInnerHTML={{
          __html: ReactDOMServer.renderToStaticMarkup(
            <>
              {isNotebookEmpty
                ? ""
                : enrichTextContent(notebookData[notebookIndex].content)}
            </>
          ),
        }}
      />
    </div>
  );
}
