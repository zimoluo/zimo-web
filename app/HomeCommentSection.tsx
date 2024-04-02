"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import TextBox from "@/components/mainPage/textBox/TextBox";
import TextBoxTitle from "@/components/mainPage/textBox/TextBoxTitle";
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
        <TextBoxTitle>Say something...</TextBoxTitle>
        {children}
      </TextBox>
    )
  );
}
