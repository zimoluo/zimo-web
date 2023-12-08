import GoogleLogo from "@/components/assets/GoogleLogo";
import { useRef, useState } from "react";
import useSiteLogin from "@/lib/siteLoginHook";

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

  const { login } = useSiteLogin(handleError);

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
