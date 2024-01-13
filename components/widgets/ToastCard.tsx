import DisplayFavicon from "../assets/DisplayFavicon";
import toastStyle from "./toast.module.css";

const toastIconMap: Record<ToastIcon, typeof DisplayFavicon> = {
  generic: DisplayFavicon,
};

export default function ToastCard({
  icon = "generic",
  title,
  description = "",
}: ToastEntry) {
  const ToastIcon = toastIconMap[icon];

  return (
    <div
      className={`rounded-full md:rounded-2xl bg-widget-100 md:bg-widget-80 md:backdrop-blur-md flex border-opacity-75 border-0.8 border-saturated text-sm md:text-base ${toastStyle.sizing} px-2 py-1 md:py-1.5 md:shadow-lg`}
    >
      <div className="shrink-0 w-auto h-full p-1.5 md:p-2 mr-1">
        <ToastIcon className="h-full w-auto aspect-square" />
      </div>
      <div className="flex flex-col justify-center items-start flex-grow overflow-hidden">
        <h3 className={`font-bold ${description ? "whitespace-nowrap" : ""}`}>
          {title}
        </h3>
        {description && <p className="md:flex-grow">{description}</p>}
      </div>
    </div>
  );
}
