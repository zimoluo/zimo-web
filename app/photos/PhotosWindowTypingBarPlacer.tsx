"use client";

import { ReactNode, useState } from "react";
import PhotosCommentTypingBar from "./PhotosCommentTypingBar";
import { useSettings } from "@/components/contexts/SettingsContext";

interface Props {
  likeButton: ReactNode;
}

export default function PhotosWindowTypingBarPlacer({ likeButton }: Props) {
  const [isCommentBarExpanded, setIsCommentBarExpanded] = useState(true);
  const { settings } = useSettings();

  return (
    !settings.disableComments &&
    !(process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true") && (
      <div className="sticky bottom-0 w-full">
        <PhotosCommentTypingBar
          isExpanded={isCommentBarExpanded}
          setIsExpanded={setIsCommentBarExpanded}
          inMiddle={false}
          likeButton={likeButton}
        />
      </div>
    )
  );
}
