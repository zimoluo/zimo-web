"use client";

import Image from "next/image";
import windowStyle from "./confirm-window.module.css";
import { usePopUpAction } from "@/components/contexts/PopUpActionContext";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { useState } from "react";

export default function ChristmasTreeMessageWindow({
  from,
  message,
  sprite,
  spoilerWarning = false,
}: Pick<TreeContent, "from" | "message" | "sprite"> & {
  spoilerWarning?: boolean;
}) {
  const { closePopUp } = usePopUpAction();
  const [hasSpoilerWarning, setHasSpoilerWarning] = useState(spoilerWarning);

  return (
    <div className="rounded-3xl w-full h-full bg-widget-90 shadow-xl relative overflow-hidden">
      <div className="absolute top-1 right-1 rotate-22.5 opacity-15 w-3/5 h-auto aspect-square">
        <Image
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${sprite}.svg`}
          className="w-full h-full aspect-square object-contain"
          height={300}
          width={300}
          alt={`${from}'s ${sprite} message`}
        />
      </div>
      <div className="w-full h-full relative px-6 py-6 flex flex-col">
        <p className={`text-2xl font-fancy mt-2 ${windowStyle.textShadow}`}>
          From {from}
        </p>
        <hr className="mt-7 mb-11 border-saturated border-t opacity-50" />
        <p
          className={`w-full flex-grow mb-4 text-lg ${windowStyle.textShadow}`}
        >
          {enrichTextContent(message)}
        </p>
        <div className="w-full flex justify-end">
          <button
            className="rounded-xl font-fancy bg-light text-center bg-opacity-80 h-14 text-xl shadow-lg px-6"
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
                className="h-12 w-44 text-xl rounded-xl bg-light text-center bg-opacity-80 shadow-lg"
                onClick={closePopUp}
              >
                Maybe later
              </button>
              <button
                className="h-12 w-44 text-xl rounded-xl bg-pastel text-center bg-opacity-80 shadow-lg"
                onClick={() => {
                  setHasSpoilerWarning(false);
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
