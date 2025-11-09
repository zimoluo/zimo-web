import GoogleLogo from "@/components/assets/GoogleLogo";
import { useSiteGoogleLogin } from "@/lib/helperHooks";
import { useRef, useState } from "react";

export default function GoogleSignInButton() {
  const [prompt, setPrompt] = useState("Sign in with Google");
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const promptRef = useRef<HTMLDivElement | null>(null);

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

  const { login } = useSiteGoogleLogin(handleError);

  return (
    <button
      onClick={login}
      className="flex items-center w-full rounded-full h-full relative"
      onError={handleError}
    >
      <div className="h-full aspect-square p-0.5">
        <GoogleLogo className="h-full w-auto aspect-square" />
      </div>
      <div
        className={`absolute w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg transition-opacity duration-300 ease-in-out ${
          isPromptVisible ? "opacity-100" : "opacity-0"
        }`}
        ref={promptRef}
      >
        {prompt}
      </div>
    </button>
  );
}
