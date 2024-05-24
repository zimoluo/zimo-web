"use client";

import { ReactNode } from "react";
import { useFaviconEditor } from "./FaviconEditorContext";
import FaviconGradientStopsPositionGenerator from "./FaviconGradientStopsPositionGenerator";

export default function FaviconColorEditorAllocator() {
  const { faviconConfig } = useFaviconEditor();

  const faviconColorEditor = (
    <>
      <div className="h-4 pointer-events-none select-none" aria-hidden="true" />
      <FaviconGradientStopsPositionGenerator />
    </>
  );

  const propertiesEditorMap: Record<FaviconMode, ReactNode> = {
    backdrop: null,
    custom: null,
    outline: null,
    overall: faviconColorEditor,
    separate: faviconColorEditor,
  };

  return propertiesEditorMap[faviconConfig.mode];
}
