import notificationPreviewStyle from "./notification-preview.module.css";

interface Props {
  className?: string;
  mode: NotificationStyle;
}

export default function NotificationPreview({ className = "", mode }: Props) {
  return (
    <div
      className={`border-2 border-middle rounded-xl relative bg-page overflow-hidden ${className}`}
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
      className={`absolute bg-middle hidden md:block ${notificationPreviewStyle["desktop-banner"]}`}
    />
  );
};

const MobileBanner = () => {
  return (
    <div
      className={`absolute bg-middle rounded-full -translate-x-1/2 left-1/2 md:hidden ${notificationPreviewStyle["mobile-banner"]}`}
    />
  );
};

const Toast = () => {
  return (
    <div
      className={`absolute bg-middle rounded-full -translate-x-1/2 left-1/2 ${notificationPreviewStyle.toast}`}
    />
  );
};
