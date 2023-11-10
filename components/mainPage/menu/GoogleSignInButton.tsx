import { useSettings } from "@/components/contexts/SettingsContext";
import { useUser } from "@/components/contexts/UserContext";
import GoogleLogo from "@/components/images/GoogleLogo";
import { evaluateGoogleAuthCode } from "@/lib/dataLayer/client/accountStateCommunicator";
import { useGoogleLogin } from "@react-oauth/google";
import { useRef, useState } from "react";

export default function GoogleSignInButton() {
  const { setUser } = useUser();
  const { settings, updateSettings } = useSettings();
  const [prompt, setPrompt] = useState("Sign in with Google");
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const promptRef = useRef<HTMLDivElement | null>(null);

  const validateCode = async (codeResponse: any) => {
    const codeAuth = codeResponse.code;
    const userData = await evaluateGoogleAuthCode(codeAuth, settings);
    if (userData === null) {
      return;
    }
    setUser(userData);
    if (userData.websiteSettings !== null) {
      updateSettings(userData.websiteSettings, false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      validateCode(codeResponse);
    },
    flow: "auth-code",
    onError: () => {
      handleError();
    },
  });

  const handleError = () => {
    if (!promptRef.current) {
      return;
    }
    setIsPromptVisible(false);

    const handleTransitionEnd = () => {
      if (!promptRef.current) return;
      promptRef.current.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );

      setPrompt("Open Zimo Web in a Browser to Sign in");
      setIsPromptVisible(true);
    };

    promptRef.current.addEventListener("transitionend", handleTransitionEnd);
  };

  return (
    <button
      onClick={login}
      className="flex items-center w-full rounded-full"
      onError={handleError}
    >
      <GoogleLogo className="my-1 h-10 md:h-14 w-auto aspect-square" />
      <div
        className={`text-lg md:text-xl ml-4 font-bold transition-opacity duration-300 ease-in-out ${
          isPromptVisible ? "opacity-100" : "opacity-0"
        }`}
        ref={promptRef}
      >
        {prompt}
      </div>
    </button>
  );
}
