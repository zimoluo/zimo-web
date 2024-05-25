"use client";

import { ReactNode, useEffect, useState } from "react";

interface Props {
  children?: ReactNode;
}

export default function DropdownMenuWrapper({ children }: Props) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  return (
    <div
      className="transition-opacity duration-150 ease-out"
      style={{ opacity: opacity }}
    >
      {children}
    </div>
  );
}
