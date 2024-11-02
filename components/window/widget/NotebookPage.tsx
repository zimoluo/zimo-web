"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import notebookStyle from "./notebook.module.css";
import _ from "lodash";
import { useLayoutEffect, useRef } from "react";
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
  const { setShouldScrollToTop, addNewNotebook, setIsMenuInterpolating } =
    useNotebook();

  const editorRef = useRef<HTMLDivElement>(null);

  const caretPositionRef = useRef({
    position: 0,
    shouldRestore: false,
    isEmptyLine: false,
    lineIndex: 0,
  });

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
      return;
    }

    const range = selection.getRangeAt(0);

    caretPositionRef.current.isEmptyLine = range.startContainer.nodeType !== 3;

    const nodeIndex = Array.from(editorRef.current.childNodes).indexOf(
      range.startContainer as any
    );

    if (caretPositionRef.current.isEmptyLine) {
      if (nodeIndex === -1) {
        const startOffset = range.startOffset;

        caretPositionRef.current.lineIndex = (startOffset - 1) / 2 + 1;
      } else {
        caretPositionRef.current.lineIndex = Math.floor(nodeIndex / 2) + 1;
      }
    } else {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      caretPositionRef.current.position = preCaretRange.toString().length;
    }
  };

  const restoreCaretPosition = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) {
      return;
    }

    const range = document.createRange();

    if (caretPositionRef.current.isEmptyLine) {
      const lineIndex = caretPositionRef.current.lineIndex;
      const emptyLineNode = editorRef.current.childNodes[lineIndex * 2];

      if (emptyLineNode) {
        range.setStart(emptyLineNode, 0);
        range.setEnd(emptyLineNode, 0);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
    } else {
      let charIndex = 0;
      const pos = caretPositionRef.current.position;
      const nodeStack = [editorRef.current];
      let node: any;
      let foundPosition = false;

      while (!foundPosition && (node = nodeStack.pop())) {
        if (node.nodeType === 3) {
          const nextCharIndex = charIndex + node.length;
          if (pos >= charIndex && pos <= nextCharIndex) {
            range.setStart(node, pos - charIndex);
            range.setEnd(node, pos - charIndex);
            foundPosition = true;
          }
          charIndex = nextCharIndex;
        } else {
          let i = node.childNodes.length;
          while (i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }

      if (!foundPosition) {
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
      }

      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleChange = () => {
    if (isNotebookEmpty) {
      return;
    }

    saveCaretPosition();

    caretPositionRef.current.shouldRestore = true;

    const newNotebookData = structuredClone(notebookData);
    let newContent = editorRef?.current?.innerText ?? "";
    const originalContent = newNotebookData[notebookIndex].content;

    const countTrailingNewlines = (str: string) => {
      let count = 0;
      for (let i = str.length - 1; i >= 0 && str[i] === "\n"; i--) {
        count++;
      }
      return count;
    };

    const newContentTrailingNewlines = countTrailingNewlines(newContent);
    const originalContentTrailingNewlines =
      countTrailingNewlines(originalContent);

    if (newContentTrailingNewlines - originalContentTrailingNewlines > 1) {
      newContent = newContent.slice(0, -1);
    }

    newNotebookData[notebookIndex].content = restoreDisplayText(newContent);
    newNotebookData[notebookIndex].contentStyles = _.union(
      newNotebookData[notebookIndex].contentStyles,
      generateNotebookPageStyleData(newContent)
    );
    newNotebookData[notebookIndex].lastEditedDate = new Date().toISOString();

    const updatedNotebook = newNotebookData.splice(notebookIndex, 1)[0];
    newNotebookData.push(updatedNotebook);
    const newNotebookIndex = newNotebookData.length - 1;

    setIsMenuInterpolating(false);
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

  useLayoutEffect(() => {
    if (caretPositionRef.current.shouldRestore) {
      caretPositionRef.current.shouldRestore = false;
      restoreCaretPosition();
    }
  }, [notebookData[notebookIndex], windowSelection]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg">
      <div className="w-full h-full grid">
        <div
          className={`w-full h-full p-4 outline-none ${notebookStyle.textbox} ${notebookStyle.editor} selection:bg-middle selection:bg-opacity-40`}
          contentEditable={true}
          ref={editorRef}
          onInput={handleChange}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
