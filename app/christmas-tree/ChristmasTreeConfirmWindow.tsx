"use client";

import { useUser } from "@/components/contexts/UserContext";
import { useState } from "react";
import Image from "next/image";
import { fetchAddTreeContent } from "@/lib/dataLayer/client/specialServiceClient";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";
import windowStyle from "./confirm-window.module.css";

interface Props {
  position: [number, number];
  onClose: () => void;
}

export default function ChristmasTreeConfirmWindow({
  position,
  onClose,
}: Props) {
  const { user } = useUser();
  const { selectedData, fetchAndSetTreeData } = useChristmasTreeSelector();
  const [name, setName] = useState<string>(user ? user.name : "");
  const [message, setMessage] = useState("");

  const decorateTree = async () => {
    const treeData: TreeContent = {
      date: new Date().toISOString(),
      from: name,
      message: message,
      sprite: selectedData.sprite,
      position: position,
    };

    await fetchAddTreeContent(treeData);
    await fetchAndSetTreeData();
    onClose();
  };

  return (
    <div className="rounded-xl border-2 border-saturated border-opacity-75 w-full h-full px-5 py-4 bg-widget-100 relative flex flex-col">
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${windowStyle.iconBox} overflow-hidden rounded-full border-2 border-saturated border-opacity-75 h-auto aspect-square bg-widget-100 flex items-center justify-center`}
      >
        <Image
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${selectedData.sprite}.svg`}
          className={`${windowStyle.icon} h-auto aspect-square object-contain`}
          height={100}
          width={100}
          alt="Selected sprite"
        />
      </div>
      <p className="text-2xl font-fancy mt-2 mb-4">From...</p>
      <input
        type="text"
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.value.length <= 100) {
            setName(event.target.value);
          }
        }}
        placeholder={`Name to be displayed...`}
        className="w-full px-2 text-lg resize-none border-transparent bg-transparent placeholder:text-saturated placeholder:text-opacity-70"
      />
      <hr className="w-full border-t-0.8 border-saturated border-opacity-75 mb-6 mt-2" />
      <textarea
        className={`px-2.5 py-1.5 w-full resize-none flex-grow border border-saturated border-opacity-75 rounded-xl bg-transparent placeholder:text-saturated placeholder:text-opacity-70`}
        value={message}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (event.target.value.length <= 800) {
            setMessage(event.target.value);
          }
        }}
        placeholder="Leave your message here..."
      />
      <hr className="w-full border-t-0.8 border-saturated border-opacity-75 mt-6 mb-4" />
      <div className="flex space-x-2 ">
        <button
          className="w-1/2 rounded-xl border border-saturated border-opacity-75 h-12 text-lg"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="w-1/2 rounded-xl font-fancy border border-saturated border-opacity-75 h-12 text-xl"
          onClick={decorateTree}
        >
          Decorate!
        </button>
      </div>
    </div>
  );
}
