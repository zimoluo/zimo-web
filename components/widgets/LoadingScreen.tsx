import DisplayFavicon from "../assets/DisplayFavicon";
import loadingScreenStyle from "./loading-screen.module.css";

interface Props {
  className?: string;
}

export default function LoadingScreen({ className = "" }: Props) {
  return (
    <div
      className={`${loadingScreenStyle.container} w-full h-full grid items-center justify-center ${className}`}
    >
      <DisplayFavicon
        className={`${loadingScreenStyle.inside} ${loadingScreenStyle.spinning}`}
      />
    </div>
  );
}
