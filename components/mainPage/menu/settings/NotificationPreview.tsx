import notificationPreviewStyle from "./notification-preview.module.css";

interface Props {
  className?: string;
  mode: NotificationStyle;
}

export default function NotificationPreview({ className = "", mode }: Props) {
  return (
    <div
      className={`border-2 border-saturated rounded-xl relative bg-page overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {mode === "banner" && (
        <>
          <DesktopBanner />
          <MobileBanner />
        </>
      )}
      {mode === "toast" && <Toast />}
    </div>
  );
}

const DesktopBanner = () => {
  return (
    <div
      className={`absolute bg-saturated hidden md:block ${notificationPreviewStyle.desktopBanner}`}
    />
  );
};

const MobileBanner = () => {
  return (
    <div
      className={`absolute bg-saturated rounded-full -translate-x-1/2 left-1/2 md:hidden ${notificationPreviewStyle.mobileBanner}`}
    />
  );
};

const Toast = () => {
  return (
    <div
      className={`absolute bg-saturated rounded-full -translate-x-1/2 left-1/2 ${notificationPreviewStyle.toast}`}
    />
  );
};
