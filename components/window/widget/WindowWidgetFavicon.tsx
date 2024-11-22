import DisplayFavicon from "@/components/assets/DisplayFavicon";
import ClickToSpinButton from "@/components/widgets/ClickToSpinButton";

export default function WindowWidgetFavicon() {
  return (
    <div className="w-full h-full rounded-full bg-none bg-transparent shadow-xl">
      <ClickToSpinButton className="rounded-full w-full h-full bg-none border-none border-0">
        <DisplayFavicon
          className="w-full h-full rounded-full"
          innerClassName="w-full h-full rounded-full"
        />
      </ClickToSpinButton>
    </div>
  );
}
