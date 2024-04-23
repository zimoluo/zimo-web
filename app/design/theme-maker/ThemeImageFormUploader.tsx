"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useToast } from "@/components/contexts/ToastContext";
import { uploadThemeImage } from "@/lib/dataLayer/client/themeFormDataManager";

export default function ThemeImageAutoUploader() {
  const { settings } = useSettings();
  const { appendToast } = useToast();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || !(files.length > 0)) {
      return;
    }

    const file = files[0];
    const fileSuffix = (file.name.split(".").pop() ?? "").toLowerCase();

    if (!["jpeg", "jpg", "svg", "png", "webp"].includes(fileSuffix)) {
      return;
    }

    if (file.size / 1024 / 1024 > 5) {
      appendToast({
        title: "Zimo Web",
        description: "Image size must be under 5 MB.",
      });
      return;
    }

    uploadThemeImage(
      file,
      settings.customThemeIndex,
      fileSuffix as AllowedImageFormat
    );
  };

  return (
    <div className="w-full px-3 pt-2 h-40 text-base pb-8 rounded-xl shadow-sm border-0.4 border-primary border-opacity-20 bg-transparent bg-widget-70 resize-none placeholder:text-saturated placeholder:text-opacity-70 my-2">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".jpeg, .jpg, .svg, .png, .webp"
      />
    </div>
  );
}
