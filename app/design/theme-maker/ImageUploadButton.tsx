"use client";

import PhotoIcon from "@/components/assets/entries/PhotoIcon";
import { useTheme } from "@/components/contexts/ThemeContext";
import { useToast } from "@/components/contexts/ToastContext";
import { intelligentlyGenerateThemeConfig } from "@/lib/themeMaker/colorHelper";
import { useRef, useState } from "react";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ImageUploadButton() {
  const { appendToast } = useToast();
  const { insertThemeProfile } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null);

  const uploadButtonClick = () => {
    if (!uploadImageInputRef || !uploadImageInputRef.current) {
      return;
    }

    uploadImageInputRef.current.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isLoading) {
      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileType = file.type;

    if (!allowedMimeTypes.includes(fileType)) {
      appendToast({
        title: "Zimo Web",
        description: "Invalid image format.",
      });
      return;
    }

    if (file.size / 1024 / 1024 > 4) {
      appendToast({
        title: "Zimo Web",
        description: "Image must be within 4 MB.",
      });
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/themeMaker/analyzeImage", {
        method: "POST",
        body: formData,
      });

      const { colorArray, success } = await response.json();

      if (!success) {
        appendToast({
          title: "Zimo Web",
          description: "Failed to analyze image.",
        });
        setIsLoading(false);
        return;
      }

      const { vibrant: vibrantColors, alternate: alternateColors } =
        colorArray as ImageColorAnalysisResult;

      const newThemeConfig = intelligentlyGenerateThemeConfig(
        vibrantColors,
        alternateColors
      );

      insertThemeProfile(newThemeConfig);

      appendToast({
        title: "Zimo Web",
        description: "Applied color from image.",
      });
    } catch (error) {
      appendToast({
        title: "Zimo Web",
        description: "Unable to analyze image.",
      });
      console.log("Error uploading theme image file:", error);
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  return (
    <button
      onClick={uploadButtonClick}
      className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
      disabled={isLoading}
    >
      <input
        type="file"
        ref={uploadImageInputRef}
        onChange={handleImageUpload}
        accept={allowedMimeTypes.join(", ")}
        className="w-0 h-0 m-0 p-0 border-none border-0 absolute opacity-0 pointer-events-none select-none"
      />
      <PhotoIcon
        className={`w-full h-auto aspect-square transition-opacity duration-300 scale-95 ease-out ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      />
    </button>
  );
}
