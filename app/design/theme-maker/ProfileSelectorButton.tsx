"use client";

import { useEffect, useState } from "react";

interface Props {
  onClick: () => void;
  startingDimension?: number;
}

export default function ProfileSelectorButton({
  onClick,
  startingDimension = 4,
}: Props) {
  const [dimension, setDimension] = useState(startingDimension);

  useEffect(() => {
    setDimension(4);
  }, []);

  return (
    <button
      style={{ width: `${dimension}rem`, transition: "width 300ms ease-out" }}
      className="rounded-xl bg-page h-16 shadow-lg border-2 border-saturated"
      onClick={onClick}
    />
  );
}
