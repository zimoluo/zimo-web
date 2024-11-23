"use client";

import { useUser } from "@/components/contexts/UserContext";
import { useState } from "react";
import Image from "next/image";
import { fetchAddTreeContent } from "@/lib/dataLayer/client/specialServiceClient";
import windowStyle from "./confirm-window.module.css";
import { usePopUpAction } from "@/components/contexts/PopUpActionContext";

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
  const { closePopUp } = usePopUpAction();

  const [name, setName] = useState<string>(user ? user.name : "");
  const [message, setMessage] = useState("");

  const decorateTree = async () => {
    const treeData: TreeContent = {
      date: "", // Date will be given on the server side.
      from: name.trim(),
      message: message.trim(),
      sprite: selectedData.sprite,
      position: position,
    };

    await fetchAddTreeContent(treeData);
    await fetchAndSetTreeData();
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
            className={`${windowStyle.icon} h-auto aspect-square object-contain`}
            height={100}
            width={100}
            alt="Selected sprite"
          />
        </div>
      </div>
      <textarea
        className={`px-3 py-2 mb-4 w-full resize-none text-lg flex-grow bg-light bg-opacity-80 rounded-xl shadow-lg bg-none placeholder:text-saturated placeholder:text-opacity-70`}
        value={message}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (event.target.value.length <= 800) {
            setMessage(event.target.value);
          }
        }}
        placeholder="Leave your message here..."
      />
      <div className="grid grid-cols-2 gap-4">
        <button
          className="w-full rounded-xl bg-light bg-opacity-80 h-12 text-lg shadow-lg"
          onClick={closePopUp}
        >
          Cancel
        </button>
        <button
          className="w-full rounded-xl font-fancy bg-light bg-opacity-80 h-12 text-xl shadow-lg"
          onClick={decorateTree}
        >
          Decorate!
        </button>
      </div>
    </div>
  );
}
