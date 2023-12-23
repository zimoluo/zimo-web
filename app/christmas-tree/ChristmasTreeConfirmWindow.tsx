"use client";

import { useUser } from "@/components/contexts/UserContext";
import { useState } from "react";
import Image from "next/image";
import { fetchAddTreeContent } from "@/lib/dataLayer/client/specialServiceClient";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";

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
    <div className="rounded-xl border border-saturated border-opacity-75 w-full h-full px-3 py-3 bg-widget-100 relative flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 rounded-full border border-saturated border-opacity-75 h-auto aspect-square bg-widget-100">
        <Image
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${selectedData.sprite}.svg`}
          className="w-2/3 h-auto aspect-square object-contain"
          height={100}
          width={100}
          alt="Selected sprite"
        />
      </div>
      <p>From...</p>
      <input
        type="text"
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.value.length <= 100) {
            setName(event.target.value);
          }
        }}
        placeholder={`Your name to be displayed on the Christmas tree...`}
        className="w-full py-2 px-3 border-transparent bg-transparent placeholder:text-saturated placeholder:text-opacity-70"
      />
      <hr className="w-full border-t-0.8 border-saturated border-opacity-75 my-6" />
      <textarea
        className={`w-full h-40 border-transparent bg-transparent placeholder:text-saturated placeholder:text-opacity-70`}
        value={message}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (event.target.value.length <= 800) {
            setMessage(event.target.value);
          }
        }}
        placeholder="Leave your message here..."
      />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none flex-grow"
      />
      <hr className="w-full border-t-0.8 border-saturated border-opacity-75 my-6" />
      <div className="flex space-x-2 ">
        <button className="w-1/3" onClick={onClose}>
          Cancel
        </button>
        <button className="w-2/3" onClick={decorateTree}>
          Decorate!
        </button>
      </div>
    </div>
  );
}
