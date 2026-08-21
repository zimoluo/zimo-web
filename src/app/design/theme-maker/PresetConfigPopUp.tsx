"use client";

import { usePopUpAction } from "@/components/contexts/PopUpActionContext";
import configStyle from "./preset-config-button.module.css";
import PresetConfigLayout from "./PresetConfigLayout";

export default function PresetConfigPopUp() {
  const { closePopUp } = usePopUpAction();
  return (
    <PresetConfigLayout
      close={closePopUp}
      className={`${configStyle.window} rounded-[2rem] shadow-xl surface-widget surface-widget-60 outline-1 outline-edge/15`}
    />
  );
}
