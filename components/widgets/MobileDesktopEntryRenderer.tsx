"use client";

import { ReactNode, useEffect, useState } from "react";

interface Props {
  mobile?: ReactNode;
  desktop?: ReactNode;
}

export default function MobileDesktopEntryRenderer({ mobile, desktop }: Props) {
  const [shouldRender, setShouldRender] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const handleResize = () => {
      setShouldRender(window.innerWidth >= 768 ? 1 : 2);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {(shouldRender === 0 || shouldRender === 1) && (
        <div className="hidden md:block">{desktop}</div>
      )}
      {(shouldRender === 0 || shouldRender === 2) && (
        <div className="block md:hidden">{mobile}</div>
      )}
    </>
  );
}
