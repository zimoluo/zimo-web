"use client";

import React, { useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useComments } from "../contexts/CommentContext";
import { fetchComments } from "@/lib/dataLayer/client/commentFetcher";

const securityCommentShutDown =
  process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true";

export default function CommentCardContainer() {
  const { settings } = useSettings();

  const {
    setComments,
    comments: contextComments,
    resourceLocation,
  } = useComments();

  useEffect(() => {
    const fetchAndSetComments = async () => {
      const comments = await fetchComments(resourceLocation || "");
      if (comments && comments.length > 0) {
        setComments(comments);
      } else {
        setComments([]);
      }
    };

    const intervalId = setInterval(fetchAndSetComments, 10000);

    return () => clearInterval(intervalId);
  }, [resourceLocation]);

  if (settings.disableComments || securityCommentShutDown) {
    return (
      <section className="flex justify-center items-center">
        <p>Comments are disabled.</p>
      </section>
    );
  }

  return JSON.stringify(contextComments);
}
