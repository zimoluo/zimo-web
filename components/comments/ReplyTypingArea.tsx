"use client";

import { useEffect, useState } from "react";
import { useComments } from "../contexts/CommentContext";
import { useReply } from "../contexts/ReplyContext";
import { useUser } from "../contexts/UserContext";
import {
  fetchAddReply,
  fetchCommentUser,
} from "@/lib/dataLayer/client/commentFetcher";
import TypingArea from "./TypingArea";

interface Props {
  commentIndex: number;
}

export default function ReplyTypingArea({ commentIndex }: Props) {
  const { comments, setComments, resourceLocation } = useComments();
  const { user } = useUser();
  const { replyBoxContent, isTypingBoxExpanded, setIsReplyContainerExpanded } =
    useReply();

  const [inputValue, setInputValue] = useState("");
  const [placeholderName, setPlaceholderName] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchPlaceholderName = async () => {
    try {
      let targetSub: string | null = null;

      if (replyBoxContent?.to) {
        targetSub = replyBoxContent.to;
      } else if (
        comments &&
        typeof commentIndex === "number" &&
        comments[commentIndex]
      ) {
        targetSub = comments[commentIndex].author;
      }

      if (targetSub) {
        let name;

        const fetchedUserData = await fetchCommentUser(targetSub);
        if (fetchedUserData === null) {
          throw new Error("Failed to fetch user name.");
        }

        name = fetchedUserData.name;

        setPlaceholderName(`Reply to ${name}...`);
      } else {
        setPlaceholderName("Reply to...");
      }
    } catch (error) {
      console.error("Failed to fetch user name", error);
    }
  };

  useEffect(() => {
    if (!user || user.state === "banned") {
      setInputValue("");
    }

    if (!user) {
      setPlaceholderName("Sign in to leave a reply.");
      return;
    }
    if (user && user.state === "banned") {
      setPlaceholderName("You are banned. Please contact admin.");
      return;
    }

    fetchPlaceholderName();
  }, [user]);

  async function sendReply() {
    if (isSending || !user || user.state === "banned") return;

    if (
      !comments ||
      !replyBoxContent ||
      !resourceLocation ||
      !inputValue.trim()
    )
      return;

    setIsSending(true);

    try {
      // Construct the new reply
      const newReply = {
        from: replyBoxContent.from,
        date: new Date().toISOString(),
        content: inputValue,
        ...(replyBoxContent.to && { to: replyBoxContent.to }),
      };

      const updatedComments = await fetchAddReply(
        resourceLocation!,
        newReply,
        commentIndex
      );
      setComments(updatedComments);
      setInputValue("");
      setIsReplyContainerExpanded(true);
    } catch (error) {
      console.error("Error sending comment", error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <TypingArea
      isExpanded={isTypingBoxExpanded}
      setInputValue={setInputValue}
      sendComment={sendReply}
      isSmall={true}
      placeholderText={placeholderName}
      isSending={isSending}
      inputValue={inputValue}
    />
  );
}
