"use client";

import { useEffect, useState } from "react";

export default function HomeSecretText() {
  const [titleName, setTitleName] = useState("Zimo");
  useEffect(() => {
    if (Math.random() < 0.01127) {
      const nameChoices = ["Kawarage", "Eunoe", "ZIMO"];
      setTitleName(nameChoices[Math.floor(Math.random() * nameChoices.length)]);
    }
  }, []);

  return titleName;
}
