"use client";

import { useComments } from "../contexts/CommentContext";
import { useUser } from "../contexts/UserContext";
import { useReply } from "../contexts/ReplyContext";
import { useEffect, useMemo, useState } from "react";
import DeleteCommentButton from "./DeleteCommentButton";
import React from "react";
import {
  fetchBanOrUnbanUser,
  fetchCommentUser,
  fetchDeleteReply,
} from "@/lib/dataLayer/client/commentFetcher";
import UserCard from "./UserCard";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { getBanOrUnban } from "@/lib/constants/banOrUnbanUserMap";
import ReplyIcon from "../assets/comment/ReplyIcon";

interface Props {
  index: number;
  commentIndex: number;
}

export default function ReplyCard({ index, commentIndex }: Props) {
  const { user } = useUser();

  const { comments, resourceLocation, setComments } = useComments();

  const { setReplyBoxContent, setIsTypingBoxExpanded } = useReply();

  const repliesData = comments![commentIndex]!.replies![index];

  const [isBanning, setIsBanning] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (user) {
      setShowDelete(
        (user.sub === repliesData.from && user.state !== "banned") ||
          user.state === "admin"
      );
    } else {
      setShowDelete(false);
    }
  }, [user, repliesData.from]);

  const [authorUserState, setAuthorUserState] = useState<UserState | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        let userData;

        userData = await fetchCommentUser(repliesData.from);

        if (userData === null) {
          throw new Error("Failed to fetch user data.");
        }

        setAuthorUserState(userData.state);
      } catch (error) {
        console.error("Error fetching user data by sub", error);
      }
    })();
  }, [repliesData, isBanning]);

  function toggleReply() {
    if (!user) return;

    setReplyBoxContent({
      from: user?.sub,
      to: repliesData.from,
    });
    setIsTypingBoxExpanded(true);
  }

  async function evaluateBan() {
    if (isBanning || !user || user.state !== "admin") return;

    setIsBanning(true);
    await fetchBanOrUnbanUser(repliesData.from);
    setIsBanning(false);
  }

  async function evaluateDeleteReply() {
    if (!resourceLocation || !user || user.state === "banned") return;

    const updatedComments = await fetchDeleteReply(
      resourceLocation,
      commentIndex,
      index,
      repliesData
    );

    setComments(updatedComments);
  }

  const BanOrUnbanUserIcon = useMemo(() => {
    return authorUserState ? getBanOrUnban(authorUserState) : null;
  }, [authorUserState]);

  return (
    <div className="mt-6">
      <UserCard
        isReply={true}
        sub={repliesData.from}
        date={repliesData.date}
        toSub={repliesData.to ? repliesData.to : ""}
      />
      <p className="text-base mb-3 mt-1.5">
        {repliesData.content.split("\n").map((line, i, arr) => (
          <React.Fragment key={i}>
            {enrichTextContent(line)}
            {i === arr.length - 1 ? null : <br />}
          </React.Fragment>
        ))}
      </p>
      <div className="flex h-4 items-center mb-1.5">
        <div className="flex-grow" />
        {user &&
          user.state === "admin" &&
          (authorUserState === "normal" || authorUserState === "banned") && (
            <button
              onClick={evaluateBan}
              className={`mr-3 ${isBanning ? "cursor-wait" : ""}`}
              disabled={isBanning}
            >
              {BanOrUnbanUserIcon && (
                <BanOrUnbanUserIcon className="h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110" />
              )}
            </button>
          )}
        <DeleteCommentButton
          deleteComment={evaluateDeleteReply}
          isShown={showDelete}
        />
        <button onClick={toggleReply} className="mr-0.5">
          <ReplyIcon className="h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
