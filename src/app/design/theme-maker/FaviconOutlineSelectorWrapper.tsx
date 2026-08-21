"use client";

import { ReactNode } from "react";
import { useFaviconEditor } from "./FaviconEditorContext";

interface Props {
  children?: ReactNode;
}

export default function FaviconOutlineSelectorWrapper({ children }: Props) {
  const { faviconConfig } = useFaviconEditor();

  return faviconConfig.mode !== "custom" ? (
    children
  ) : (
    <div className="hidden" aria-hidden="true" />
  );
}
