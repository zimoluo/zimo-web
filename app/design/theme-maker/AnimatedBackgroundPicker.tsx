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
  "memories",
  "bewitched",
  "dusk",
  "eventide",
  "meadowland",
  "murk",
  "pixelland",
  "crimson",
  "underwater",
  "gallery",
  "gallery3D",
  "celebration",
  "stars",
  "halloween",
  "birthday",
  "birthday19",
  "christmas",
  "midnight",
  "glitter",
  "sky",
  "storm",
  "rainbow",
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
