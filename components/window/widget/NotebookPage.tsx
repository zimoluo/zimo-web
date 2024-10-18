"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import notebookStyle from "./notebook.module.css";
import _ from "lodash";
import { useRef, useLayoutEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  applyNotebookPageStyleData,
  generateNotebookPageStyleData,
} from "@/lib/notebookUtil";

export default function NotebookPage() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  const isNotebookEmpty = notebookData.length === 0;
  const { setShouldScrollToTop, addNewNotebook } = useNotebook();
  const [isCaretVisible, setIsCaretVisible] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);

  // Function to save the caret position
  const saveCaretPosition = (el: HTMLDivElement) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(el);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  // Function to restore the caret position
  const restoreCaretPosition = (el: HTMLDivElement, pos: number) => {
    const selection = window.getSelection();
    const range = document.createRange();
    let charIndex = 0;
    const nodeStack = [el];
    let node;
    let foundStart = false;
    let stop = false;

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

  // Modified handleChange to include caret management
  const handleChange = () => {
    if (isNotebookEmpty || !editorRef.current) {
      return;
    }

    // Save the caret position before the update
    const caretPosition = saveCaretPosition(editorRef.current);
    setIsCaretVisible(false);

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

    // Restore the caret position after the update
    setTimeout(() => {
      setIsCaretVisible(true);
      restoreCaretPosition(editorRef.current!, caretPosition);
    }, 0);
  };

  const handleClick = () => {
    if (!isNotebookEmpty) {
      return;
    }

    addNewNotebook();
  };

  useLayoutEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = renderToStaticMarkup(
        <>
          {enrichTextContent(
            applyNotebookPageStyleData(
              notebookData[notebookIndex]?.content ?? "",
              notebookData[notebookIndex]?.contentStyles ?? []
            )
          )}
        </>
      );
    }
  }, [notebookData, notebookIndex]);

  return (
    <div className="w-full h-full">
      <div
        className={`w-full h-full border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg p-4 ${
          notebookStyle.editor
        } ${notebookStyle.textbox} ${
          isCaretVisible ? "" : "caret-transparent"
        }`}
        contentEditable={true}
        ref={editorRef}
        onClick={handleClick}
        onInput={handleChange}
      />
    </div>
  );
}
