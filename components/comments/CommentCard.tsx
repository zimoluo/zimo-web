"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useComments } from "../contexts/CommentContext";
import React from "react";
import { useReply } from "../contexts/ReplyContext";
import {
  fetchBanOrUnbanUser,
  fetchCommentUser,
  fetchDeleteComment,
  fetchLikeComment,
} from "@/lib/dataLayer/client/commentFetcher";
import UserCard from "./UserCard";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import DeleteCommentButton from "./DeleteCommentButton";
import { usePathname } from "next/navigation";
import { getNavigation } from "@/lib/constants/navigationFinder";
import BanUserIcon from "../images/comment/BanUserIcon";
import LikeIcon from "../images/comment/LikeIcon";
import ReplyIcon from "../images/comment/ReplyIcon";
import ExpandCollapseIcon from "../images/comment/ExpandCollapseIcon";

interface Props {
  index: number;
}

const likeIconMap: Record<NavigationKey, LikeIconType> = {
  about: "generic",
  blog: "generic",
  home: "generic",
  photos: "heart",
  projects: "star",
  management: "generic",
};

export default function CommentCard({ index }: Props) {
  const { user } = useUser();
  const { comments, setComments, resourceLocation } = useComments();
  const pathname = usePathname();

  const likeIconType = likeIconMap[getNavigation(pathname)];

  const { setReplyBoxContent } = useReply();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyBoxExpanded, setIsReplyBoxExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (user) {
      setShowDelete(
        (user.sub === comments![index].author && user.state !== "banned") ||
          user.state === "admin"
      );
    }
  }, [user, comments]);

  const [authorUserState, setAuthorUserState] = useState<UserState | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        // Ensure that comments and the index are valid
        if (comments && index >= 0 && index < comments.length) {
          let userData;
          const authorSub = comments[index].author;

          userData = await fetchCommentUser(authorSub);

          if (userData === null) {
            throw new Error("Failed to fetch user data.");
          }

          setAuthorUserState(userData.state);
        }
      } catch (error) {
        console.error("Error fetching user data by sub", error);
      }
    })();
  }, [comments, index, isBanning]);

  const shouldRevealFilled = useMemo(() => {
    if (!resourceLocation || !user || !comments || !comments[index]) {
      return false;
    }

    return comments[index].likedBy.includes(user.sub);
  }, [
    user,
    comments && comments[index] && comments[index].likedBy,
    resourceLocation,
  ]);

  function toggleExpanded() {
    setIsExpanded(!isExpanded);
  }

  function toggleReply() {
    if (!user) return;

    setReplyBoxContent({
      from: user?.sub,
    });

    setIsReplyBoxExpanded(!isReplyBoxExpanded);
  }

  async function evaluateBan() {
    if (isBanning || !user || user.state !== "admin") return;

    setIsBanning(true);
    await fetchBanOrUnbanUser(comments![index].author);
    setIsBanning(false);
  }

  async function evaluateLike() {
    if (isLiking || !user || !resourceLocation || !comments) return;

    setIsLiking(true);

    const userSub = user.sub;

    // Temporarily update the client side for better user experience
    const temporaryComments = comments!.map((comment, i) => {
      if (i !== index) return comment;

      if (comment.likedBy.includes(userSub)) {
        return {
          ...comment,
          likedBy: comment.likedBy.filter((sub) => sub !== userSub),
        };
      } else {
        return {
          ...comment,
          likedBy: [...comment.likedBy, userSub],
        };
      }
    });
    setComments(temporaryComments);

    // Now, update the state
    const updatedComments = await fetchLikeComment(
      resourceLocation!,
      index,
      comments[index]
    );
    setComments(updatedComments);

    setIsLiking(false);
  }

  async function evaluateDeleteComment() {
    if (!resourceLocation || !user || user.state === "banned") return;

    if (!comments || !comments[index]) return;

    const updatedComments = await fetchDeleteComment(
      resourceLocation,
      index,
      comments[index]
    );
    setComments(updatedComments);
  }

  return (
    <div className={`${index === 0 ? "" : "mt-8"}`}>
      <UserCard sub={comments![index].author} date={comments![index].date} />
      <p className="text-lg mb-6 mt-2">
        {comments![index].content.split("\n").map((line, i, arr) => (
          <React.Fragment key={i}>
            {enrichTextContent(line)}
            {i === arr.length - 1 ? null : <br />}
          </React.Fragment>
        ))}
      </p>
      <div className="flex items-center h-4 opacity-95">
        <div className="flex-grow" />
        {user &&
          user.state === "admin" &&
          (authorUserState === "normal" || authorUserState === "banned") && (
            <button
              onClick={evaluateBan}
              className={`mr-3.5 ${isBanning ? "cursor-wait" : ""}`}
              disabled={isBanning}
            >
              <BanUserIcon className="h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110" />
            </button>
          )}
        <DeleteCommentButton
          deleteComment={evaluateDeleteComment}
          isShown={showDelete}
          isReply={false}
        />
        <button
          onClick={evaluateLike}
          className={`${isLiking ? "cursor-wait" : ""} relative group`}
          disabled={isLiking}
        >
          <LikeIcon
            likeIconType={likeIconType}
            filled={false}
            className="h-4 w-auto aspect-square transition-transform duration-300 group-hover:scale-110"
          />
          <LikeIcon
            likeIconType={likeIconType}
            filled={true}
            className={`h-4 w-auto aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute transition-all duration-300 group-hover:scale-110 ${
              shouldRevealFilled ? "opacity-100" : "opacity-0"
            }`}
          />
        </button>
        <div className="ml-1 text-saturated">
          {comments![index].likedBy ? comments![index].likedBy.length : ""}
        </div>
        <button onClick={toggleReply} className="ml-4">
          <ReplyIcon className="h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110" />
        </button>
        <div className="ml-1 text-saturated">
          {comments![index].replies ? comments![index].replies!.length : ""}
        </div>
        <button onClick={toggleExpanded} className="ml-4">
          <ExpandCollapseIcon
            className={`h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110 ${
              isExpanded ? "-rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
