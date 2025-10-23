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
      <EntryWindowProvider
        slug="placeholder"
        setSlug={() => {}}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      >
        <WindowSlideMenuWrapper
          menuButtonRef={menuButtonRef}
          direction="right"
          maxWidth="18rem"
        >
          <div className="w-full h-full px-4 pt-14 pb-4 overflow-y-auto">
            <NotificationStylePicker />
          </div>
        </WindowSlideMenuWrapper>
      </EntryWindowProvider>
      <div className="right-4 top-4 absolute h-8 w-8 scale-90 flex items-center justify-center">
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
