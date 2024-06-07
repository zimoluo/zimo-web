"use client";

import { useUser } from "@/components/contexts/UserContext";
import { Fragment } from "react";
import MenuUtilityButton from "./MenuUtilityButton";

export default function MenuEntriesUtility() {
  const { user } = useUser();
  return (
    [
      "resetSettings",
      "resetProfiles",
      ...(user !== null
        ? ["logOut", "manuallyDownloadSettings", "deleteAccount"]
        : []),
    ] as MenuUtility[]
  ).map((item, index) => (
    <Fragment key={item}>
      {index !== 0 && (
        <div className="border-primary border-0.4 border-opacity-20" />
      )}
      <MenuUtilityButton
        utility={item}
        needsConfirm={[
          "deleteAccount",
          "resetSettings",
          "resetProfiles",
          "manuallyDownloadSettings",
        ].includes(item)}
      />
    </Fragment>
  ));
}
