"use client";

import { useUser } from "@/components/contexts/UserContext";
import { Fragment } from "react";

export default function MenuEntriesUtility() {
  const { user } = useUser();
  return [
    "resetSettings",
    "clearCachedUserData",
    ...(user !== null ? ["logOut", "deleteAccount"] : []),
  ].map((item, index) => (
    <Fragment key={item}>
      {index !== 0 && (
        <div className="border-primary border-0.4 border-opacity-20" />
      )}
      <button className="w-full h-10 my-2 font-normal text-base md:text-lg">
        Placeholder
      </button>
    </Fragment>
  ));
}
