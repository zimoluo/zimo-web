import GoogleLogo from "@/components/assets/GoogleLogo";
import useSiteLogin from "@/lib/helperHooks";
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

  const { login } = useSiteLogin(handleError);

  return (
    <button
      onClick={login}
      className="flex items-center w-full rounded-full"
      onError={handleError}
    >
      <div className="h-12 md:h-16 p-1 aspect-square">
        <GoogleLogo className="h-full w-auto aspect-square" />
      </div>
      <div
        className={`text-xl md:text-2xl ml-3.5 font-bold transition-opacity duration-300 ease-in-out ${
          isPromptVisible ? "opacity-100" : "opacity-0"
        }`}
        ref={promptRef}
      >
        {prompt}
      </div>
    </button>
  );
}
