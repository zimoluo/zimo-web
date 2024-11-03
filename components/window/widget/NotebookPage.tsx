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

export default function NotebookPage() {
  const { settings, updateSettings } = useSettings();
  const { notebookData, notebookIndex } = settings;
  const isNotebookEmpty = notebookData.length === 0;
  const { setShouldScrollToTop, addNewNotebook, setIsMenuInterpolating } =
    useNotebook();

  const editorRef = useRef<HTMLDivElement>(null);

  const handleChange = () => {
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

              const leadingNewline = !isPrevSiblingBR ? "\n" : "";
              const trailingNewline = !isNextSiblingBR ? "\n" : "";

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
    <div className="w-full h-full overflow-y-auto overflow-x-hidden border-none border-transparent rounded-lg resize-none text-lg bg-light bg-opacity-80 shadow-lg">
      <div className="w-full h-full grid">
        <div
          className={`w-full h-full p-4 outline-none ${notebookStyle.textbox} ${notebookStyle.editor} selection:bg-middle selection:bg-opacity-40`}
          contentEditable={true}
          ref={editorRef}
          onBlur={handleChange}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
