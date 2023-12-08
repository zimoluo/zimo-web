"use client";

import { useEffect, useState } from "react";
import TypingArea from "./TypingArea";
import { useUser } from "../contexts/UserContext";
import { useComments } from "../contexts/CommentContext";
import { fetchAddComment } from "@/lib/dataLayer/client/commentFetcher";
import { useSettings } from "../contexts/SettingsContext";
import { useToast } from "../contexts/ToastContext";
import { maxCommentCharacterCount } from "@/lib/constants/security";

interface Props {
  isExpanded?: boolean;
  messageWord?: string;
}

export default function CommentTypingArea({
  messageWord = "comment",
  isExpanded = true,
}: Props) {
  const [placeholderName, setPlaceholderName] = useState(
    `Sign in to leave a ${messageWord}.`
  );
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { appendToast } = useToast();

  const { comments, setComments, resourceLocation } = useComments();

  const { settings } = useSettings();

  const { user } = useUser();

  useEffect(() => {
    if (!user || user.state === "banned") {
      setInputValue(""); // Clear the text area content
    }

    if (!user) {
      setPlaceholderName(`Sign in to leave a ${messageWord}.`);
      return;
    }
    if (user && user.state === "banned") {
      setPlaceholderName("You are banned. Please contact admin.");
      return;
    }

    setPlaceholderName(`Leave a ${messageWord}...`);
  }, [user]);

  async function sendComment() {
    if (isSending || !user) return;

    if (
      !comments ||
      !resourceLocation ||
      user.state === "banned" ||
      !inputValue.trim()
    )
      return;

    if (inputValue.trim().length > maxCommentCharacterCount) {
      appendToast("Comment is too long to be sent!");
      return;
    }

    setIsSending(true);

    try {
      const newComment = {
        author: user.sub,
        date: new Date().toISOString(),
        content: inputValue.trim(),
        likedBy: [],
        replies: [],
      };

      const updatedComments = await fetchAddComment(
        resourceLocation,
        newComment
      );
      setComments(updatedComments);
      setInputValue("");
    } catch (error) {
      console.error("Error sending comment:", error);
    } finally {
      setIsSending(false);
    }
  }

  if (
    settings.disableComments ||
    process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true"
  )
    return;

  return (
    <TypingArea
      isExpanded={isExpanded}
      isSmall={false}
      placeholderText={placeholderName}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isSending={isSending}
      sendComment={sendComment}
    />
  );
}
