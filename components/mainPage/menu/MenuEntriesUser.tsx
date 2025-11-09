"use client";

import Image from "next/image";
import UserStateIcon from "@/components/assets/user/UserStateIcon";
import { useUser } from "@/components/contexts/UserContext";
import { imageFallback } from "@/lib/imageUtil";
import LogoutIcon from "@/components/assets/user/LogoutIcon";
import { clearSessionToken } from "@/lib/dataLayer/client/accountStateCommunicator";
import { useToast } from "@/components/contexts/ToastContext";
import UserProfileFavicon from "@/components/assets/displayFavicon/custom/UserProfileFavicon";

export default function MenuUserCard() {
  const { user, setUser } = useUser();
  const { appendToast } = useToast();

  async function logOut(): Promise<void> {
    await clearSessionToken();
    setUser(null);
    appendToast({
      title: "Zimo Web",
      description: "Logged out.",
    });
  }

  return (
    user !== null && (
      <div className="flex items-center w-full">
        <div className="h-12 aspect-square w-12 py-0.5 px-0.5 shrink-0">
          {user.profilePic ? (
            <Image
              src={user.profilePic}
              className="h-11 w-11 aspect-square object-contain rounded-full"
              height={100}
              width={100}
              alt={`${user.name}'s Profile Picture`}
              onError={imageFallback("/util/profile-fallback.svg")}
            />
          ) : (
            <div className="h-11 w-11 aspect-square rounded-full">
              <UserProfileFavicon
                sub={user.sub}
                className="h-11 w-11 rounded-full"
              />
            </div>
          )}
        </div>
        <div className="text-xl font-bold ml-3">{user.name}</div>

        {user.state !== "normal" && (
          <UserStateIcon
            className="ml-1.5 h-4 md:h-5 w-auto aspect-square object-contain"
            state={user.state}
          />
        )}

        <div className="flex-grow" />
        <button className="ml-2 mr-2" onClick={logOut}>
          <LogoutIcon className="h-6 w-auto aspect-square object-contain transition-transform duration-300 hover:scale-110" />
        </button>
      </div>
    )
  );
}
