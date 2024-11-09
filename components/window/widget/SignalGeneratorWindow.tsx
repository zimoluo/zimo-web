"use client";

import { useRef, useState } from "react";
import WindowSlideMenuWrapper from "../WindowSlideMenuWrapper";
import SignalGeneratorInterface from "./SignalGeneratorInterface";
import ExpandMenuButton from "@/components/widgets/ExpandMenuButton";
import NotificationStylePicker from "@/components/mainPage/menu/settings/NotificationStylePicker";
import { EntryWindowProvider } from "@/components/contexts/EntryWindowContext";
import { useSettings } from "@/components/contexts/SettingsContext";

export default function SignalGeneratorWindow(preset: Partial<ToastEntry>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={`w-full h-full bg-widget-80 relative`}>
      <div className="w-full h-full relative">
        <SignalGeneratorInterface {...preset} />
      </div>
      <div
        className={`right-3 top-3 absolute h-8 w-8 bg-light rounded-md shadow-md pointer-events-none select-none touch-none transition-opacity duration-300 ease-out ${
          settings.notificationStyle === "banner" ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
      <EntryWindowProvider
        slug="placeholder"
        setSlug={() => {}}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      >
        <WindowSlideMenuWrapper
          menuButtonRef={menuButtonRef}
          direction="right"
          maxWidth="20rem"
        >
          <div className="w-full h-full bg-widget-100 backdrop-blur-xl px-8 pt-14 pb-8 rounded-l-xl overflow-y-auto">
            <NotificationStylePicker />
          </div>
        </WindowSlideMenuWrapper>
      </EntryWindowProvider>
      <div className="right-4 top-4 absolute h-6 w-6 flex items-center justify-center">
        <ExpandMenuButton
          className="relative"
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          buttonRef={menuButtonRef}
        />
      </div>
    </div>
  );
}
