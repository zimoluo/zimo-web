"use client";

import ExportIcon from "@/components/assets/entries/ExportIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { calendarDate } from "@/lib/dateUtil";
import { downloadCss } from "@/lib/downloadEntry";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { applyNotebookPageStyleData } from "@/lib/notebookUtil";
import { renderToStaticMarkup } from "react-dom/server";

export default function ExportNotebookButton() {
  const { settings } = useSettings();

  const exportNotebook = () => {
    if (settings.notebookData.length === 0) {
      return;
    }

    const currentNotebookPage = settings.notebookData[settings.notebookIndex];

    if (!currentNotebookPage.content.trim()) {
      return;
    }

    try {
      const html = renderToStaticMarkup(
        <>
          {enrichTextContent(
            applyNotebookPageStyleData(
              currentNotebookPage.content,
              currentNotebookPage.contentStyles
            )
          )}
        </>
      );

      const firstLine =
        currentNotebookPage.content.split("\n")[0].trim() || "Untitled";

      const fullHtml = `<html><head><meta charset="UTF-8"><style>${downloadCss}</style><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${firstLine}</title></head><body><h3>${calendarDate(
        currentNotebookPage.lastEditedDate
      )}</h3><br>${html}</body></html>`;

      const blob = new Blob([fullHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${firstLine}.html`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={exportNotebook}>
      <ExportIcon
        className="h-6 w-auto aspect-square transition-transform duration-300 ease-out scale-95 hover:scale-105"
        strokeWidth={76}
      />
    </button>
  );
}
