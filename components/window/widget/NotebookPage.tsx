"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import notebookStyle from "./notebook.module.css";
import _ from "lodash";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  const caretPositionRef = useRef({ position: 0 });

  const windowSelection = (() => {
    try {
      return window.getSelection()?.getRangeAt(0);
    } catch (e) {
      return null;
    }
  })();

  const saveCaretPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      return 0;
    }

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    caretPositionRef.current.position = preCaretRange.toString().length;
  };

  const restoreCaretPosition = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) {
      return;
    }

    const range = document.createRange();
    let charIndex = 0;
    const nodeStack = [editorRef.current];
    let node: any;
    let foundStart = false;
    let stop = false;
    const pos = caretPositionRef.current.position;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        const nextCharIndex = charIndex + node.length;
        if (!foundStart && pos >= charIndex && pos <= nextCharIndex) {
          range.setStart(node, pos - charIndex);
          range.setEnd(node, pos - charIndex);
          foundStart = true;
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleChange = (e: any) => {
    if (isNotebookEmpty) {
      return;
    }

    saveCaretPosition();

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

  useLayoutEffect(() => {
    restoreCaretPosition();
  }, [notebookData[notebookIndex], windowSelection]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg">
      <div className="w-full h-full grid">
        <div
          className={`w-full h-full p-4 outline-none ${notebookStyle.textbox} ${notebookStyle.editor}`}
          contentEditable={true}
          ref={editorRef}
          onInput={handleChange}
          onClick={handleClick}
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
    </div>
  );
}
