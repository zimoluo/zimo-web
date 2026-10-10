"use client";
import { useCallback, useEffect, useState } from "react";
import { useGoogleLogin, type CodeResponse } from "@react-oauth/google";
import type { AppleAuthResponse } from "./model/types";
import { accountStore } from "./store";
import { signIn as signInAccount } from "./actions";
import { settingsStore } from "../settings";
import { notify } from "../notifications";
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
    if (clientId === "") return;
    let connected = true;
    const scriptId = "zw-apple-auth";
    const configure = () => {
      if (!connected) return;
      const sdk = appleSdk();
      if (sdk === undefined) return;
      sdk.auth.init({ clientId, scope, redirectURI, usePopup: true });
      setReady(true);
    };
    if (appleSdk() !== undefined) { queueMicrotask(configure); return () => { connected = false; }; }
    const existing = document.getElementById(scriptId);
    const script = existing instanceof HTMLScriptElement ? existing : document.createElement("script");
    const failed = () => { if (connected) setError(new Error("Failed to load Apple JS SDK")); };
    script.addEventListener("load", configure);
    script.addEventListener("error", failed);
    if (existing === null) {
      script.id = scriptId;
      script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      script.async = true;
      document.head.appendChild(script);
    }
    return () => { connected = false; script.removeEventListener("load", configure); script.removeEventListener("error", failed); };
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
