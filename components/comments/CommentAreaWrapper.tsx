"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function CommentAreaWrapper({ children }: Props) {
  const { settings } = useSettings();

  return (
    !settings.disableComments &&
    !(process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true") &&
    children
  );
}
