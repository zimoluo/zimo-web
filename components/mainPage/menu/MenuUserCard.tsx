"use client";

import Image from "next/image";
import UserStateIcon from "@/components/assets/user/UserStateIcon";
import { useUser } from "@/components/contexts/UserContext";
import { imageFallback } from "@/lib/imageUtil";
import LogoutIcon from "@/components/assets/user/LogoutIcon";
import { clearSessionToken } from "@/lib/dataLayer/client/accountStateCommunicator";
import { useToast } from "@/components/contexts/ToastContext";

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
        <div className="h-12 md:h-16 p-1 aspect-square">
          <Image
            src={user.profilePic}
            className="h-full w-auto aspect-square object-contain rounded-full"
            height={64}
            width={64}
            alt={`${user.name}'s Profile Picture`}
            onError={imageFallback("/util/profile-fallback.svg")}
          />
        </div>
        <div className="text-xl md:text-2xl font-bold ml-3.5">{user.name}</div>

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
