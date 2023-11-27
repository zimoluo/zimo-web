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
import LikeIcon from "../images/comment/LikeIcon";
import ReplyIcon from "../images/comment/ReplyIcon";
import ExpandCollapseIcon from "../images/comment/ExpandCollapseIcon";
import ReplyTypingArea from "./ReplyTypingArea";
import { getBanOrUnban } from "@/lib/constants/banOrUnbanUserMap";
import ReplyCardContainer from "./ReplyCardContainer";
import { likeIconMap } from "@/lib/constants/iconMaps";
import likeButtonStyle from "./like-button.module.css";
import { useToast } from "../contexts/ToastContext";
import { useNavigation } from "@/lib/navigationHook";

interface Props {
  index: number;
}

export default function CommentCard({ index }: Props) {
  const { user } = useUser();
  const { comments, setComments, resourceLocation } = useComments();
  const { appendToast } = useToast();

  const likeIconType = likeIconMap[useNavigation()];

  const {
    setReplyBoxContent,
    setIsReplyContainerExpanded,
    isReplyContainerExpanded,
    isTypingBoxExpanded,
    setIsTypingBoxExpanded,
  } = useReply();

  const [showDelete, setShowDelete] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const initiateShaking = () => {
    if (!isShaking) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }
  };

  useEffect(() => {
    if (user) {
      setShowDelete(
        (user.sub === comments![index].author && user.state !== "banned") ||
          user.state === "admin"
      );
    } else {
      setShowDelete(false);
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

  function toggleReplyContainer() {
    setIsReplyContainerExpanded(!isReplyContainerExpanded);
  }

  function toggleTypingBox() {
    if (!user) return;

    setReplyBoxContent({
      from: user?.sub,
    });

    setIsTypingBoxExpanded(!isTypingBoxExpanded);
  }

  async function evaluateBan() {
    if (isBanning || !user || user.state !== "admin") return;

    setIsBanning(true);
    await fetchBanOrUnbanUser(comments![index].author);
    setIsBanning(false);
  }

  const handleLikeClick = () => {
    if (!user) {
      appendToast("Sign in to leave a like!");
      initiateShaking();
    } else {
      if (!shouldRevealFilled) {
        initiateShaking();
      }
      evaluateLike();
    }
  };

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

  const BanOrUnbanUserIcon = useMemo(() => {
    return authorUserState ? getBanOrUnban(authorUserState) : null;
  }, [authorUserState]);

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
              {BanOrUnbanUserIcon && (
                <BanOrUnbanUserIcon className="h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110" />
              )}
            </button>
          )}
        <DeleteCommentButton
          deleteComment={evaluateDeleteComment}
          isShown={showDelete}
        />
        <button
          onClick={handleLikeClick}
          className={`${
            isLiking ? "cursor-wait" : ""
          } relative group rotate-0 ${
            isShaking
              ? `${
                  user && likeIconType === "star"
                    ? likeButtonStyle["charge-spin"]
                    : likeButtonStyle["shake-spin"]
                }`
              : ""
          }`}
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
        <div className="ml-1 font-tabular">
          {comments![index].likedBy ? comments![index].likedBy.length : "0"}
        </div>
        <button onClick={toggleTypingBox} className="ml-4">
          <ReplyIcon className="h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110" />
        </button>
        <div className="ml-1 font-tabular">
          {comments![index].replies ? comments![index].replies!.length : "0"}
        </div>
        <button onClick={toggleReplyContainer} className="ml-4">
          <ExpandCollapseIcon
            className={`h-4 w-auto aspect-square transition-transform duration-300 hover:scale-110 ${
              isReplyContainerExpanded ? "-rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>
      <ReplyTypingArea commentIndex={index} />
      {comments![index].replies && <ReplyCardContainer commentIndex={index} />}
    </div>
  );
}
