"use client";

import PhotoIcon from "@/components/assets/entries/PhotoIcon";
import { useToast } from "@/components/contexts/ToastContext";
import { useApplyColorMagic } from "@/lib/themeMaker/applyMagicHook";
import { useRef } from "react";

export default function ImageUploadButton() {
  const { appendToast } = useToast();
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null);
  const accentMagic = useApplyColorMagic();

  const uploadButtonClick = () => {
    if (!uploadImageInputRef || !uploadImageInputRef.current) {
      return;
    }

    uploadImageInputRef.current.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileSuffix = (file.name.split(".").pop() ?? "").toLowerCase();

    if (!["jpeg", "jpg", "png", "webp"].includes(fileSuffix)) {
      appendToast({
        title: "Zimo Web",
        description: "Invalid image format.",
      });
      return;
    }

    if (file.size / 1024 / 1024 > 10) {
      appendToast({
        title: "Zimo Web",
        description: "Image must be within 10 MB.",
      });
      return;
    }

    try {
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
        return;
      }

      const processedColorArray = (colorArray as ColorTriplet).map((color) =>
        Math.max(0, Math.min(255, Math.round(color)))
      ) as ColorTriplet;

      accentMagic("light", processedColorArray);
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
      event.target.value = "";
    }
  };

  return (
    <button
      onClick={uploadButtonClick}
      className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square"
    >
      <input
        type="file"
        ref={uploadImageInputRef}
        onChange={handleImageUpload}
        accept=".jpeg, .jpg, .png, .webp"
        className="w-0 h-0 m-0 p-0 border-none border-0 absolute opacity-0"
      />
      <PhotoIcon className="w-full h-auto aspect-square" />
    </button>
  );
}
