"use client";

import type { MenuUtility } from "@/src/lib/navigation-types";
import { useUser } from "@/components/contexts/UserContext";
import { Fragment } from "react";
import MenuUtilityButton from "./MenuUtilityButton";

export default function MenuEntriesUtility() {
  const { user } = useUser();
  return (
    [
      "resetSettings",
      "resetProfiles",
      "resetAllData",
      ...(user !== null
        ? ["logOut", "manuallyDownloadSettings", "deleteAccount"]
        : []),
    ] as MenuUtility[]
  ).map((item, index) => (
    <Fragment key={item}>
      {index !== 0 && (
        <div className="border-text/20 border-[0.4px]/20" />
      )}
      <MenuUtilityButton
        utility={item}
        needsConfirm={[
          "deleteAccount",
          "resetSettings",
          "resetProfiles",
          "manuallyDownloadSettings",
          "resetAllData",
        ].includes(item)}
      />
    </Fragment>
  ));
}
