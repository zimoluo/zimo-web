"use client";

import AnimatedBackgroundPickerButton from "./AnimatedBackgroundPickerButton";
import pickerStyle from "./background-picker.module.css";

const availableAnimatedBackgroundKeys: (ThemeAnimatedBackgroundKey | null)[] = [
  null,
  "home",
  "photos",
  "blog",
  "projects",
  "perpetuity",
  "bubbles",
  "pixelland",
  "dusk",
  "bewitched",
  "crimson",
  "underwater",
  "midnight",
  "glitter",
  "celebration",
  "stars",
  "halloween",
  "christmas",
  "birthday",
  "birthday19",
  "rainbow",
  "sky",
  "storm",
  "gallery",
  "grass",
  "gold",
  "verdant",
  "eep",
];

export default function AnimatedBackgroundPicker() {
  return (
    <div
      className={`w-full ${pickerStyle.container} justify-center items-start bg-light bg-opacity-80 shadow-lg rounded-xl p-5 overflow-y-auto`}
    >
      {availableAnimatedBackgroundKeys.map((key, index) => (
        <AnimatedBackgroundPickerButton key={index} animationKey={key} />
      ))}
    </div>
  );
}
