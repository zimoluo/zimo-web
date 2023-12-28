"use client";

import { ReactNode } from "react";
import { useSettings } from "../contexts/SettingsContext";

interface Props {
  children?: ReactNode;
}

export default function TOCSettingApplier({ children }: Props) {
  const { settings } = useSettings();
  return settings.disableTableOfContents ? null : children;
}
