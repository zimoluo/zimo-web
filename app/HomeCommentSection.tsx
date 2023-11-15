"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function HomeCommentSection({ children }: Props) {
  const { settings } = useSettings();
  return (
    !settings.disableComments &&
    !(process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true") && (
      <article className="shadow-lg rounded-xl backdrop-blur-lg bg-widget-70 px-4 py-4 text-base mt-6">
        <h3 className="text-xl font-bold mb-2">Say something...</h3>
        {children}
      </article>
    )
  );
}
