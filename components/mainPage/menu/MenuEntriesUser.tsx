"use client";

import Image from "next/image";
import UserStateIcon from "@/components/assets/user/UserStateIcon";
import { useUser } from "@/components/contexts/UserContext";
import { imageFallback } from "@/lib/imageUtil";
import LogoutIcon from "@/components/assets/user/LogoutIcon";
import { clearSessionToken } from "@/lib/dataLayer/client/accountStateCommunicator";
import { useToast } from "@/components/contexts/ToastContext";
import UserProfileFavicon from "@/components/assets/displayFavicon/custom/UserProfileFavicon";
import DisplayFavicon from "@/components/assets/DisplayFavicon";
import { useAppleSignIn, useSiteGoogleLogin } from "@/lib/helperHooks";
import GoogleLogo from "@/components/assets/GoogleLogo";
import menuStyle from "./menu.module.css";
import { useState } from "react";
import AppleLogo from "@/components/assets/AppleLogo";

export default function MenuUserCard() {
  const { user, setUser } = useUser();
  const { appendToast } = useToast();

  const [isShowingOptions, setIsShowingOptions] = useState(false);

  async function logOut(): Promise<void> {
    await clearSessionToken();
    setUser(null);
    appendToast({
      title: "Zimo Web",
      description: "Logged out.",
    });
  }

  const onLoginSuccess = () => {
    setIsShowingOptions(false);
  };

  const { login: googleLogin } = useSiteGoogleLogin(onLoginSuccess);
  const { signIn: appleLogin } = useAppleSignIn(onLoginSuccess);

  if (!user)
    return (
      <div className="flex items-center w-full relative rounded-full h-12">
        <button
          className="flex items-center w-full relative rounded-full h-12"
          onClick={() => setIsShowingOptions((prev) => !prev)}
        >
          <div className="h-12 aspect-square w-12 py-0.5 px-0.5 shrink-0">
            <div className="h-11 w-11">
              <DisplayFavicon className="h-11 w-11 aspect-square" />
            </div>
          </div>
          <div className="absolute w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg">
            <div
              className={`transition-[opacity,transform,filter] duration-200 ease-out ${
                isShowingOptions
                  ? "opacity-0 -translate-x-5 blur-[8px] pointer-events-none select-none"
                  : "opacity-100 translate-x-0 blur-0"
              }`}
            >
              Sign in to Zimo Web
            </div>
          </div>
        </button>
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 h-full ${
            isShowingOptions ? "" : "pointer-events-none select-none"
          }`}
        >
          <div
            className={`px-0.5 py-0.5 flex gap-2.5 h-full transition-[opacity,transform,filter] duration-200 ease-out ${
              isShowingOptions
                ? "opacity-100 translate-x-0 blur-0"
                : "opacity-0 translate-x-4 blur-[8px]"
            }`}
          >
            <button
              className={`h-11 w-20 aspect-square rounded-full ${menuStyle.navigationBackgroundColor} shadow-sm border-reflect-pastel flex items-center justify-center group`}
              onClick={googleLogin}
            >
              <GoogleLogo className="h-7 w-7 aspect-square group-hover:scale-105 transition-transform duration-300 ease-out" />
            </button>
            <button
              className={`h-11 w-20 aspect-square rounded-full ${menuStyle.navigationBackgroundColor} shadow-sm border-reflect-pastel flex items-center justify-center group`}
              onClick={appleLogin}
            >
              <AppleLogo className="h-7 w-7 aspect-square group-hover:scale-105 transition-transform duration-300 ease-out" />
            </button>
          </div>
        </div>
      </div>
    );

  return (
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
  );
}
