"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import notebookStyle from "./notebook.module.css";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import { FormEvent, FormEventHandler, Fragment } from "react";
import { applyStyleData, generateStyleData } from "@/lib/notebookUtil";

export default function NotebookPage() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  const isNotebookEmpty = notebookData.length === 0;
  const { setShouldScrollToTop, addNewNotebook } = useNotebook();

  const handleChange = (e: FormEventHandler<HTMLDivElement>) => {
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

    console.log(
      restoreDisplayText(
        "this *is* a _test_. the\\* text *_will_* be |`_co*m**p*licated_`| and ~~{truly exciting}{https://www.zimoluo.me/}~~."
      )
    );
    console.log(
      JSON.stringify(
        generateStyleData(
          "this *is* a _test_. the\\* text *_will_* be |`_co*m**p*licated_`| and ~~{truly exciting}{https://www.zimoluo.me/}~~."
        )
      )
    );
    console.log(
      applyStyleData(
        "this is a test. the\\* text will be complicated and truly exciting.",
        generateStyleData(
          "this *is* a _test_. the\\* text *_will_* be |`_co*m**p*licated_`| and ~~{truly exciting}{https://www.zimoluo.me/}~~."
        )
      )
    );

    addNewNotebook();
  };

  return (
    <div className="w-full h-full relative">
      <div
        className="absolute top-0 left-0 w-full h-full text-lg p-4"
        contentEditable={true}
        onClick={handleClick}
        onInput={handleChange}
      >
        {isNotebookEmpty
          ? ""
          : enrichTextContent(notebookData[notebookIndex].content)}
      </div>
    </div>
  );
}
