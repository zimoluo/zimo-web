"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { usePathname } from "next/navigation";
import { likeIconMap } from "@/lib/constants/iconMaps";
import LikeIcon from "../images/comment/LikeIcon";
import likeButtonStyle from "./like-button.module.css";
import { useToast } from "../contexts/ToastContext";
import {
  fetchEntryLike,
  fetchUpdateEntryLike,
} from "@/lib/dataLayer/client/commentFetcher";
import { useNavigation } from "@/lib/navigationHook";

interface Props {
  resourceLocation: string;
  initialLikedBy?: string[] | null;
}

export default function EntryLikeButton({
  resourceLocation,
  initialLikedBy = null,
}: Props) {
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [storedLikedBy, setStoredLikedBy] = useState<string[] | null>(
    initialLikedBy
  );
  const [isShaking, setIsShaking] = useState(false);
  const { appendToast } = useToast();

  const isLikingRef = useRef(isLiking);
  const { user } = useUser();

  const pathname = usePathname();
  const likeIconType = likeIconMap[useNavigation()];

  const initiateShaking = () => {
    if (!isShaking) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }
  };

  const handleClick = () => {
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

  useEffect(() => {
    isLikingRef.current = isLiking;
  }, [isLiking]);

  useEffect(() => {
    const fetchAndSetLikedBy = async () => {
      if (isLikingRef.current) return;
      const fetchedLikedBy = await fetchEntryLike(resourceLocation);
      if (isLikingRef.current) return;
      if (fetchedLikedBy) {
        setStoredLikedBy(fetchedLikedBy);
      } else {
        setStoredLikedBy([]);
      }
    };

    fetchAndSetLikedBy();

    const intervalId = setInterval(fetchAndSetLikedBy, 5000);

    return () => clearInterval(intervalId);
  }, [resourceLocation]);

  const shouldRevealFilled = useMemo(() => {
    if (!user || !storedLikedBy || storedLikedBy.length === 0) {
      return false;
    }

    return storedLikedBy.includes(user.sub);
  }, [user, storedLikedBy]);

  async function evaluateLike() {
    if (
      isLiking ||
      !user ||
      !resourceLocation ||
      !storedLikedBy ||
      user.state === "banned"
    )
      return;

    setIsLiking(true);

    const userSub = user.sub;

    let temporaryLikedBy = storedLikedBy;
    if (storedLikedBy.includes(userSub)) {
      temporaryLikedBy = storedLikedBy.filter((sub) => sub != userSub);
    } else {
      temporaryLikedBy = [...storedLikedBy, userSub];
    }

    setStoredLikedBy(temporaryLikedBy);

    const updatedLikedBy = await fetchUpdateEntryLike(resourceLocation!);
    setStoredLikedBy(updatedLikedBy);

    setIsLiking(false);
  }

  return (
    <div className="flex items-center relative">
      <button
        onClick={handleClick}
        className={`${isLiking ? "cursor-wait" : ""} relative group rotate-0 ${
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
          filled={false}
          likeIconType={likeIconType}
          className="h-6 w-auto aspect-square transition-transform duration-300 group-hover:scale-110"
        />
        <LikeIcon
          filled={true}
          likeIconType={likeIconType}
          className={`h-6 w-auto aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute transition-all duration-300 group-hover:scale-110 ${
            shouldRevealFilled ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>
      <div
        className={`ml-1.5 font-tabular text-lg ${
          storedLikedBy ? "" : "opacity-0"
        }`}
      >
        {storedLikedBy ? storedLikedBy.length : "0"}
      </div>
    </div>
  );
}
