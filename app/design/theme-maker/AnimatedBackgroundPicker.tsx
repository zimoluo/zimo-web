"use client";

import AnimatedBackgroundPickerButton from "./AnimatedBackgroundPickerButton";
import pickerStyle from "./background-picker.module.css";

const availableAnimatedBackgroundKeys: (ThemeAnimatedBackgroundKey | null)[] = [
  null,
  "home",
  "photos",
  "blog",
  "projects",
  "bubbles",
  "penumbra",
  "midnight",
  "glitter",
  "stars",
  "halloween",
  "christmas",
  "birthday",
  "rainbow",
  "gold",
  "grass",
  "sky",
  "storm",
  "pixelland",
  "verdant",
];

export default function AnimatedBackgroundPicker() {
  return (
    <div
      className={`w-full ${pickerStyle.container} justify-center items-start bg-light bg-opacity-80 rounded-xl p-4 overflow-y-auto`}
    >
      {availableAnimatedBackgroundKeys.map((key, index) => (
        <AnimatedBackgroundPickerButton key={index} animationKey={key} />
      ))}
    </div>
  );
}
