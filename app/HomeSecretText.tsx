"use client";

import { useToast } from "@/components/contexts/ToastContext";
import { useEffect, useState } from "react";

export default function HomeSecretText() {
  const [titleName, setTitleName] = useState("Zimo");
  useEffect(() => {
    if (Math.random() < 0.01127) {
      const nameChoices = ["Kawarage", "Eunoe", "ZIMO"];
      setTitleName(nameChoices[Math.floor(Math.random() * nameChoices.length)]);
    }
  }, []);

  const { appendToast } = useToast();

  return (
    <>
      <button
        className="shadow-lg rounded-xl bg-widget-70 backdrop-blur-lg px-4 py-4 mb-2"
        onClick={() => {
          appendToast({
            title: "Zimo Web",
            description: "1st!",
          });
        }}
      >
        Add some toast
      </button>
      <button
        className="shadow-lg rounded-xl bg-widget-70 backdrop-blur-lg px-4 py-4 mb-2"
        onClick={() => {
          appendToast({
            title: " Web",
            description: "2nd!",
          });
        }}
      >
        Add aawawawa
      </button>
      <button
        className="shadow-lg rounded-xl bg-widget-70 backdrop-blur-lg px-4 py-4 mb-2"
        onClick={() => {
          appendToast({
            title: "Zimawawawawawawawawawao Web",
            description: "3rd!",
          });
        }}
      >
        muda
      </button>
    </>
  );
}
