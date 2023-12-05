"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchCommentUser } from "@/lib/dataLayer/client/commentFetcher";
import { imageFallback } from "@/lib/imageUtil";
import { formatDate } from "@/lib/dateUtil";
import UserStateIcon from "../assets/user/UserStateIcon";
import ReplyToIcon from "../assets/comment/ReplyToIcon";

interface Props {
  sub: string;
  date: string;
  toSub?: string;
  isReply?: boolean;
}

const fetchData = async (targetSub: string) => {
  const data = await fetchCommentUser(targetSub);
  return data;
};

export default function UserCard({ sub, date, toSub, isReply = false }: Props) {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [toData, setToData] = useState<UserInfo | null>(null);

  const fetchAndSetData = async () => {
    const data = await fetchData(sub);
    setUserData(
      (data as UserInfo) || {
        name: "Anonymous",
        profilePic: "/util/profile-fallback.svg",
        state: "normal",
      }
    );

    if (toSub) {
      const fetchedToData = await fetchData(toSub);
      if (fetchedToData) {
        setToData(fetchedToData as UserInfo);
      }
    }
  };

  useEffect(() => {
    fetchAndSetData();
  }, [sub, toSub]);

  if (!userData)
    return (
      <div className="flex items-center" aria-hidden="true">
        <div
          className={`flex justify-center items-center my-1 ${
            isReply ? "w-8 h-8 mr-2 md:mr-3" : "w-10 h-10 mr-3 md:mr-4"
          }`}
        >
          <div className="h-full w-full aspect-square bg-pastel rounded-full" />
        </div>
      </div>
    );

  const {
    name: userName,
    profilePic: userProfile,
    state: userState,
  } = userData;

  return (
    <div className="flex items-center">
      <div
        className={`flex justify-center items-center h-auto ${
          isReply ? "w-8 mr-2 md:mr-3" : "w-10 mr-3 md:mr-4"
        }`}
      >
        <div className="w-full h-auto rounded-full overflow-hidden flex justify-center items-center">
          <Image
            src={userProfile}
            alt={`${userName}'s Profile`}
            className="h-full w-fit"
            width={isReply ? 32 : 40}
            height={isReply ? 32 : 40}
            onError={imageFallback("/util/profile-fallback.svg")}
          />
        </div>
      </div>

      <div className="grid grid-rows-2">
        <div className="flex justify-start items-center">
          <p className={isReply ? "text-sm" : "text-base"}>{userName}</p>
          {userState !== "normal" && (
            <UserStateIcon
              state={userState}
              className={`ml-1 ${
                isReply ? "h-3" : "h-3.5 md:h-4"
              } w-auto aspect-square object-contain`}
            />
          )}

          {isReply && toData && (
            <>
              <ReplyToIcon className="mx-1.5 h-2.5 w-auto aspect-square" />
              <p className="text-sm">{toData.name}</p>
              {toData.state !== "normal" && (
                <UserStateIcon
                  state={toData.state}
                  className="ml-1 h-3 w-auto aspect-square object-contain"
                />
              )}
            </>
          )}
        </div>

        <div className="flex justify-start items-center">
          <p
            className={`text-saturated ${
              isReply ? "text-xs" : "text-sm"
            } opacity-80`}
          >
            {formatDate(date)}
          </p>
        </div>
      </div>
    </div>
  );
}
