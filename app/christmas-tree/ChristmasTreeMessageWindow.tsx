"use client";

import Image from "next/image";
import windowStyle from "./confirm-window.module.css";
import { usePopUpAction } from "@/components/contexts/PopUpActionContext";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { useState } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import _ from "lodash";

export default function ChristmasTreeMessageWindow({
  from,
  message,
  sprite,
  uniqueId,
  spoilerWarning = false,
}: Pick<TreeContent, "from" | "message" | "sprite" | "uniqueId"> & {
  spoilerWarning?: boolean;
}) {
  const { closePopUp } = usePopUpAction();
  const [hasSpoilerWarning, setHasSpoilerWarning] = useState(spoilerWarning);
  const { settings, updateSettings } = useSettings();

  return (
    <div className="rounded-[2rem] w-full h-full bg-widget-90 shadow-xl relative overflow-hidden">
      <div className="absolute top-1 right-1 rotate-[22.5deg] opacity-15 w-3/5 h-auto aspect-square pointer-events-none select-none touch-none">
        <Image
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${sprite}.svg`}
          className="w-full h-full aspect-square object-contain"
          height={300}
          width={300}
          alt={`${from}'s ${sprite} message`}
          draggable={false}
        />
      </div>
      <div className="w-full h-full relative p-3 flex flex-col">
        <p
          className={`p-4 rounded-[1.25rem] shadow-lg bg-light/65 backdrop-blur-sm border border-highlight-light/15 text-2xl font-fancy mb-8 ${windowStyle.textShadow}`}
        >
          From {from}
        </p>
        <p
          className={`w-full flex-grow mb-4 px-2 text-lg ${windowStyle.textShadow}`}
        >
          {enrichTextContent(message)}
        </p>
        <div className="w-full flex justify-end">
          <button
            className={`rounded-full font-fancy ${windowStyle.buttonBg} border-reflect-light transition-colors duration-300 ease-out text-center h-11 text-lg shadow-lg px-4`}
            onClick={closePopUp}
          >
            Happy Holidays!
          </button>
        </div>
      </div>
      {spoilerWarning && ( // This is like an initial flag which should save some resources if spoilerWarning isn't true in the first place
        <div
          className={`absolute w-full h-full left-0 top-0 backdrop-blur-md bg-light bg-opacity-40 p-6 ${
            hasSpoilerWarning
              ? ""
              : "opacity-0 pointer-events-none select-none touch-none"
          } transition-opacity duration-150 ease-out`}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="font-bold text-2xl text-center mb-4">Wait!</p>
            <p className="max-w-full text-xl w-96 mb-14">
              {
                "The Spirit of Christmas hasn\u2019t arrived yet! Are you sure you want to open this message?"
              }
            </p>
            <div className="flex flex-col gap-9">
              <button
                className={`h-12 w-44 text-xl rounded-full ${windowStyle.buttonBg} transition-colors duration-300 ease-out text-center shadow-lg border-reflect-light`}
                onClick={closePopUp}
              >
                Maybe later
              </button>
              <button
                className={`h-12 w-44 text-xl rounded-full ${windowStyle.buttonBgAlt} transition-colors duration-300 ease-out text-center shadow-lg border-reflect-pastel`}
                onClick={() => {
                  setHasSpoilerWarning(false);
                  updateSettings({
                    viewedChristmasTreeMessages: _.uniq([
                      ...settings.viewedChristmasTreeMessages,
                      uniqueId,
                    ]),
                  });
                }}
              >
                {"I\u2019m ready!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
