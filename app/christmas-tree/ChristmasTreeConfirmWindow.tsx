"use client";

import { useUser } from "@/components/contexts/UserContext";
import { useState } from "react";
import Image from "next/image";
import { fetchAddTreeContent } from "@/lib/dataLayer/client/specialServiceClient";
import windowStyle from "./confirm-window.module.css";
import { usePopUpAction } from "@/components/contexts/PopUpActionContext";
import { useToast } from "@/components/contexts/ToastContext";
import SettingsFlip from "@/components/mainPage/menu/settings/SettingsFlip";
import { useSettings } from "@/components/contexts/SettingsContext";
import _ from "lodash";

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
  const [isPublic, setIsPublic] = useState(true);

  const decorateTree = async () => {
    const treeData: TreeContent = {
      date: "", // Date will be given on the server side.
      from: name.trim(),
      message: message.trim(),
      sprite: selectedData.sprite,
      position: position.map((num) => Number(num.toFixed(3))) as [
        number,
        number
      ],
      isPublic,
      uniqueId: "", // Unique ID will be given on the server side.
    };

    const result = await fetchAddTreeContent(treeData);
    await fetchAndSetTreeData();
    if (result) {
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

  return (
    <div className="rounded-3xl w-full h-full px-5 py-4 bg-widget-90 shadow-xl flex flex-col">
      <div className="flex gap-4">
        <div className="flex-grow mb-4 h-24">
          <p className="text-2xl font-fancy mt-2 mb-4">From</p>
          <input
            type="text"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.value.length <= 100) {
                setName(event.target.value);
              }
            }}
            placeholder="Name..."
            className="w-full px-3 font-bold text-lg resize-none border-transparent bg-none bg-light bg-opacity-80 shadow-lg h-10 rounded-xl placeholder:text-saturated placeholder:text-opacity-70"
          />
        </div>
        <div className="rounded-full w-24 h-24 bg-light bg-opacity-80 shadow-lg aspect-square flex items-center justify-center">
          <Image
            src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${selectedData.sprite}.svg`}
            className={`${windowStyle.icon} h-auto aspect-square object-contain drop-shadow-md`}
            height={100}
            width={100}
            alt="Selected sprite"
          />
        </div>
      </div>
      <div className="w-full flex-grow mb-4 relative">
        <textarea
          className={`relative px-3 py-2 w-full h-full resize-none text-lg bg-light bg-opacity-80 rounded-xl shadow-lg bg-none placeholder:text-saturated placeholder:text-opacity-70`}
          value={message}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (event.target.value.length <= 800) {
              setMessage(event.target.value);
            }
          }}
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
          className={`w-full rounded-xl ${windowStyle.buttonBg} transition-colors duration-300 ease-out h-12 text-lg shadow-lg`}
          onClick={closePopUp}
        >
          Cancel
        </button>
        <button
          className={`w-full rounded-xl font-fancy ${windowStyle.buttonBg} transition-colors duration-300 ease-out h-12 text-xl shadow-lg`}
          onClick={decorateTree}
        >
          Decorate!
        </button>
      </div>
    </div>
  );
}
