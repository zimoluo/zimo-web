"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useWindowAction } from "@/components/contexts/WindowActionContext";
import { useWindow } from "@/components/contexts/WindowContext";
import { useEffect, useState } from "react";
import notebookStyle from "./notebook.module.css";

interface Props {
  storedText?: string;
}

const instructions = `Welcome to Sticky Notes! You can jot down anything that comes to mind, whether it’s thoughts, ideas, or just random stuff. But remember, these notes are only saved in this window, so if you close it, they’ll be gone.`;

export default function StickyNotesWidget({ storedText }: Props) {
  const { settings, updateSettings } = useSettings();
  const { saveWindows } = useWindow();
  const { modifyWindowSaveProps } = useWindowAction();

  const [text, setText] = useState(
    storedText ?? (settings.hasOpenedStickyNotes ? "" : instructions)
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    modifyWindowSaveProps({
      storedText: newText,
    });
    saveWindows();
  };

  useEffect(() => {
    if (!settings.hasOpenedStickyNotes) {
      updateSettings({
        hasOpenedStickyNotes: true,
      });
    }
  }, []);

  return (
    <div className="bg-light bg-opacity-90 w-full h-full p-1">
      <textarea
        className={`w-full h-full py-2 px-2.5 rounded-sm bg-transparent border-none resize-none text-base placeholder:text-saturated placeholder:text-opacity-50 ${notebookStyle.selectedColor}`}
        value={text}
        onChange={handleChange}
        placeholder="Notes..."
      />
    </div>
  );
}
