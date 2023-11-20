"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { ReactNode } from "react";

interface Props {
  entry?: ReactNode;
  gallery?: ReactNode;
}

export default function PhotosModeApplier({ entry, gallery }: Props) {
  const { settings } = useSettings();
  return settings.enableGallery ? gallery : entry;
}
