"use client";

import { useNotebook } from "@/components/contexts/NotebookContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import notebookStyle from "./notebook.module.css";
import _ from "lodash";
import { useLayoutEffect, useRef, useCallback, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  applyNotebookPageStyleData,
  generateNotebookPageStyleData,
} from "@/lib/notebookUtil";

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

  const updateText = () => {
    if (isNotebookEmpty) {
      return;
    }

    const newNotebookData = structuredClone(notebookData);
    const newContent = (() => {
      const htmlContent = editorRef?.current?.innerHTML ?? "";
      const container = document.createElement("div");
      container.innerHTML = htmlContent;

      const hasOnlyWhitespaceText = (node: ChildNode): boolean =>
        node.nodeType === Node.TEXT_NODE &&
        /^\s*$/.test(node.textContent || "");

      const containsOnlyBR = (node: ChildNode): boolean => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).tagName === "DIV"
        ) {
          const children = Array.from(node.childNodes);
          return children.every(
            (child) =>
              (child.nodeType === Node.ELEMENT_NODE &&
                (child as HTMLElement).tagName === "BR") ||
              (child.nodeType === Node.ELEMENT_NODE &&
                (child as HTMLElement).tagName === "DIV" &&
                containsOnlyBR(child))
          );
        }
        return false;
      };

      const findLastMeaningfulNode = (node: ChildNode): ChildNode | null => {
        let lastMeaningfulNode: ChildNode | null = null;

        node.childNodes.forEach((child) => {
          if (
            child.nodeType === Node.TEXT_NODE &&
            !hasOnlyWhitespaceText(child)
          ) {
            lastMeaningfulNode = child;
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;
            if (element.tagName === "BR") {
              lastMeaningfulNode = child;
            } else if (element.tagName === "DIV") {
              const lastChild = findLastMeaningfulNode(child);
              if (lastChild) lastMeaningfulNode = lastChild;
            }
          }
        });

        return lastMeaningfulNode;
      };

      const findFirstMeaningfulNode = (node: ChildNode): ChildNode | null => {
        for (const child of node.childNodes) {
          if (
            child.nodeType === Node.TEXT_NODE &&
            !hasOnlyWhitespaceText(child)
          ) {
            return child;
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;
            if (element.tagName === "BR") {
              return child;
            } else if (element.tagName === "DIV") {
              const firstChild = findFirstMeaningfulNode(child);
              if (firstChild) return firstChild;
            }
          }
        }
        return null;
      };

      const flattenContent = (node: ChildNode): string => {
        let result = "";

        node.childNodes.forEach((child, index) => {
          const nextSibling = node.childNodes[index + 1];
          const prevSibling = node.childNodes[index - 1];

          if (child.nodeType === Node.TEXT_NODE) {
            result += child.textContent;
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;

            if (element.tagName === "BR") {
              result += "\n";
            } else if (element.tagName === "DIV") {
              const isPrevSiblingBR =
                prevSibling &&
                ((prevSibling.nodeType === Node.ELEMENT_NODE &&
                  (prevSibling as HTMLElement).tagName === "BR") ||
                  (prevSibling.nodeType === Node.ELEMENT_NODE &&
                    (prevSibling as HTMLElement).tagName === "DIV" &&
                    findLastMeaningfulNode(prevSibling)?.nodeType ===
                      Node.ELEMENT_NODE &&
                    (findLastMeaningfulNode(prevSibling) as HTMLElement)
                      .tagName === "BR"));

              const isNextSiblingBR =
                nextSibling &&
                ((nextSibling.nodeType === Node.ELEMENT_NODE &&
                  (nextSibling as HTMLElement).tagName === "BR") ||
                  (nextSibling.nodeType === Node.ELEMENT_NODE &&
                    (nextSibling as HTMLElement).tagName === "DIV" &&
                    findFirstMeaningfulNode(nextSibling)?.nodeType ===
                      Node.ELEMENT_NODE &&
                    (findFirstMeaningfulNode(nextSibling) as HTMLElement)
                      .tagName === "BR"));

              const hasOnlyBR = containsOnlyBR(child);

              const leadingNewline = !isPrevSiblingBR ? "\n" : "";
              const trailingNewline =
                !hasOnlyBR && !isNextSiblingBR ? "\n" : "";

              const divContent = flattenContent(child);

              if (divContent) {
                result += leadingNewline + divContent + trailingNewline;
              }
            } else {
              result += flattenContent(child);
            }
          }
        });

        return result;
      };

      return flattenContent(container).trimEnd() + "\n";
    })();

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

  const debouncedHandleInput = useCallback(
    _.debounce(() => {
      saveCaretPosition();
      caretPositionRef.current.shouldRestore = true;
      updateText();
    }, 400),
    [updateText]
  );

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

  useEffect(() => {
    return () => {
      debouncedHandleInput.cancel();
    };
  }, [debouncedHandleInput]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg">
      <div className="w-full h-full grid">
        <div
          className={`w-full h-full p-4 outline-none ${notebookStyle.textbox} ${notebookStyle.editor} selection:bg-middle selection:bg-opacity-40`}
          contentEditable={true}
          ref={editorRef}
          onBlur={updateText}
          onInput={debouncedHandleInput}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
