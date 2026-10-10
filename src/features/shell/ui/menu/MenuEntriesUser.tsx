"use client";

import Image from "next/image";
import UserStateIcon from "../../../account/ui/UserStateIcon";
import { useAccount, accountStore, signOut } from "../../../account";
import { imageFallback } from "../../../../ui/image";
import LogoutIcon from "../../../../ui/icons/user/LogoutIcon";
import { notify } from "../../../notifications";
import { ThemeMark } from "../../../theme";
import { useAppleSignIn, useSiteGoogleLogin } from "../../../account/use-oauth";
import GoogleLogo from "../../../../ui/icons/GoogleLogo";
import menuStyle from "./menu.module.css";
import { useState } from "react";
import AppleLogo from "../../../../ui/icons/AppleLogo";

export default function MenuUserCard() {
  const user = useAccount((state) => state.user);

  const [isShowingOptions, setIsShowingOptions] = useState(false);

  async function logOut(): Promise<void> {
    await signOut();
    accountStore.getState().setUser(null);
    notify({
      title: "Zimo Web",
      body: "Logged out.",
    });
  }

  const onLoginSuccess = () => {
    setIsShowingOptions(false);
  };

  const { signIn: appleLogin, ready: appleReady } = useAppleSignIn(onLoginSuccess);

  if (!user)
    return (
      <div className="flex items-center w-full relative rounded-full h-12">
        <button
          className="flex items-center w-full relative rounded-full h-12"
          onClick={() => setIsShowingOptions((prev) => !prev)}
        >
          <div className="h-12 aspect-square w-12 py-0.5 px-0.5 shrink-0">
            <div className="h-11 w-11">
              <ThemeMark className="h-11 w-11 aspect-square" />
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
            <GoogleSignInButton onSuccess={onLoginSuccess} />
            <button
              className={`h-11 w-20 aspect-square rounded-full ${menuStyle.navigationBackgroundColor} shadow-xs surface-edge flex items-center justify-center group`}
              onClick={appleLogin} disabled={!appleReady} aria-label="Sign in with Apple"
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
            <ThemeMark
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

      <div className="grow" />
      <button className="ml-2 mr-2" onClick={logOut} aria-label="Sign out">
        <LogoutIcon className="h-6 w-auto aspect-square object-contain transition-transform duration-300 hover:scale-110" />
      </button>
    </div>
  );
}

const googleClientConfigured = Boolean(process.env.NEXT_PUBLIC_ZIMO_WEB_GOOGLE_CLIENT_ID);
function GoogleSignInButton({onSuccess}:{readonly onSuccess:()=>void}) {
  return googleClientConfigured ? <ConfiguredGoogleSignInButton onSuccess={onSuccess} /> : <GoogleButton disabled />;
}
function ConfiguredGoogleSignInButton({onSuccess}:{readonly onSuccess:()=>void}) {
  const {login}=useSiteGoogleLogin(onSuccess);
  return <GoogleButton onClick={login} />;
}
function GoogleButton({onClick,disabled=false}:{readonly onClick?:()=>void;readonly disabled?:boolean}) {
  return <button className={`h-11 w-20 aspect-square rounded-full ${menuStyle.navigationBackgroundColor} shadow-xs surface-edge flex items-center justify-center group disabled:opacity-40`} onClick={onClick} disabled={disabled} aria-label="Sign in with Google"><GoogleLogo className="h-7 w-7 aspect-square group-hover:scale-105 transition-transform duration-300 ease-out" /></button>;
}
