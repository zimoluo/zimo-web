import DisplayFavicon from "@/components/assets/DisplayFavicon";
import faviconStyle from "./window-widget-favicon.module.css";
import ClickToSpinButton from "@/components/widgets/ClickToSpinButton";

interface Props {
  className?: string;
}

export default function WindowWidgetFavicon({ className = "" }: Props) {
  return (
    <div
      className={`${faviconStyle.container} w-full h-full grid items-center justify-center ${className}`}
    >
      <ClickToSpinButton className={`${faviconStyle.inside} rounded-full`}>
        <DisplayFavicon
          className="w-full h-full aspect-square"
          innerClassName="rounded-full"
        />
      </ClickToSpinButton>
    </div>
  );
}
