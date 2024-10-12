"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import { applyStyleData, generateStyleData } from "@/lib/notebookUtil";
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
        "this is a test. the* text will be complicated and truly exciting.",
        generateStyleData(
          "this *is* a _test_. the\\* text *_will_* be |`_co*m**p*licated_`| and ~~{truly exciting}{https://www.zimoluo.me/}~~."
        )
      )
    );

    if (!isNotebookEmpty) {
      return;
    }

    addNewNotebook();
  };

  return (
    <div className="w-full h-full">
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
