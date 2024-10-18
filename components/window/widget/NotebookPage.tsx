"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import notebookStyle from "./notebook.module.css";
import _ from "lodash";
import { useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  applyNotebookPageStyleData,
  generateNotebookPageStyleData,
} from "@/lib/notebookUtil";

// hot idea: fix the caret thing. then use the special format i introduced earlier for storage (or rendering? but it might get things lost so)
// the logic will eventually play out and boom

export default function NotebookPage() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  const isNotebookEmpty = notebookData.length === 0;
  const { setShouldScrollToTop, addNewNotebook } = useNotebook();

  const editorRef = useRef<HTMLDivElement>(null);

  const handleChange = () => {
    if (isNotebookEmpty) {
      return;
    }

    const newNotebookData = structuredClone(notebookData);

    const newContent = editorRef?.current?.innerText ?? "";

    newNotebookData[notebookIndex].content = restoreDisplayText(newContent);
    newNotebookData[notebookIndex].contentStyles = _.union(
      newNotebookData[notebookIndex].contentStyles,
      generateNotebookPageStyleData(newContent)
    );
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
        className={`w-full h-full relative border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg p-4 placeholder:text-saturated placeholder:text-opacity-50 ${notebookStyle.textbox}`}
        contentEditable={true}
        ref={editorRef}
        onClick={handleClick}
        onInput={handleChange}
        dangerouslySetInnerHTML={{
          __html: renderToStaticMarkup(
            <>
              {enrichTextContent(
                applyNotebookPageStyleData(
                  notebookData[notebookIndex]?.content ?? "",
                  notebookData[notebookIndex]?.contentStyles ?? []
                )
              )}
            </>
          ),
        }}
      />
    </div>
  );
}
