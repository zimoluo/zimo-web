import DisplayFavicon from "../assets/DisplayFavicon";

interface Props {
  type: ToastType;
  message: string;
}

type ToastType = "generic";

const toastTypeMap: Record<ToastType, typeof DisplayFavicon> = {
  generic: DisplayFavicon,
};

export default function ToastCard({ type, message }: Props) {
  const ToastIcon = toastTypeMap[type];

  return (
    <div className="rounded-xl bg-widget-80 backdrop-blur-md flex">
      <div className="shrink-0 w-auto h-full">
        <ToastIcon className="h-full w-auto aspect-square" />
      </div>
      <p>{message}</p>
    </div>
  );
}
