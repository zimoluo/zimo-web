"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import ProfileSelectorButton from "./ProfileSelectorButton";
import selectorStyle from "./profile-selector.module.css";
import AddProfileButton from "./AddProfileButton";
import { handleThemeConfigUpload } from "./ImportProfileButton";
import { useToast } from "@/components/contexts/ToastContext";
import { useTheme } from "@/components/contexts/ThemeContext";
import { useRef, useState } from "react";

interface Props {
  hasAddProfileButton?: boolean;
  applyThemeDataConfig?: boolean;
  allowRemoveProfile?: boolean;
  className?: string;
  allowImportProfile?: boolean;
}

export default function ThemeProfileSelector({
  hasAddProfileButton = false,
  applyThemeDataConfig,
  allowRemoveProfile = false,
  className = "",
  allowImportProfile = false,
}: Props) {
  const { settings } = useSettings();
  const { appendToast } = useToast();
  const { insertThemeProfile } = useTheme();

  const canUseDragAndDrop = allowImportProfile && !settings.disableGestures;

  const [isFileHoveringOver, setIsFileHoveringOver] = useState(false);
  const dragCounterRef = useRef(0);

  const resetFileHovering = () => {
    setIsFileHoveringOver(false);
    dragCounterRef.current = 0;
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleProfileUpload = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsFileHoveringOver(false);
    dragCounterRef.current = 0;

    const files = event.dataTransfer.files;

    if (!files || files.length === 0) {
      return;
    }

    await handleThemeConfigUpload(files, 20, insertThemeProfile, appendToast);
  };

  return (
    <div
      className={`relative ${className}`}
      onDrop={(event) => {
        if (!canUseDragAndDrop) {
          return;
        }

        handleProfileUpload(event);
      }}
      onDragOver={(event) => {
        if (!canUseDragAndDrop) {
          return;
        }

        handleDragOver(event);
      }}
      onDragEnter={(e) => {
        if (!canUseDragAndDrop) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        if (dragCounterRef.current <= 0) {
          setIsFileHoveringOver(true);
        }
        dragCounterRef.current++;
      }}
      onDragLeave={(e) => {
        if (!canUseDragAndDrop) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current--;
        if (dragCounterRef.current <= 0) {
          setIsFileHoveringOver(false);
          dragCounterRef.current = 0;
        }
      }}
      onMouseUp={resetFileHovering}
      onTouchEnd={resetFileHovering}
    >
      <div className="relative grid">
        <div
          className={`${
            selectorStyle.container
          } pb-3 pt-3 -mt-3 px-4 -mx-4 transition-opacity duration-150 ease-out ${
            canUseDragAndDrop && isFileHoveringOver
              ? "opacity-0"
              : "opacity-100"
          }`}
        >
          {hasAddProfileButton && <AddProfileButton />}
          {settings.customThemeData.map((customTheme, index) => (
            <div
              key={index}
              style={generateInlineStyleObject(
                Object.fromEntries(
                  Object.entries(customTheme.palette).filter(
                    ([key]) => key !== "pageMinimal" && key !== "widget"
                  )
                )
              )}
            >
              <ProfileSelectorButton
                index={index}
                applyThemeDataConfig={applyThemeDataConfig}
                allowRemoveProfile={allowRemoveProfile}
              />
            </div>
          ))}
        </div>
      </div>
      {canUseDragAndDrop && (
        <div
          className={`absolute left-0 w-full shadow-lg rounded-xl bg-pastel bg-opacity-40 backdrop-blur-lg flex items-center justify-center transition-all duration-150 ease-out ${
            canUseDragAndDrop && isFileHoveringOver
              ? "opacity-100"
              : "invisible opacity-0 pointer-events-none select-none"
          } ${selectorStyle.dropIndicator}`}
        >
          <p className="text-center text-lg font-bold">
            Drop profiles to import
          </p>
        </div>
      )}
    </div>
  );
}
