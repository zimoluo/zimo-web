"use client";

import { useUser } from "@/components/contexts/UserContext";
import { Fragment } from "react";
import MenuUtilityButton from "./MenuUtilityButton";

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
      <MenuUtilityButton
        utility={item as MenuUtility}
        needsConfirm={(item as MenuUtility) === "deleteAccount"}
      />
    </Fragment>
  ));
}
