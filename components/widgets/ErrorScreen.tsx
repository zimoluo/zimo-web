import { ReactNode } from "react";
import NoSignIcon from "../assets/entries/NoSignIcon";
import loadingScreenStyle from "./loading-screen.module.css";

interface Props {
  className?: string;
  text?: ReactNode;
}

export default function ErrorScreen({
  className = "",
  text = "An error occured while loading the content.",
}: Props) {
  return (
    <div
      className={`${loadingScreenStyle.container} w-full h-full grid items-center justify-center ${className}`}
    >
      <div className={`${loadingScreenStyle.inside} relative`}>
        <NoSignIcon className={`w-full h-full aspect-square`} />
        <p className="absolute top-[110%] w-[126%] left-1/2 -translate-x-1/2 text-saturated">
          {text}
        </p>
      </div>
    </div>
  );
}
