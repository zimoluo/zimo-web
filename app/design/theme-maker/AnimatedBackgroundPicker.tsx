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
  "pixelland",
  "crimson",
  "underwater",
  "bewitched",
  "midnight",
  "glitter",
  "stars",
  "halloween",
  "christmas",
  "birthday",
  "rainbow",
  "sky",
  "storm",
  "grass",
  "gold",
  "verdant",
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
