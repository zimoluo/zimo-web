"use client";

import { useSettings } from "../../settings";
import TextBox from "../../shell/ui/textBox/TextBox";
import SectionTextTitle from "../../shell/ui/textBox/SectionTextTitle";
import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function HomeCommentSection({ children }: Props) {
  const enabled = useSettings((settings) => settings.comments.enabled);
  return (
    enabled &&
    !(process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true") && (
      <TextBox className="mt-6">
        <SectionTextTitle>Say something...</SectionTextTitle>
        {children}
      </TextBox>
    )
  );
}
