"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import TextBox from "@/components/mainPage/textBox/TextBox";
import SectionTextTitle from "@/components/mainPage/textBox/SectionTextTitle";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function HomeCommentSection({ children }: Props) {
  const { settings } = useSettings();
  return (
    !settings.disableComments &&
    !(process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true") && (
      <TextBox className="mt-6">
        <SectionTextTitle>Say something...</SectionTextTitle>
        {children}
      </TextBox>
    )
  );
}
