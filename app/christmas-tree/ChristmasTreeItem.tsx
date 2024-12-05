"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import spriteStyle from "./sprite.module.css";
import Image from "next/image";
import windowStyle from "./confirm-window.module.css";
import ChristmasTreeMessageWindow from "./ChristmasTreeMessageWindow";
import { useSettings } from "@/components/contexts/SettingsContext";

export default function ChristmasTreeItem({
  position,
  sprite,
  from,
  message,
  uniqueId,
  isPublic = false,
}: TreeContent) {
  const { appendPopUp } = usePopUp();
  const { settings } = useSettings();

  return (
    <button
      className={`-translate-x-1/2 -translate-y-1/2 ${
        spriteStyle.sizing
      } absolute ${isPublic ? "cursor-pointer" : "cursor-default"}`}
      style={{
        left: `${position[0] / 10}%`,
        top: `${position[1] / 10}%`,
      }}
      onClick={() => {
        if (!isPublic) {
          return;
        }

        const hasSeenThisMessage =
          settings.viewedChristmasTreeMessages.includes(uniqueId);

        appendPopUp({
          contextKey: `christmas-tree-item-${uniqueId}`,
          darkOpacity: 0.25,
          content: (
            <div className={`${windowStyle.sizing}`}>
              <ChristmasTreeMessageWindow
                from={from}
                message={message}
                sprite={sprite}
                uniqueId={uniqueId}
                spoilerWarning={(() => {
                  if (hasSeenThisMessage) {
                    return false;
                  }

                  const today = new Date();
                  const month = today.getMonth();
                  const date = today.getDate();

                  return !(
                    (
                      (month === 11 && date >= 25) ||
                      (month === 0 && date <= 31)
                    ) // December 25th to January 31st
                  );
                })()}
              />
            </div>
          ),
        });
      }}
    >
      <div className="relative w-full h-full group">
        <Image
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${sprite}.svg`}
          className="w-full h-full object-contain drop-shadow-md"
          alt={sprite}
          height={100}
          width={100}
          draggable={false}
        />
        <p
          className={`text-saturated ${spriteStyle.textFancy} font-fancy ${spriteStyle.text} opacity-40 duration-300 ease-in-out group-hover:opacity-90 group-hover:scale-110 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center`}
        >
          {from}
        </p>
      </div>
    </button>
  );
}
