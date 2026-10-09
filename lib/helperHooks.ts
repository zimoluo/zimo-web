import type { AppleAuthResponse } from "@/src/features/account/model/types";
import type { NavigationKey } from "@/src/lib/navigation-types";
import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getNavigation } from "./constants/navigationFinder";
import { useGoogleLogin } from "@react-oauth/google";
import type { CodeResponse } from "@react-oauth/google";
import { accountStore, signIn as signInAccount } from "@/src/features/account";
import { settingsStore } from "@/src/features/settings";
import { useSettings } from "@/src/features/settings";
import { notify } from "@/src/features/notifications";

export function useNavigation(): NavigationKey {
  const pathname = usePathname();
  const navigation = useMemo(() => {
    return getNavigation(pathname);
  }, [pathname]);

  return navigation;
}

export const useSwipe = ({left,right,up,down,subjectRef,respectDisableGesturesSetting=true,allowMouse=true}: {
  left?:()=>void;right?:()=>void;up?:()=>void;down?:()=>void;subjectRef?:RefObject<HTMLElement|null>;respectDisableGesturesSetting?:boolean;allowMouse?:boolean;
}) => {
  const gestures = useSettings((state)=>state.motion.gestures);
  const latest=useRef({left,right,up,down});
  useEffect(()=>{latest.current={left,right,up,down};},[left,right,up,down]);
  useEffect(()=>{
    const element=subjectRef?.current;
    if(element===undefined||element===null||respectDisableGesturesSetting&&!gestures)return;
    let origin:{readonly x:number;readonly y:number;readonly time:number;readonly id:number}|null=null;
    const begin=(event:PointerEvent)=>{if(!event.isPrimary||!allowMouse&&event.pointerType==="mouse")return;origin={x:event.clientX,y:event.clientY,time:performance.now(),id:event.pointerId};element.setPointerCapture(event.pointerId);};
    const end=(event:PointerEvent)=>{
      if(origin===null||origin.id!==event.pointerId)return;const start=origin;origin=null;
      if(element.hasPointerCapture(event.pointerId))element.releasePointerCapture(event.pointerId);
      if(performance.now()-start.time>2500)return;const x=start.x-event.clientX;const y=start.y-event.clientY;
      if(Math.max(Math.abs(x),Math.abs(y))<40)return;
      if(Math.abs(x)>=Math.abs(y)){if(x>0)latest.current.right?.();else latest.current.left?.();}else{if(y>0)latest.current.down?.();else latest.current.up?.();}
    };
    const cancel=()=>{origin=null;};
    element.addEventListener("pointerdown",begin);element.addEventListener("pointerup",end);element.addEventListener("pointercancel",cancel);
    return ()=>{element.removeEventListener("pointerdown",begin);element.removeEventListener("pointerup",end);element.removeEventListener("pointercancel",cancel);};
  },[gestures,subjectRef,respectDisableGesturesSetting,allowMouse]);
};

export function useSiteGoogleLogin(onSuccess: () => void = () => {}) {
  const setUser = accountStore.getState().setUser;


  const validateCode = async (codeResponse: CodeResponse) => {
    const codeAuth = codeResponse.code;
    const userData = await signInAccount({ code: codeAuth, settings: settingsStore.getState(), provider: "google" });
    if (userData === null) {
      return;
    }
    setUser(userData);

    notify({
      title: "Zimo Web",
      body: `Signed in as ${userData.name}.`,
    });

    onSuccess();
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      validateCode(codeResponse);
    },
    flow: "auth-code",
  });

  return { login };
}

type AppleSdk = { readonly auth: { init(options: { clientId: string; scope: string; redirectURI: string; usePopup: boolean }): void; signIn(): Promise<AppleAuthResponse> } };
const appleSdk = (): AppleSdk | undefined => typeof window === "undefined" ? undefined : (window as Window & { AppleID?: AppleSdk }).AppleID;

export function useAppleSignIn(onSuccess: () => void = () => {}) {
  const setUser = accountStore.getState().setUser;


  const [ready, setReady] = useState(() => appleSdk() !== undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const redirectURI = "https://www.zimoluo.me";
  const scope = "name";
  const clientId =
    process.env.NEXT_PUBLIC_ZIMO_WEB_APPLE_SIGN_IN_CLIENT_ID || "";

  useEffect(() => {
    if (typeof window === "undefined" || clientId === "") return;

    if (appleSdk()) return;
    const s = document.createElement("script");
    s.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    s.async = true;
    s.onload = () => {
      appleSdk()?.auth.init({
        clientId,
        scope,
        redirectURI,
        usePopup: true,
      });
      setReady(true);
    };
    s.onerror = () => setError(new Error("Failed to load Apple JS SDK"));
    document.head.appendChild(s);
  }, [clientId, redirectURI, scope]);

  const initiateSignIn = useCallback(async () => {
    setError(null);
    if (!appleSdk()) {
      setError(new Error("AppleID SDK not loaded"));
      return null;
    }
    setLoading(true);
    try {
      const res = await appleSdk()?.auth.signIn();
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error("Apple sign-in failed"));
      return null;
    }
  }, []);

  const signIn = useCallback(async () => {
    const res = await initiateSignIn();
    if (res && res.authorization && res.authorization.code) {
      const userData = await signInAccount({ code: res.authorization.code, settings: settingsStore.getState(), provider: "apple", name: res.user?.name ? `${res.user.name.firstName || ""} ${res.user.name.lastName || ""}`.trim() : "Apple User" });
      if (userData === null) {
        return;
      }
      setUser(userData);

      notify({
        title: "Zimo Web",
        body: `Signed in as ${userData.name}.`,
      });

      onSuccess();
    }
  }, [
    initiateSignIn,
    setUser,
    onSuccess,
  ]);

  return { ready, loading, error, signIn };
}
