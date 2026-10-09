import { ThemeMark } from "@/src/features/theme";
import loadingScreenStyle from "./loading-screen.module.css";

interface Props {
  className?: string;
}

export default function LoadingScreen({ className = "" }: Props) {
  return (
    <div
      className={`${loadingScreenStyle.container} w-full h-full grid items-center justify-center ${className}`}
    >
      <ThemeMark
        className={`${loadingScreenStyle.inside}  ${loadingScreenStyle.spinning}`}
      />
    </div>
  );
}
