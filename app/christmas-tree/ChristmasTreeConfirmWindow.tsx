"use client";

import { useUser } from "@/components/contexts/UserContext";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { fetchAddTreeContent } from "@/lib/dataLayer/client/specialServiceClient";
import windowStyle from "./confirm-window.module.css";
import { usePopUpAction } from "@/components/contexts/PopUpActionContext";
import { useToast } from "@/components/contexts/ToastContext";
import SettingsFlip from "@/components/mainPage/menu/settings/SettingsFlip";
import { useSettings } from "@/components/contexts/SettingsContext";
import _ from "lodash";
import boxStyle from "./box.module.css";
import spriteStyle from "./sprite.module.css";
import { availableSprites } from "./ChristmasTreeButtonGrid";

interface Props {
  position: [number, number];
  selectedData: TreeSelection;
  fetchAndSetTreeData: () => Promise<void>;
}

export default function ChristmasTreeConfirmWindow({
  position,
  selectedData,
  fetchAndSetTreeData,
}: Props) {
  const { user } = useUser();
  const { updateSettings, settings } = useSettings();
  const { closePopUp } = usePopUpAction();
  const { appendToast } = useToast();

  const [name, setName] = useState<string>(user ? user.name : "");
  const [message, setMessage] = useState("");
  const [selectedSprite, setSelectedSprite] = useState<string>(
    selectedData.sprite
  );
  const [isPublic, setIsPublic] = useState(true);
  const [isChangingSprite, setIsChangingSprite] = useState(false);

  const spriteChangeBoxRef = useRef<HTMLDivElement>(null);

  const toggleChangingSprite = () => {
    setIsChangingSprite((prev) => !prev);
  };

  const decorateTree = async () => {
    if (name.trim().length === 0 || message.trim().length === 0) {
      appendToast({
        title: "Zimo Web",
        description: "Name and message cannot be empty.",
      });
      return;
    }

    const treeData: TreeContent = {
      date: "", // Date will be given on the server side.
      from: name.trim(),
      message: message.trim(),
      sprite: selectedSprite,
      position: position.map((num) => parseFloat(num.toFixed(3))) as [
        number,
        number
      ],
      isPublic,
      neverShowSpoilerWarning: false, // special flag to indicate this message is never a spoiler. not supposed to be user-settable. is always false except for one message from me.
      uniqueId: "", // Unique ID will be given on the server side.
    };

    const result = await fetchAddTreeContent(treeData);
    await fetchAndSetTreeData();
    if (result && result.length > 0) {
      appendToast({
        title: "Zimo Web",
        description: "Message added to the tree!",
      });
      updateSettings({
        viewedChristmasTreeMessages: _.uniq([
          ...settings.viewedChristmasTreeMessages,
          result[result.length - 1].uniqueId,
        ]),
      });
    } else {
      appendToast({
        title: "Zimo Web",
        description: "Failed to add message to the tree.",
      });
    }

    closePopUp();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        spriteChangeBoxRef.current &&
        !spriteChangeBoxRef.current.contains(target)
      ) {
        setIsChangingSprite(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <div className="rounded-[2rem] w-full h-full px-4 py-4 bg-widget-90 shadow-xl flex flex-col outline outline-1 outline-highlight-light/15">
      <div className="flex gap-4">
        <div className="flex-grow mb-4 h-24">
          <p className="text-2xl font-fancy mt-2 mb-4">From</p>
          <input
            type="text"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            maxLength={500}
            placeholder="Name..."
            className="w-full px-3 font-bold text-lg resize-none border border-highlight-light/15 bg-none bg-light bg-opacity-80 shadow-lg h-10 rounded-full placeholder:text-saturated placeholder:text-opacity-70"
          />
        </div>
        <div
          className="w-24 h-24 rounded-full relative"
          ref={spriteChangeBoxRef}
        >
          <button
            onClick={toggleChangingSprite}
            className="rounded-full w-24 h-24 bg-light bg-opacity-80 shadow-lg border-reflect-light aspect-square flex items-center justify-center relative"
          >
            <Image
              src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${selectedSprite}.svg`}
              className={`${windowStyle.icon} ${
                isChangingSprite ? spriteStyle.shakeSpin : ""
              } rotate-0 translate-x-0 translate-y-0 h-auto aspect-square object-contain drop-shadow-md`}
              height={100}
              width={100}
              draggable={false}
              alt="Change selected sprite"
            />
          </button>
          <div
            className={`absolute ${
              boxStyle.changeSpriteBox
            } rounded-2xl z-10 transition-[transform,opacity,filter] duration-200 ease-out backdrop-blur-sm ${
              isChangingSprite
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 -translate-y-2 pointer-events-none blur-[8px]"
            }`}
          >
            <div className="w-full h-full border-reflect-light bg-light/65 rounded-2xl shadow-lg">
              <div
                className={`${boxStyle.changeSpriteGrid} w-full h-full overflow-y-auto`}
              >
                {availableSprites.map((spriteOption) => (
                  <button
                    key={spriteOption}
                    onClick={() => {
                      setSelectedSprite(spriteOption);
                      setIsChangingSprite(false);
                    }}
                    className={`${
                      selectedSprite === spriteOption
                        ? boxStyle.selectedSpriteBorder
                        : ""
                    } w-auto h-auto flex items-center justify-center`}
                  >
                    <Image
                      src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${spriteOption}.svg`}
                      className={`w-auto h-auto aspect-square object-contain drop-shadow-md transition-transform duration-200 ease-out hover:scale-105`}
                      height={100}
                      width={100}
                      draggable={false}
                      alt={spriteOption}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-grow mb-4 relative">
        <textarea
          className={`relative px-3 py-2 w-full h-full resize-none text-lg bg-light bg-opacity-80 rounded-2xl border border-highlight-light/15 shadow-lg bg-none placeholder:text-saturated placeholder:text-opacity-70`}
          value={message}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setMessage(event.target.value);
          }}
          maxLength={4000}
          placeholder="Leave your message here..."
        />
        <div className="absolute bottom-4 right-4 flex gap-1.5 items-center">
          <button onClick={() => setIsPublic(false)}>
            <p
              className={`${isPublic ? "" : "font-bold"} w-16 text-center h-6`}
            >
              Private
            </p>
          </button>
          <div className="h-7">
            <SettingsFlip
              defaultDimension={false}
              className="h-full"
              state={isPublic}
              onClick={() => setIsPublic((prev) => !prev)}
            />
          </div>
          <button onClick={() => setIsPublic(true)}>
            <p
              className={`${!isPublic ? "" : "font-bold"} w-16 text-center h-6`}
            >
              Public
            </p>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          className={`w-full rounded-full ${windowStyle.buttonBg} transition-colors duration-300 ease-out h-12 text-lg shadow-lg border-reflect-light`}
          onClick={closePopUp}
        >
          Cancel
        </button>
        <button
          className={`w-full rounded-full font-fancy ${windowStyle.buttonBg} transition-colors duration-300 ease-out h-12 text-xl shadow-lg border-reflect-light`}
          onClick={decorateTree}
        >
          Decorate!
        </button>
      </div>
    </div>
  );
}
