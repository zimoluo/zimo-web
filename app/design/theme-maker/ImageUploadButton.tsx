"use client";

import PhotoIcon from "@/components/assets/entries/PhotoIcon";
import { useToast } from "@/components/contexts/ToastContext";
import { useRef, useState } from "react";
import { rgb, hex } from "color-convert";
import {
  generateShadeMap,
  invertedIndexMap,
  regularIndexMap,
} from "@/lib/themeMaker/colorHelper";

interface Props {
  insertProfile: (profile: ThemeDataConfig) => void;
}

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const generateThemeConfig = (
  vibrant: ColorTriplet,
  alternate: ColorTriplet
): ThemeDataConfig => {
  const baseColor = `#${rgb.hex(vibrant)}`;
  const { index, shadeMap } = generateShadeMap(baseColor as HexColor, 17);

  const mainAccentTypes: Exclude<AccentColors, "site">[] = [
    "primary",
    "saturated",
    "middle",
    "soft",
    "pastel",
    "light",
  ];

  const isInverted = index > 9;

  const indexMap = isInverted ? invertedIndexMap : regularIndexMap;

  const accentColors: any = {};

  mainAccentTypes.forEach((accentType) => {
    accentColors[accentType] = hex.rgb(shadeMap[indexMap[accentType]]);
  });

  const { shadeMap: gradientShadeMap } = generateShadeMap(
    `#${rgb.hex(alternate)}`,
    32
  );

  const paletteData: RawColorPaletteData = {
    ...(accentColors as Record<Exclude<AccentColors, "site">, ColorTriplet>),
    widget: [
      {
        type: "linear-gradient",
        angle: 30,
        stops: [
          {
            at: 20,
            color: hex.rgb(gradientShadeMap[isInverted ? 22 : 1]),
            opacity: 1,
            isWidgetOpacity: true,
          },
          {
            at: 80,
            color: hex.rgb(gradientShadeMap[isInverted ? 25 : 2]),
            opacity: 1,
            isWidgetOpacity: true,
          },
        ],
      },
    ],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            at: 15,
            color: hex.rgb(gradientShadeMap[isInverted ? 19 : 2]),
            opacity: 1,
          },
          {
            at: 85,
            color: hex.rgb(gradientShadeMap[isInverted ? 25 : 3]),
            opacity: 1,
          },
        ],
      },
    ],
  };

  return {
    palette: paletteData,
    siteThemeColor: gradientShadeMap[isInverted ? 20 : 4],
    favicon: {
      mode: "separate",
      gradient: [
        {
          stops: [
            { color: gradientShadeMap[isInverted ? 22 : 10], offset: 0.0 },
            { color: gradientShadeMap[isInverted ? 16 : 4], offset: 1.0 },
          ],
        },
      ],
    },
  };
};

export default function ImageUploadButton({ insertProfile }: Props) {
  const { appendToast } = useToast();
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

      const newThemeConfig = generateThemeConfig(
        vibrantColors,
        alternateColors
      );

      insertProfile(newThemeConfig);

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
      className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square"
      disabled={isLoading}
    >
      <input
        type="file"
        ref={uploadImageInputRef}
        onChange={handleImageUpload}
        accept={allowedMimeTypes.join(", ")}
        className="w-0 h-0 m-0 p-0 border-none border-0 absolute opacity-0"
      />
      <PhotoIcon
        className={`w-full h-auto aspect-square transition-opacity duration-300 ease-out ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      />
    </button>
  );
}
