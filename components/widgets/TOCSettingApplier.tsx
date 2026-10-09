"use client";

import { ReactNode } from "react";
import { useSettings } from "@/src/features/settings";

interface Props {
  children?: ReactNode;
}

export default function TOCSettingApplier({ children }: Props) {
  const enabled = useSettings((state) => state.reading.tableOfContents);
  return enabled ? children : null;
}
