"use client";

import React, { useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useComments } from "../contexts/CommentContext";
import { fetchComments } from "@/lib/dataLayer/client/commentFetcher";
import { ReplyProvider } from "../contexts/ReplyContext";
import CommentCard from "./CommentCard";

const securityCommentShutDown =
  process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true";

export default function CommentCardContainer() {
  const { settings } = useSettings();

  const {
    setComments,
    comments: contextComments,
    resourceLocation,
  } = useComments();

  const fetchAndSetComments = async () => {
    const comments = await fetchComments(resourceLocation || "");
    if (comments && comments.length > 0) {
      setComments(comments);
    } else {
      setComments([]);
    }
  };

  useEffect(() => {
    fetchAndSetComments();

    const intervalId = setInterval(fetchAndSetComments, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (settings.disableComments || securityCommentShutDown) {
    return (
      <section className="flex justify-center items-center">
        <p>Comments are disabled.</p>
      </section>
    );
  }

  return (
    <section>
      {contextComments &&
        contextComments.map((comment, index) => (
          <ReplyProvider key={index}>
            <CommentCard index={index} />
          </ReplyProvider>
        ))}
    </section>
  );
}
