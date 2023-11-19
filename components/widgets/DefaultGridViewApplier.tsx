"use client";

import { useSettings } from "../contexts/SettingsContext";
import ImageViewer from "./ImageViewer";

export default function DefaultGridViewApplier(props: ImageViewerProps) {
  const { settings } = useSettings();

  return (
    <ImageViewer {...props} defaultGridView={settings.preferInitialGridView} />
  );
}
