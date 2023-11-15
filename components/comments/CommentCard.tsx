// memoize showdelete etc. dont use state plus effect stuff
// memoize author user state. this is stupid.
// use inline svg
// everything else seems fine

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useComments } from "../contexts/CommentContext";
import React from "react";
import { useReply } from "../contexts/ReplyContext";

interface Props {
  index: number;
}

export default function CommentCard({ index }: Props) {
  const { user } = useUser();
  const { comments, setComments, resourceLocation } = useComments();

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

          userData = await fetchUserDataBySub(authorSub, ["state"]);

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

  const banButtonSrc =
    authorUserState === "banned" ? "/unban-user.svg" : "/ban-user.svg";

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
    await banOrUnbanUser(comments![index].author);
    setIsBanning(false);
  }

  async function evaluateLike() {
    if (isLiking || !user || !resourceLocation || !comments) return;

    setIsLiking(true);

    const userSub = user.sub;

    // Temporarily update the client side for better user experience
    const temporaryComments = comments!.map((comment, i) => {
      if (i !== index) return comment; // Skip if it's not the comment we want to modify

      if (comment.likedBy.includes(userSub)) {
        // Return a new comment object with the userSub removed from the likedBy array
        return {
          ...comment,
          likedBy: comment.likedBy.filter((sub) => sub !== userSub),
        };
      } else {
        // Return a new comment object with the userSub added to the likedBy array
        return {
          ...comment,
          likedBy: [...comment.likedBy, userSub],
        };
      }
    });
    setComments(temporaryComments);

    // Now, update the state
    const updatedComments = await likeComment(
      resourceLocation!,
      index,
      comments[index]
    );
    setComments(updatedComments);

    setIsLiking(false);
  }

  async function evaluateDeleteComment() {
    // Check if resourceLocation, user exists and user is not banned
    if (!resourceLocation || !user || user.state === "banned") return;

    if (!comments || !comments[index]) return;

    // Update the state and upload the updated comments
    const updatedComments = await deleteComment(
      resourceLocation,
      index,
      comments[index]
    );
    setComments(updatedComments);
  }

  return (
    <div className={`${index === 0 ? "" : "mt-8"}`}>
      <Head>
        <link rel="preload" as="image" href={likeButtonEmptyImage} />
        <link rel="preload" as="image" href={likeButtonFilledImage} />
      </Head>
      <CommentUser
        theme={theme}
        sub={comments![index].author}
        date={comments![index].date}
      />
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
              <Image
                alt="Ban or Unban User"
                className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
                height={16}
                width={16}
                src={banButtonSrc}
                key={banButtonSrc}
              />
            </button>
          )}
        <DeleteCommentButton
          deleteComment={evaluateDeleteComment}
          isShown={showDelete}
          theme={theme}
          isReply={false}
        />
        <button
          onClick={evaluateLike}
          className={`${isLiking ? "cursor-wait" : ""} relative group`}
          disabled={isLiking}
        >
          <Image
            alt="Like Button"
            className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 group-hover:scale-110`}
            height={16}
            width={16}
            src={likeButtonEmptyImage}
          />
          <Image
            alt="Like Button"
            aria-hidden="true"
            className={`h-4 w-auto aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute ${svgFilterClass} transform transition-all duration-300 group-hover:scale-110 ${
              shouldRevealFilled ? "opacity-100" : "opacity-0"
            }`}
            height={16}
            width={16}
            src={likeButtonFilledImage}
          />
        </button>
        <div className={`ml-1 ${lightTextColorClass}`}>
          {comments![index].likedBy ? comments![index].likedBy.length : ""}
        </div>
        <button onClick={toggleReply} className="ml-4">
          <Image
            alt="Reply Button"
            className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110`}
            height={16}
            width={16}
            src="/reply-icon.svg"
          />
        </button>
        <div className={`ml-1 ${lightTextColorClass}`}>
          {comments![index].replies ? comments![index].replies!.length : ""}
        </div>
        <button onClick={toggleExpanded} className="ml-4">
          <Image
            alt="Expand or Collapse Replies"
            className={`h-4 w-auto aspect-square ${svgFilterClass} transform transition-transform duration-300 hover:scale-110 ${
              isExpanded ? "-rotate-180" : "rotate-0"
            }`}
            height={16}
            width={16}
            src="/expand-collapse.svg"
          />
        </button>
      </div>
      <ReplyTypeBox
        theme={theme}
        isExpanded={isReplyBoxExpanded}
        commentIndex={index}
        setReplyExpanded={setIsExpanded}
      />
      {comments![index].replies && (
        <ReplyCardColumn
          theme={theme}
          isExpanded={isExpanded}
          commentIndex={index}
          setExpanded={setIsReplyBoxExpanded}
        />
      )}
    </div>
  );
}
